import React from 'react';
import logoPath from '@assets/logoV1.png';

interface FirewallLogoProps {
  className?: string;
}

const FirewallLogo: React.FC<FirewallLogoProps> = ({ className }) => {
  return (
    <img 
      src={logoPath} 
      alt="FirewallAI" 
      className={className} 
    />
  );
};

export default FirewallLogo;
