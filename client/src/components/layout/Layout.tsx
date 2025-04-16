import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile, shown on toggle or on larger screens */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button 
          type="button" 
          onClick={toggleSidebar}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          <i className="ri-menu-line text-2xl"></i>
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#0b0f19]">
        <TopNavbar />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
