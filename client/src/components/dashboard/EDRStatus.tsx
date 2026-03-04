import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'normal':
      return 'bg-green-500/20 text-green-500';
    case 'warning':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'critical':
      return 'bg-red-500/20 text-red-500';
    case 'offline':
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
};

const EDRStatus: React.FC = () => {
  // On utilise des données fictives pour l'aperçu de la fonctionnalité à venir.
  // Les hooks API ont été retirés pour éviter des requêtes inutiles.
  const edrStatus = {
    endpointCoverage: { percentage: 98, protected: 42, total: 43 },
    detectionRate: { percentage: 99.7, lastCalibration: '4 hours ago' }
  };
  
  const activities = [
    { id: '1', device: 'DESKTOP-DEV-01', activity: 'Ransomware behavior blocked', status: 'critical', timestamp: '10 mins ago' },
    { id: '2', device: 'LAPTOP-MKT-04', activity: 'Full system scan completed', status: 'normal', timestamp: '1 hour ago' },
    { id: '3', device: 'SERVER-DB-01', activity: 'Suspicious PowerShell script blocked', status: 'warning', timestamp: '2 hours ago' },
  ];

  return (
    <Card className="bg-[#11131a] border-[#1a1d25] relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white text-gray-300">EDR Monitoring</CardTitle>
        <div className="flex space-x-2">
          {/* Badge Coming Soon */}
          <span className="flex items-center text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-medium">
            <i className="ri-time-line mr-1.5"></i>
            Coming Soon
          </span>
        </div>
      </CardHeader>

      {/* Container relatif pour superposer l'overlay */}
      <CardContent className="relative">
        
        {/* OVERLAY DE BLOCAGE - Indique clairement que c'est indisponible */}
        <div className="absolute inset-0 z-10 backdrop-blur-[3px] bg-[#11131a]/70 flex flex-col items-center justify-center rounded-b-xl pb-4">
          <div className="bg-[#1a1d25] p-3 rounded-full mb-3 border border-[#2a2e3d] shadow-lg">
            <i className="ri-lock-2-line text-2xl text-blue-400"></i>
          </div>
          <h3 className="text-white font-medium mb-1 text-lg">Feature in Development</h3>
          <p className="text-sm text-gray-400 text-center max-w-[250px]">
            Advanced Endpoint Detection & Response is arriving in the next update.
          </p>
        </div>

        {/* CONTENU FLOU ET DÉSACTIVÉ (Aperçu de ce qui arrivera) */}
        <div className="opacity-30 pointer-events-none select-none transition-opacity duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-[#1a1d25] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">Endpoint Coverage</h4>
                <span className="text-green-400">{edrStatus.endpointCoverage.percentage}%</span>
              </div>
              <Progress 
                value={edrStatus.endpointCoverage.percentage} 
                className="bg-[#222631] h-2" 
              />
              <p className="text-xs text-gray-400 mt-2">
                {edrStatus.endpointCoverage.protected} of {edrStatus.endpointCoverage.total} endpoints protected
              </p>
            </div>
            
            <div className="bg-[#1a1d25] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">Threat Detection Rate</h4>
                <span className="text-green-400">{edrStatus.detectionRate.percentage}%</span>
              </div>
              <Progress 
                value={edrStatus.detectionRate.percentage} 
                className="bg-[#222631] h-2" 
              />
              <p className="text-xs text-gray-400 mt-2">Last calibration: {edrStatus.detectionRate.lastCalibration}</p>
            </div>
          </div>
          
          <h4 className="text-sm font-medium text-white mb-3">Recent Endpoint Activities</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-[#1a1d25] rounded-lg p-3 flex items-start">
                <div className={`mr-3 mt-1 ${getStatusIcon(activity.status)} rounded-full p-1.5`}>
                  <i className="ri-computer-line"></i>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{activity.device}</h4>
                  <p className="text-xs text-gray-400 mt-1">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EDRStatus;