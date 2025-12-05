import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirewallRules } from '@/lib/data';
import { FirewallRule } from '@/lib/types';

const FirewallRules: React.FC = () => {
  // CHANGEMENT ICI : On récupère 'refetch' au lieu de 'mutate'
  // React Query renvoie automatiquement cette fonction.
  const { data, isLoading, error, refetch } = useFirewallRules();

  // État pour l'animation de chargement sur le bouton delete
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAddRule = () => {
    alert('Add rule functionality would be implemented here');
  };

  const handleEditRule = (id: string) => {
    alert(`Edit rule ${id}`);
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette règle ?")) return;

    try {
      setIsDeleting(id); // Active l'icône de chargement

      // 1. Appel API de suppression
      const response = await fetch(`/api/firewall/rules/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // 2. MAGIE REACT QUERY : On rafraîchit seulement ce bloc
      await refetch();
      
      console.log(`Règle ${id} supprimée`);

    } catch (err: any) {
      console.error(err);
      alert("Erreur: Impossible de supprimer la règle");
    } finally {
      setIsDeleting(null);
    }
  };

  // --- Le reste de l'affichage (Loading / Error) reste identique ---

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
                          className={`${isDeleting === rule.id ? 'text-red-700' : 'text-gray-400 hover:text-red-500'}`}
                          onClick={() => handleDeleteRule(rule.id)}
                          disabled={isDeleting === rule.id}
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