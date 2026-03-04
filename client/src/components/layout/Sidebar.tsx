import React from 'react';
import { Link, useLocation } from 'wouter';
import FirewallLogo from '../FirewallLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type NavTag = 'soon' | 'demo' | null;

interface NavItem {
  path: string;
  label: string;
  icon: string;
  tag?: NavTag;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();
  
  const navigationItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: 'ri-dashboard-fill' },
    { path: '/firewall-rules', label: 'Firewall Rules', icon: 'ri-shield-keyhole-line' },
    { path: '/network-monitor', label: 'Network Monitor', icon: 'ri-radar-line' },
    { path: '/threat-detection', label: 'Threat Detection', icon: 'ri-alarm-warning-line', tag: 'demo' },
    { path: '/logs-analysis', label: 'Logs Analysis', icon: 'ri-file-list-3-line', tag: 'soon' },
    { path: '/ai-assistant', label: 'AI Assistant', icon: 'ri-robot-line' },
    { path: '/edr-monitoring', label: 'EDR Monitoring', icon: 'ri-computer-line', tag: 'soon' },
    { path: '/settings', label: 'Settings', icon: 'ri-settings-4-line' },
  ];

  // CORRECTION : 
  // 'lg:static' permet à la sidebar d'être dans le flux (pousser le contenu) sur grand écran.
  // 'fixed inset-y-0 left-0' ne s'applique qu'en mobile.
  const sidebarClasses = `w-64 bg-[#11131a] border-r border-[#1a1d25] h-screen z-50 transition-all duration-300
    ${isOpen ? 'fixed inset-y-0 left-0 translate-x-0' : 'hidden lg:block lg:static'}`;

  const renderBadge = (tag?: NavTag) => {
    if (!tag) return null;
    const colors = tag === 'soon' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400';
    return (
      <span className={`text-[9px] font-bold uppercase tracking-wider ${colors} px-1.5 py-0.5 rounded ml-auto`}>
        {tag === 'soon' ? 'Soon' : 'Demo'}
      </span>
    );
  };

  return (
    <>
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-center h-36 border-b border-[#1a1d25]">
          <FirewallLogo className="h-36" />
        </div>
        
        <div className="py-4 overflow-y-auto">
          <nav>
            <ul className="space-y-1 px-2">
              {navigationItems.map((item) => {
                const isActive = location === item.path;
                const linkClasses = `flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive 
                    ? 'text-white bg-primary-600' 
                    : 'text-gray-400 hover:bg-[#1a1d25] hover:text-white'
                }`;
                
                return (
                  <li key={item.path}>
                    <Link href={item.path} onClick={onClose} className={linkClasses}>
                      <div className="flex items-center gap-3">
                        <i className={`${item.icon} text-lg`}></i>
                        <span>{item.label}</span>
                      </div>
                      {renderBadge(item.tag)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 border-t border-[#1a1d25] p-4 bg-[#11131a]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
              <i className="ri-user-line text-white"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">admin@firewallai.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay pour fermer en mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;