import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assure-toi d'avoir ces composants ou utilise des <select> natifs
import { useFirewallRules } from '@/lib/data';
import { FirewallRule } from '@/lib/types';

// État initial d'une nouvelle règle
const initialRuleState = {
  name: '',
  source_ip: 'any',
  dest_ip: 'any',
  source_port: '*',
  dest_port: '*',
  protocol: 'TCP',
  action: 'deny'
};

const FirewallRules: React.FC = () => {
  const { data, isLoading, error, refetch } = useFirewallRules();
  
  // États
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // États pour le formulaire d'ajout
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRule, setNewRule] = useState(initialRuleState);

  // --- REFRESH ---
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try { await refetch(); } 
    catch (err) { console.error(err); } 
    finally { setTimeout(() => setIsRefreshing(false), 500); }
  };

  // --- DELETE ---
  const handleDeleteRule = async (id: string) => {
    try {
      setIsDeleting(id);
      const response = await fetch(`/api/firewall/rules/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error("Erreur suppression");
      await refetch();
    } catch (err: any) {
      console.error(err);
      alert("Erreur: Impossible de supprimer la règle");
    } finally {
      setIsDeleting(null);
    }
  };

  // --- CREATE (Nouvelle fonction) ---
  const handleCreateRule = async () => {
    // Validation basique
    if (!newRule.name.trim()) {
      alert("Le nom de la règle est obligatoire");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/firewall/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création");
      }

      // Succès : On ferme, on reset et on refresh
      setIsAddModalOpen(false);
      setNewRule(initialRuleState);
      await refetch();

    } catch (err: any) {
      console.error(err);
      alert(`Erreur création: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRule = (id: string) => {
    alert(`Edit rule ${id} - À implémenter`);
  };

  // --- UI HELPERS ---
  const updateField = (field: string, value: string) => {
    setNewRule(prev => ({ ...prev, [field]: value }));
  };

  // --- RENDER LOADING / ERROR ---
  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView onRefresh={handleRefresh} onAdd={() => setIsAddModalOpen(true)} />;

  const rules: FirewallRule[] = data?.rules || [];

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
          >
            <i className={`ri-refresh-line ${isRefreshing ? 'animate-spin' : ''}`}></i>
          </Button>

          {/* BOUTON ADD + MODAL */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-500 text-white text-xs h-7">
                <i className="ri-add-line mr-1"></i> Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1d25] border-[#2a2e3b] text-white">
              <DialogHeader>
                <DialogTitle>Add Firewall Rule</DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Name */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right text-gray-400">Name</Label>
                  <Input 
                    id="name" 
                    value={newRule.name} 
                    onChange={(e) => updateField('name', e.target.value)} 
                    className="col-span-3 bg-[#11131a] border-[#2a2e3b] text-white" 
                    placeholder="My Rule"
                  />
                </div>

                {/* Action & Protocol */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-gray-400">Action</Label>
                  <div className="col-span-3 flex gap-4">
                    <select 
                      className="flex h-9 w-full rounded-md border border-[#2a2e3b] bg-[#11131a] px-3 py-1 text-sm shadow-sm transition-colors text-white"
                      value={newRule.action}
                      onChange={(e) => updateField('action', e.target.value)}
                    >
                      <option value="allow">Allow</option>
                      <option value="deny">Deny</option>
                    </select>
                    
                    <select 
                      className="flex h-9 w-full rounded-md border border-[#2a2e3b] bg-[#11131a] px-3 py-1 text-sm shadow-sm transition-colors text-white"
                      value={newRule.protocol}
                      onChange={(e) => updateField('protocol', e.target.value)}
                    >
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                      <option value="ICMP">ICMP</option>
                      <option value="any">Any</option>
                    </select>
                  </div>
                </div>

                {/* Source IP */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sip" className="text-right text-gray-400">Source IP</Label>
                  <Input 
                    id="sip" 
                    value={newRule.source_ip} 
                    onChange={(e) => updateField('source_ip', e.target.value)}
                    className="col-span-3 bg-[#11131a] border-[#2a2e3b] text-white" 
                  />
                </div>

                {/* Dest IP */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dip" className="text-right text-gray-400">Dest IP</Label>
                  <Input 
                    id="dip" 
                    value={newRule.dest_ip} 
                    onChange={(e) => updateField('dest_ip', e.target.value)}
                    className="col-span-3 bg-[#11131a] border-[#2a2e3b] text-white" 
                  />
                </div>

                {/* Ports */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dport" className="text-right text-gray-400">Dest Port</Label>
                  <Input 
                    id="dport" 
                    value={newRule.dest_port} 
                    onChange={(e) => updateField('dest_port', e.target.value)}
                    className="col-span-3 bg-[#11131a] border-[#2a2e3b] text-white" 
                    placeholder="80, 443 or *"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                    variant="outline" 
                    onClick={() => setIsAddModalOpen(false)} 
                    className="border-[#2a2e3b] text-white hover:bg-[#2a2e3b]"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleCreateRule} 
                    className="bg-primary-600 hover:bg-primary-500 text-white"
                    disabled={isSubmitting}
                >
                  {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i> Saving...
                      </>
                  ) : "Create Rule"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-[#1a1d25]">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Proto</th>
                <th className="pb-2 font-medium">"Source -> Dest"</th>
                <th className="pb-2 font-medium">Action</th>
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
                      <span className="text-xs bg-[#1a1d25] px-2 py-1 rounded-md text-gray-300">
                        {rule.protocol}
                      </span>
                    </td>
                    <td className="py-3">
                       <div className="text-xs text-gray-400">
                           {rule.source} <i className="ri-arrow-right-line mx-1"></i> {rule.destination}:{rule.port}
                       </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs ${
                        rule.action?.toLowerCase() === 'allow' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                        } px-2 py-1 rounded-full uppercase`}>
                        {rule.action}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-white" onClick={() => handleEditRule(rule.id)}>
                          <i className="ri-edit-line"></i>
                        </button>
                        <button 
                          className={`${isDeleting === rule.id ? 'text-red-700' : 'text-gray-400 hover:text-red-500'}`}
                          onClick={() => handleDeleteRule(rule.id)}
                          disabled={isDeleting === rule.id}
                        >
                          {isDeleting === rule.id ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-delete-bin-line"></i>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">No firewall rules configured</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// Petits composants utilitaires pour alléger le code principal
const LoadingView = () => (
    <Card className="bg-[#11131a] border-[#1a1d25]">
      <CardContent className="pt-6"><div className="animate-pulse space-y-3"><div className="h-8 bg-gray-700 rounded w-full"></div></div></CardContent>
    </Card>
);

const ErrorView = ({ onRefresh, onAdd }: any) => (
    <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Firewall Rules</CardTitle>
          <div className="flex gap-2">
             <Button onClick={onRefresh} size="sm" variant="outline"><i className="ri-refresh-line"></i></Button>
             <Button onClick={onAdd} size="sm" className="bg-primary-600">Add Rule</Button>
          </div>
        </CardHeader>
        <CardContent><div className="text-center py-8 text-red-400">Error loading firewall rules</div></CardContent>
    </Card>
);

export default FirewallRules;