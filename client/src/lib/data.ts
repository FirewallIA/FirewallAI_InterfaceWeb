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
export function useNetworkTraffic() {
  return useQuery({
    queryKey: ['/api/network/traffic'],
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
