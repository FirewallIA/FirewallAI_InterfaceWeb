import React, { useState } from 'react';
import { Alert } from '@/lib/types';

interface AlertBannerProps {
  alert: Alert;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alert }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="mb-6 bg-red-900/30 border border-red-800 rounded-lg p-4 flex items-start">
      <div className="mr-3 bg-red-500/20 rounded-full p-2">
        <i className="ri-alarm-warning-fill text-red-500 text-xl"></i>
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-red-400">{alert.title}</h3>
        <p className="text-sm text-gray-300">{alert.message}</p>
      </div>
      <button 
        className="text-gray-400 hover:text-white"
        onClick={() => setVisible(false)}
      >
        <i className="ri-close-line text-xl"></i>
      </button>
    </div>
  );
};

export default AlertBanner;
