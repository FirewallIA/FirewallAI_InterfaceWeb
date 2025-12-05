import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFirewallRules } from '@/lib/data';
import { FirewallRule } from '@/lib/types';

const FirewallRules: React.FC = () => {
  // On récupère refetch de React Query
  const { data, isLoading, error, refetch } = useFirewallRules();
  
  // États pour les animations
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddRule = () => {
    alert('Add rule functionality would be implemented here');
  };

  const handleEditRule = (id: string) => {
    alert(`Edit rule ${id}`);
  };

  // --- FONCTION REFRESH ---
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error("Erreur lors du rafraîchissement", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // --- FONCTION DELETE (Modifiée: sans confirmation) ---
  const handleDeleteRule = async (id: string) => {
    // J'ai supprimé la ligne de confirmation ici.
    // L'action est maintenant immédiate.

    try {
      setIsDeleting(id); // Feedback visuel immédiat (spinner)
      
      const response = await fetch(`/api/firewall/rules/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      await refetch(); // Mise à jour de la liste
      
    } catch (err: any) {
      console.error(err);
      alert("Erreur: Impossible de supprimer la règle");
    } finally {
      setIsDeleting(null);
    }
  };

  // --- VUE CHARGEMENT ---
  if (isLoading) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Firewall Rules</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-7 bg-[#1a1d25]" disabled>
              <i className="ri-refresh-line"></i>
            </Button>
            <Button className="bg-primary-600 text-white text-xs h-7" disabled>
              <i className="ri-add-line mr-1"></i> Add Rule
            </Button>
          </div>
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

  // --- VUE ERREUR ---
  if (error) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Firewall Rules</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#1a1d25] hover:bg-[#222631] h-7"
              onClick={handleRefresh}
            >
              <i className="ri-refresh-line"></i>
            </Button>
            <Button
              className="bg-primary-600 hover:bg-primary-500 text-white text-xs h-7"
              onClick={handleAddRule}
            >
              <i className="ri-add-line mr-1"></i> Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-400">
            Error loading firewall rules
          </div>
        </CardContent>
      </Card>
    );
  }

  const rules: FirewallRule[] = data?.rules || [];

  // --- VUE PRINCIPALE ---
  return (
    <Card className="bg-[#11131a] border-[#1a1d25]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">Firewall Rules</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1a1d25] hover:bg-[#222631] h-7 text-gray-400 hover:text-white border-[#2a2e3b]"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Rafraîchir la liste"
          >
            <i className={`ri-refresh-line ${isRefreshing ? 'animate-spin' : ''}`}></i>
          </Button>

          <Button
            className="bg-primary-600 hover:bg-primary-500 text-white text-xs h-7"
            onClick={handleAddRule}
          >
            <i className="ri-add-line mr-1"></i> Add Rule
          </Button>
        </div>
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