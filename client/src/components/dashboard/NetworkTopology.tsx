import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

// Fonction utilitaire pour parser le message brut venant du Rust
// Format : "[SystemTime { tv_sec: 1770569501, ... }] [WARN] TRAFFIC DENY | Proto: 6 | ..."
const parseLogMessage = (rawMsg: string, _serverTimestamp: string): TrafficLog | null => {
  try {
    // 1. MODIFICATION DE LA REGEX
    // On remplace (\d+) par ([a-zA-Z0-9]+) pour accepter "6", "TCP", "ICMP", etc.
    const trafficRegex = /TRAFFIC (ALLOW|DENY)\s*\|\s*Proto:\s*([a-zA-Z0-9]+)\s*\|\s*([\d\.]+):(\d+)\s*->\s*([\d\.]+):(\d+)/;
    
    const match = rawMsg.match(trafficRegex);

    // Si pas de match, on arrête tout de suite
    if (!match) return null;

    const [_, actionStr, protoRaw, srcIp, srcPort, destIp, destPort] = match;

    // ... extraction du timestamp (inchangé) ...
    let finalTimestamp = new Date().toLocaleTimeString();
    const timeRegex = /tv_sec:\s*(\d+)/;
    const timeMatch = rawMsg.match(timeRegex);
    if (timeMatch) {
        const seconds = parseInt(timeMatch[1], 10);
        if (!isNaN(seconds) && seconds > 0) {
            finalTimestamp = new Date(seconds * 1000).toLocaleTimeString();
        }
    }

    // 2. MODIFICATION DE LA LOGIQUE PROTOCOLE
    // Le serveur peut envoyer "6" (Live) ou "TCP" (DB). Il faut gérer les deux.
    let protoName = protoRaw; // Par défaut, on prend ce qu'on a reçu (ex: "ICMP")

    // Si c'est un chiffre (ex: "6"), on le convertit en nom
    if (!isNaN(Number(protoRaw))) {
        if (protoRaw === "6") protoName = "TCP";
        else if (protoRaw === "17") protoName = "UDP";
        else if (protoRaw === "1") protoName = "ICMP";
        else protoName = `PROTO-${protoRaw}`;
    } 
    // Sinon, c'est déjà du texte (ex: "ICMP" venant de la DB), on le garde tel quel.

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: finalTimestamp,
      srcIp,
      srcPort: parseInt(srcPort),
      destIp,
      destPort: parseInt(destPort),
      protocol: protoName, // On utilise notre variable nettoyée
      action: actionStr === 'ALLOW' ? 'ALLOWED' : 'BLOCKED',
    };
  } catch (e) {
    console.error("Erreur parsing log:", e);  
    return null;
  }
};

const NetworkTrafficLog: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<TrafficLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to Log Stream via WS");
      setIsConnected(true);
      setIsLoading(false);
      ws.send(JSON.stringify({ type: 'subscribe_logs' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'log_entry') {
           // data.payload.message contient la longue chaine avec SystemTime
           const newLog = parseLogMessage(data.payload.message, data.payload.timestamp);
           
           if (newLog) {
             setLogs((prevLogs) => [newLog, ...prevLogs].slice(0, 50));
           }
        }
      } catch (err) {
        console.error("Error parsing WS message", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleClearLogs = () => {
    setLogs([]);
  };

  const getStatusColor = (action: string) => {
    switch (action) {
      case 'ALLOWED': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'BLOCKED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'ALERT': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-[#11131a] border-[#1a1d25] w-full">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-[#1a1d25]">
        <div className="flex items-center gap-2">
            <CardTitle className="text-white text-sm font-medium">Network Traffic Log</CardTitle>
            <span className={`text-xs px-2 py-0.5 rounded-full border border-[#2a2e3b] transition-colors ${isConnected ? 'text-green-400 bg-green-900/20' : 'text-gray-500 bg-[#1a1d25]'}`}>
                {isConnected ? '● Live gRPC' : '○ Connecting...'}
            </span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1a1d25] hover:bg-[#222631] h-7 border-[#2a2e3b] text-gray-400 hover:text-white"
            onClick={handleClearLogs}
          >
            <i className="ri-delete-bin-line mr-1"></i> Clear
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <table className="w-full text-left text-xs">
                <thead className="text-gray-400 bg-[#15171f] uppercase font-medium border-b border-[#1a1d25] sticky top-0 z-10">
                    <tr>
                        <th scope="col" className="px-4 py-3">Timestamp</th>
                        <th scope="col" className="px-4 py-3">Source</th>
                        <th scope="col" className="px-4 py-3"></th>
                        <th scope="col" className="px-4 py-3">Destination</th>
                        <th scope="col" className="px-4 py-3">Protocol</th>
                        <th scope="col" className="px-4 py-3 text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1d25]">
                    {logs.length === 0 && !isLoading ? (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-600">
                                Waiting for traffic events...
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr key={log.id} className="hover:bg-[#1a1d25] transition-colors group animate-in fade-in slide-in-from-top-1 duration-300">
                                <td className="px-4 py-3 text-gray-500 font-mono whitespace-nowrap">
                                    {log.timestamp}
                                </td>
                                <td className="px-4 py-3 text-gray-300 font-mono">
                                    <div className="flex flex-col">
                                        <span className="text-blue-400">{log.srcIp}</span>
                                        <span className="text-[10px] text-gray-500">:{log.srcPort}</span>
                                    </div>
                                </td>
                                <td className="px-1 py-3 text-gray-600">
                                    <i className="ri-arrow-right-line"></i>
                                </td>
                                <td className="px-4 py-3 text-gray-300 font-mono">
                                    <div className="flex flex-col">
                                        <span className="text-orange-400">{log.destIp}</span>
                                        <span className="text-[10px] text-gray-500">:{log.destPort}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant="outline" className="bg-[#1f232e] text-gray-300 border-[#2a2e3b] font-mono font-normal">
                                        {log.protocol}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Badge variant="outline" className={`font-normal ${getStatusColor(log.action)}`}>
                                        {log.action}
                                    </Badge>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
        
        <div className="bg-[#0f1116] px-4 py-2 border-t border-[#1a1d25] flex justify-between items-center text-[10px] text-gray-500">
            <span>Buffer: {logs.length} events</span>
            <span className="flex items-center gap-1">
                {isConnected && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                {isConnected ? 'Receiving data' : 'Disconnected'}
            </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkTrafficLog;