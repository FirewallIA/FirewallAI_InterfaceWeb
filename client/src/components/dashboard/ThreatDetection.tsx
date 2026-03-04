import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Remplacement par des classes complètes pour éviter que Tailwind ne les supprime (purge)
const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case 'High':
      return { bg: 'bg-red-500/20', text: 'text-red-500', badge: 'text-red-400' };
    case 'Medium':
      return { bg: 'bg-orange-500/20', text: 'text-orange-500', badge: 'text-orange-400' };
    case 'Low':
      return { bg: 'bg-blue-500/20', text: 'text-blue-500', badge: 'text-blue-400' };
    default:
      return { bg: 'bg-gray-500/20', text: 'text-gray-500', badge: 'text-gray-400' };
  }
};

const getIconForThreatType = (type: string) => {
  if (type.includes('Ransomware')) return 'ri-virus-line';
  if (type.includes('Login')) return 'ri-spam-2-line';
  if (type.includes('Brute Force')) return 'ri-door-lock-line';
  if (type.includes('Port Scan')) return 'ri-scan-line';
  return 'ri-shield-flash-line';
};

const ThreatDetection: React.FC = () => {
  // Données de démonstration (factices)
  const demoThreats = [
    { id: '1', type: 'Ransomware Activity Pattern', severity: 'High', source: '192.168.1.45', timestamp: '5 mins ago' },
    { id: '2', type: 'Brute Force Login Attempt', severity: 'Medium', source: '45.22.11.90', timestamp: '12 mins ago' },
    { id: '3', type: 'Suspicious Port Scan', severity: 'Low', source: 'External IP', timestamp: '1 hour ago' },
    { id: '4', type: 'Anomalous Admin Login', severity: 'Medium', source: '10.0.0.5', timestamp: '3 hours ago' },
  ];

  return (
    <Card className="bg-[#11131a] border-[#1a1d25]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          <CardTitle className="text-white">Latest Threats</CardTitle>
          
          {/* Tag DEMO VERSION */}
          <span className="flex items-center text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-medium shadow-[0_0_10px_rgba(245,158,11,0.1)]">
            <i className="ri-test-tube-line mr-1.5"></i>
            Demo Version
          </span>
        </div>
        
        <Button variant="link" className="text-primary-400 hover:text-primary-300 text-xs p-0">
          View All
        </Button>
      </CardHeader>
      
      <CardContent>
        {/* L'interface est maintenant pleinement visible (pas d'opacité, pas de flou) */}
        <div className="space-y-4">
          {demoThreats.map((threat) => {
            const styles = getSeverityStyles(threat.severity);
            const icon = getIconForThreatType(threat.type);
            
            return (
              <div key={threat.id} className="bg-[#1a1d25] rounded-lg p-3 flex items-start transition-all hover:bg-[#222631] cursor-default border border-transparent hover:border-[#2a2e3d]">
                <div className={`mr-3 mt-1 ${styles.bg} rounded-full p-1.5`}>
                  <i className={`${icon} ${styles.text}`}></i>
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-white">{threat.type}</h4>
                      <span className={`ml-2 ${styles.bg} ${styles.badge} text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider`}>
                        {threat.severity}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400">From: {threat.source}</p>
                    <p className="text-xs text-gray-500">{threat.timestamp}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Petit texte d'information discret en bas */}
        <div className="mt-4 pt-3 border-t border-[#1a1d25] flex justify-center">
          <p className="text-[10px] text-gray-500 flex items-center">
            <i className="ri-information-line mr-1"></i>
            Showing simulated threat data for demonstration purposes
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatDetection;