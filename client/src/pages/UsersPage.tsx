import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown,
  Edit,
  Trash2,
  UserPlus, 
  Shield, 
  User,
  MoreHorizontal
} from 'lucide-react';

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
}

const UsersPage: React.FC = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  const [newUserData, setNewUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
  });
  
  const [editUserData, setEditUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
  });

  // Requête pour récupérer les utilisateurs
  const { data: usersData, isLoading, error } = useQuery<{ users: UserData[] }>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/users');
        return response.json();
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger la liste des utilisateurs',
          variant: 'destructive',
        });
        throw error;
      }
    },
  });

  // Mutation pour ajouter un utilisateur
  const addUserMutation = useMutation({
    mutationFn: async (userData: typeof newUserData) => {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Utilisateur ajouté avec succès',
      });
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setNewUserData({
        username: '',
        email: '',
        password: '',
        role: 'user',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de l\'ajout de l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour modifier un utilisateur
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof editUserData> }) => {
      const response = await apiRequest('PATCH', `/api/users/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Utilisateur modifié avec succès',
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la modification de l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  // Mutation pour supprimer un utilisateur
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/users/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Succès',
        description: 'Utilisateur supprimé avec succès',
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Erreur lors de la suppression de l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUserMutation.mutate(newUserData);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    // Ne pas envoyer le mot de passe s'il est vide
    const dataToSend = { ...editUserData };
    if (!dataToSend.password) {
      delete (dataToSend as any).password;
    }
    
    updateUserMutation.mutate({ id: selectedUser.id, data: dataToSend });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    deleteUserMutation.mutate(selectedUser.id);
  };

  const openEditDialog = (user: UserData) => {
    setSelectedUser(user);
    setEditUserData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role as 'admin' | 'user',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Obtenir la couleur du badge en fonction du rôle
  const getRoleBadgeVariant = (role: string) => {
    return role === 'admin' ? 'destructive' : 'default';
  };

  // Vérifier si l'utilisateur courant est en train de se modifier lui-même
  const isSelfEdit = (userId: number) => {
    return currentUser?.id === userId;
  };

  if (isLoading) return <div className="flex justify-center items-center h-full"><p>Chargement...</p></div>;
  if (error) return <div className="text-red-500">Erreur: {(error as Error).message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus size={16} />
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <Table>
          <TableCaption>Liste des utilisateurs du système</TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>ID</TableHead>
              <TableHead>Nom d'utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersData?.users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                    {user.role === 'admin' ? (
                      <span className="flex items-center gap-1">
                        <Shield size={12} />
                        Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        Utilisateur
                      </span>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => openEditDialog(user)}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      {!isSelfEdit(user.id) && (
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(user)}
                          className="cursor-pointer text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogue d'ajout d'utilisateur */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>
              Créez un nouvel utilisateur avec un rôle spécifique.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Nom d'utilisateur
                </Label>
                <Input
                  id="username"
                  value={newUserData.username}
                  onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rôle
                </Label>
                <select
                  id="role"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as 'admin' | 'user' })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={addUserMutation.isPending}
              >
                {addUserMutation.isPending ? 'Ajout en cours...' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue de modification d'utilisateur */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-username" className="text-right">
                  Nom d'utilisateur
                </Label>
                <Input
                  id="edit-username"
                  value={editUserData.username}
                  onChange={(e) => setEditUserData({ ...editUserData, username: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-password" className="text-right">
                  Mot de passe
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editUserData.password}
                  onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                  className="col-span-3"
                  placeholder="Laisser vide pour ne pas modifier"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Rôle
                </Label>
                <select
                  id="edit-role"
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value as 'admin' | 'user' })}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isSelfEdit(selectedUser?.id || 0)}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
                {isSelfEdit(selectedUser?.id || 0) && (
                  <p className="col-span-4 text-xs text-muted-foreground text-center">
                    Vous ne pouvez pas modifier votre propre rôle
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? 'Mise à jour...' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.username} ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;