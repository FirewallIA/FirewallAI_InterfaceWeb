import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Assumant que vous avez un composant Badge, sinon on utilisera un span

// Simulation de type de données pour les logs
interface TrafficLog {
  id: string;
  timestamp: string;
  srcIp: string;
  srcPort: number;
  destIp: string;
  destPort: number;
  protocol: string;
  action: 'ALLOWED' | 'BLOCKED' | 'ALERT';
}

const NetworkTrafficLog: React.FC = () => {
  // Simulation des états de chargement (normalement via votre hook useNetworkTopology ou un nouveau hook useNetworkLogs)
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<TrafficLog[]>([]);
  const [error, setError] = useState(false);

  // Simulation du chargement des données
  useEffect(() => {
    // Ici, vous remplaceriez ceci par votre appel API réel
    const fetchLogs = () => {
      setIsLoading(true);
      setTimeout(() => {
        setLogs([
          { id: '1', timestamp: '2023-10-27 10:23:01', srcIp: '192.168.1.105', srcPort: 44321, destIp: '10.0.0.55', destPort: 443, protocol: 'TCP', action: 'ALLOWED' },
          { id: '2', timestamp: '2023-10-27 10:23:05', srcIp: '192.168.1.200', srcPort: 55432, destIp: '172.16.0.4', destPort: 22, protocol: 'SSH', action: 'BLOCKED' },
          { id: '3', timestamp: '2023-10-27 10:23:12', srcIp: '10.0.0.55', srcPort: 80, destIp: '192.168.1.105', destPort: 44321, protocol: 'HTTP', action: 'ALLOWED' },
          { id: '4', timestamp: '2023-10-27 10:24:00', srcIp: '45.33.22.11', srcPort: 33001, destIp: '10.0.0.55', destPort: 3389, protocol: 'RDP', action: 'ALERT' },
          { id: '5', timestamp: '2023-10-27 10:24:05', srcIp: '192.168.1.15', srcPort: 12345, destIp: '8.8.8.8', destPort: 53, protocol: 'UDP', action: 'ALLOWED' },
          { id: '6', timestamp: '2023-10-27 10:24:10', srcIp: '192.168.1.105', srcPort: 44325, destIp: '10.0.0.55', destPort: 443, protocol: 'TCP', action: 'ALLOWED' },
          { id: '7', timestamp: '2023-10-27 10:24:15', srcIp: '192.168.1.105', srcPort: 44328, destIp: '10.0.0.55', destPort: 443, protocol: 'TCP', action: 'ALLOWED' },
        ]);
        setIsLoading(false);
      }, 1000);
    };

    fetchLogs();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Re-fetch logic here
    setTimeout(() => setIsLoading(false), 500);
  };

  const getStatusColor = (action: string) => {
    switch (action) {
      case 'ALLOWED': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'BLOCKED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'ALERT': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400';
    }
  };

  // État de chargement (Squelette de tableau)
  if (isLoading) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#1a1d25]">
          <CardTitle className="text-white">Network Traffic Log</CardTitle>
          <div className="flex space-x-2">
             <Button variant="outline" size="sm" className="h-7 bg-[#1a1d25] border-[#2a2e3b]" disabled>
              <i className="ri-download-line"></i>
            </Button>
            <Button variant="outline" size="sm" className="h-7 bg-[#1a1d25] border-[#2a2e3b]" disabled>
              <i className="ri-refresh-line"></i>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between h-8 bg-[#1a1d25] rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Network Traffic Log</CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <i className="ri-refresh-line"></i>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-red-400">
            Unable to load traffic logs.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Affichage principal (Tableau des logs)
  return (
    <Card className="bg-[#11131a] border-[#1a1d25] w-full">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-[#1a1d25]">
        <div className="flex items-center gap-2">
            <CardTitle className="text-white text-sm font-medium">Network Traffic Log</CardTitle>
            <span className="text-xs text-gray-500 bg-[#1a1d25] px-2 py-0.5 rounded-full border border-[#2a2e3b]">
                Live
            </span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1a1d25] hover:bg-[#222631] h-7 border-[#2a2e3b] text-gray-400 hover:text-white"
            onClick={() => alert("Filter functionality")}
          >
            <i className="ri-filter-3-line mr-1"></i> Filter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1a1d25] hover:bg-[#222631] h-7 border-[#2a2e3b] text-gray-400 hover:text-white"
            onClick={handleRefresh}
          >
            <i className="ri-refresh-line"></i>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative overflow-x-auto">
            <table className="w-full text-left text-xs">
                <thead className="text-gray-400 bg-[#15171f] uppercase font-medium border-b border-[#1a1d25]">
                    <tr>
                        <th scope="col" className="px-4 py-3">Timestamp</th>
                        <th scope="col" className="px-4 py-3">Source</th>
                        <th scope="col" className="px-4 py-3"></th> {/* Flèche */}
                        <th scope="col" className="px-4 py-3">Destination</th>
                        <th scope="col" className="px-4 py-3">Protocol</th>
                        <th scope="col" className="px-4 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1d25]">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-[#1a1d25] transition-colors group">
                            <td className="px-4 py-3 text-gray-500 font-mono whitespace-nowrap">
                                {log.timestamp}
                            </td>
                            
                            {/* Source */}
                            <td className="px-4 py-3 text-gray-300 font-mono">
                                <div className="flex flex-col">
                                    <span className="text-blue-400">{log.srcIp}</span>
                                    <span className="text-[10px] text-gray-500">Port: {log.srcPort}</span>
                                </div>
                            </td>

                            {/* Direction Icon */}
                            <td className="px-1 py-3 text-gray-600">
                                <i className="ri-arrow-right-line"></i>
                            </td>

                            {/* Destination */}
                            <td className="px-4 py-3 text-gray-300 font-mono">
                                <div className="flex flex-col">
                                    <span className="text-orange-400">{log.destIp}</span>
                                    <span className="text-[10px] text-gray-500">Port: {log.destPort}</span>
                                </div>
                            </td>

                            {/* Protocol */}
                            <td className="px-4 py-3">
                                <span className="bg-[#1f232e] text-gray-300 px-2 py-1 rounded text-[10px] border border-[#2a2e3b] font-mono">
                                    {log.protocol}
                                </span>
                            </td>

                            {/* Action / Status */}
                            <td className="px-4 py-3 text-right">
                                <span className={`text-[10px] px-2 py-1 rounded border font-medium ${getStatusColor(log.action)}`}>
                                    {log.action}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* Footer style "Terminal" */}
        <div className="bg-[#0f1116] px-4 py-2 border-t border-[#1a1d25] flex justify-between items-center text-[10px] text-gray-500">
            <span>Showing {logs.length} latest events</span>
            <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Logging active
            </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkTrafficLog;