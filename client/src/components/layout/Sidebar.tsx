import React from 'react';
import { Link, useLocation } from 'wouter';
import FirewallLogo from '../FirewallLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();
  
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'ri-dashboard-fill' },
    { path: '/firewall-rules', label: 'Firewall Rules', icon: 'ri-shield-keyhole-line' },
    { path: '/network-monitor', label: 'Network Monitor', icon: 'ri-radar-line' },
    { path: '/threat-detection', label: 'Threat Detection', icon: 'ri-alarm-warning-line' },
    { path: '/logs-analysis', label: 'Logs Analysis', icon: 'ri-file-list-3-line' },
    { path: '/ai-assistant', label: 'AI Assistant', icon: 'ri-robot-line' },
    { path: '/edr-monitoring', label: 'EDR Monitoring', icon: 'ri-computer-line' },
    { path: '/settings', label: 'Settings', icon: 'ri-settings-4-line' },
  ];

  // Determine CSS classes based on whether sidebar is open
  const sidebarClasses = `w-64 bg-[#11131a] border-r border-[#1a1d25] lg:block z-50
    ${isOpen ? 'fixed inset-y-0 left-0' : 'hidden'}`;

  return (
    <aside className={sidebarClasses}>
      {/* Logo area */}
      <div className="flex items-center justify-center h-36 border-b border-[#1a1d25]">
        <FirewallLogo className="h-36" />
      </div>
      
      {/* Navigation links */}
      <div className="py-4">
        <nav>
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const isActive = location === item.path;
              const linkClasses = `flex items-center gap-3 px-4 py-3 text-sm rounded-lg ${
                isActive 
                  ? 'text-white bg-primary-600' 
                  : 'text-gray-400 hover:bg-[#1a1d25]'
              }`;
              
              return (
                <li key={item.path}>
                  <Link href={item.path} onClick={onClose} className={linkClasses}>
                    <i className={`${item.icon} text-lg`}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      {/* User profile area at bottom */}
      <div className="absolute bottom-0 w-64 border-t border-[#1a1d25] p-4">
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

      {/* Mobile overlay close button */}
      {isOpen && (
        <div className="lg:hidden absolute top-4 right-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-300 hover:text-white"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
