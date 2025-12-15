import { useQuery } from "@tanstack/react-query";
import { 
  SystemStatus, 
  Threat, 
  FirewallRule, 
  EndpointActivity, 
  LogSummary,
  TrafficData,
  ChatMessage
} from "./types";

// System Status
export function useSystemStatus() {
  return useQuery({
    queryKey: ['/api/system/status'],
  });
}

// Network Traffic
export function useNetworkTraffic(timeRange: string = "24h") {
  return useQuery({
    // 1. La clé change quand timeRange change => Force le re-fetch
    queryKey: ['/api/network/traffic', timeRange],
    
    // 2. On définit comment aller chercher les données avec le paramètre
    queryFn: async () => {
      const response = await fetch(`/api/network/traffic?range=${timeRange}`);
      if (!response.ok) {
        throw new Error('Erreur réseau lors de la récupération du trafic');
      }
      return response.json();
    },
    
    // Optionnel : Rafraîchir toutes les 10 secondes automatiquement
    refetchInterval: 10000, 
  });
}

// Threats
export function useThreats() {
  return useQuery({
    queryKey: ['/api/threats/latest'],
  });
}

// Firewall Rules
export function useFirewallRules() {
  return useQuery({
    queryKey: ['/api/firewall/rules'],
  });
}

// Network Devices
export function useNetworkDevices() {
  return useQuery({
    queryKey: ['/api/network/devices'],
  });
}

// Network Topology
export function useNetworkTopology() {
  return useQuery({
    queryKey: ['/api/network/topology'],
  });
}

// Chat History
export function useChatHistory() {
  return useQuery({
    queryKey: ['/api/ai/chat/history'],
  });
}

// EDR Status
export function useEDRStatus() {
  return useQuery({
    queryKey: ['/api/edr/status'],
  });
}

// Endpoint Activities
export function useEndpointActivities() {
  return useQuery({
    queryKey: ['/api/edr/activities'],
  });
}

// Log Analysis
export function useLogAnalysis() {
  return useQuery({
    queryKey: ['/api/logs/analysis'],
  });
}

// Log Summary
export function useLogSummary() {
  return useQuery({
    queryKey: ['/api/logs/summary'],
  });
}

// Alerts
export function useAlerts() {
  return useQuery({
    queryKey: ['/api/alerts'],
  });
}
