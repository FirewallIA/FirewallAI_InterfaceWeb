import React from 'react';
import { useLocation } from 'wouter';
import FirewallLogo from '../FirewallLogo';

const TopNavbar: React.FC = () => {
  const [location] = useLocation();
  
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
      default:
        return 'FirewallAI';
    }
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
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
