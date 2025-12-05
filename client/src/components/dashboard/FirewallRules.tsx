import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirewallRules } from '@/lib/data';
import { FirewallRule } from '@/lib/types';

const FirewallRules: React.FC = () => {
  // 1. On récupère 'mutate' depuis le hook pour rafraîchir la liste après suppression
  // Si ton hook ne retourne pas mutate, il faudra l'ajouter dans @/lib/data
  const { data, isLoading, error, mutate } = useFirewallRules();
  
  // État local pour gérer un chargement pendant la suppression (éviter le double clic)
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAddRule = () => {
    alert('Add rule functionality would be implemented here');
  };

  const handleEditRule = (id: string) => {
    alert(`Edit rule ${id}`);
  };

  // --- FONCTION DE SUPPRESSION CONNECTÉE ---
  const handleDeleteRule = async (id: string) => {
    // 1. Confirmation utilisateur
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette règle ?")) {
      return;
    }

    try {
      // Indiquer visuellement que ça charge pour cet ID spécifique
      setIsDeleting(id);

      // 2. Appel à ton API Node.js (qui appellera gRPC)
      const response = await fetch(`/api/firewall/rules/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Ajoute ton header d'auth ici si nécessaire (ex: Authorization: `Bearer ${token}`)
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression");
      }

      // 3. Rafraîchissement des données (Revalidation)
      // Cela va relancer l'appel GET en arrière-plan et mettre à jour le tableau
      if (mutate) {
        await mutate(); 
      } else {
        // Fallback si mutate n'est pas dispo (moins propre mais fonctionnel)
        window.location.reload(); 
      }
      
      console.log(`Règle ${id} supprimée avec succès`);

    } catch (err: any) {
      console.error("Erreur Delete:", err);
      alert(`Impossible de supprimer la règle : ${err.message}`);
    } finally {
      // Arrêter l'état de chargement
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Firewall Rules</CardTitle>
          <Button className="bg-primary-600 text-white text-xs h-8" disabled>
            <i className="ri-add-line mr-1"></i> Add Rule
          </Button>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
             {/* Skeleton loader simple */}
             <div className="h-8 bg-gray-700 rounded w-full"></div>
             <div className="h-8 bg-gray-700 rounded w-full"></div>
             <div className="h-8 bg-gray-700 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardContent>
          <div className="text-center py-8 text-red-400">
            Error loading firewall rules
          </div>
        </CardContent>
      </Card>
    );
  }

  const rules: FirewallRule[] = data?.rules || [];

  return (
    <Card className="bg-[#11131a] border-[#1a1d25]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">Firewall Rules</CardTitle>
        <Button
          className="bg-primary-600 hover:bg-primary-500 text-white text-xs h-8"
          onClick={handleAddRule}
        >
          <i className="ri-add-line mr-1"></i> Add Rule
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-[#1a1d25]">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.length > 0 ? (
                rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-[#1a1d25]">
                    <td className="py-3">
                      <div className="flex items-center">
                        <i className={`${rule.status === 'Active' ? 'ri-shield-check-line text-green-500' : 'ri-shield-cross-line text-gray-500'} mr-2`}></i>
                        <span className="text-sm text-white">{rule.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-xs bg-[#1a1d25] px-2 py-1 rounded-md">
                        {rule.type || 'Inbound'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs ${
                        rule.status === 'Active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-gray-500/20 text-gray-400'
                        } px-2 py-1 rounded-full`}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button 
                          className="text-gray-400 hover:text-white"
                          onClick={() => handleEditRule(rule.id)}
                          disabled={isDeleting === rule.id}
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                        
                        {/* BOUTON DELETE CONNECTÉ */}
                        <button 
                          className={`${isDeleting === rule.id ? 'text-red-700 animate-pulse' : 'text-gray-400 hover:text-red-500'}`}
                          onClick={() => handleDeleteRule(rule.id)}
                          disabled={isDeleting === rule.id}
                          title="Supprimer la règle"
                        >
                          {isDeleting === rule.id ? (
                            <i className="ri-loader-4-line animate-spin"></i>
                          ) : (
                            <i className="ri-delete-bin-line"></i>
                          )}
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No firewall rules configured
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirewallRules;