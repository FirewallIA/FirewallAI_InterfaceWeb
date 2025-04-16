import React, { useState } from 'react';
import { useLocation } from 'wouter';
import FirewallLogo from '../FirewallLogo';
import { useAuth } from '@/hooks/use-auth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings, User } from 'lucide-react';

const TopNavbar: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  // Get page title based on current location
  const getPageTitle = () => {
    switch (location) {
      case '/':
        return 'Dashboard';
      case '/firewall-rules':
        return 'Firewall Rules';
      case '/network-monitor':
        return 'Network Monitor';
      case '/threat-detection':
        return 'Threat Detection';
      case '/logs-analysis':
        return 'Logs Analysis';
      case '/ai-assistant':
        return 'AI Assistant';
      case '/edr-monitoring':
        return 'EDR Monitoring';
      case '/settings':
        return 'Settings';
      case '/users':
        return 'Gestion des utilisateurs';
      default:
        return 'FirewallAI';
    }
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-[#11131a] border-b border-[#1a1d25] p-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-white">{getPageTitle()}</h1>
          </div>
          <div className="lg:hidden">
            <FirewallLogo className="h-8" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-64 bg-[#1a1d25] border border-[#222631] rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <i className="ri-search-line absolute right-3 top-2.5 text-gray-400"></i>
          </div>
          
          <button type="button" className="p-2 rounded-full hover:bg-[#1a1d25] relative">
            <i className="ri-notification-3-line text-xl"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button type="button" className="p-2 rounded-full hover:bg-[#1a1d25]">
            <i className="ri-question-line text-xl"></i>
          </button>
          
          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 p-1 rounded hover:bg-[#1a1d25]">
                <Avatar className="h-8 w-8 bg-primary-700 border border-primary-500/50">
                  <AvatarFallback className="text-sm font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-white hidden sm:inline-block">
                  {user?.username || 'Utilisateur'}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#11131a] border-[#1a1d25]">
              <DropdownMenuLabel className="text-white">Mon compte</DropdownMenuLabel>
              
              <DropdownMenuSeparator className="bg-[#1a1d25]" />
              
              <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2 focus:bg-[#1a1d25]"
                onClick={() => setLocation('/settings')}
              >
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              
              {user?.role === 'admin' && (
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center gap-2 focus:bg-[#1a1d25]"
                  onClick={() => setLocation('/users')}
                >
                  <User className="h-4 w-4" />
                  <span>Gestion des utilisateurs</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator className="bg-[#1a1d25]" />
              
              <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2 focus:bg-[#1a1d25] text-red-500 focus:text-red-400"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4" />
                <span>{logoutMutation.isPending ? 'Déconnexion...' : 'Se déconnecter'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
