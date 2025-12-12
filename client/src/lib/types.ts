// System Status
export interface SystemStatus {
  protectionStatus: {
    status: 'Active' | 'Inactive';
    lastUpdated: string;
  };
  threatsBlocked: {
    count: number;
    percentChange: number;
    period: 'Today' | 'Week' | 'Month';
  };
  systemHealth: {
    percentage: number;
    status: 'Healthy' | 'Degraded' | 'Critical';
  };
  activeDevices: {
    count: number;
    newDevices: number;
  };
}

// Alert
export interface Alert {
  id: string;
  type: 'Critical' | 'Warning' | 'Info';
  title: string;
  message: string;
  timestamp: string;
}

// Network Traffic
export interface TrafficData {
  labels: string[];
  inbound: number[];
  outbound: number[];
  blocked: number[];
  timestamp: string;
}

// Threat
export interface Threat {
  id: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  source: string;
  timestamp: string;
  details: string;
  status: 'Active' | 'Blocked' | 'Investigating';
}

// Firewall Rule
export interface FirewallRule {
  id: string;
  name: string;
  type: 'Inbound' | 'Outbound';
  status: 'Active' | 'Disabled';
  protocol?: string;
  port?: string;
  source?: string;
  destination?: string;
  action: 'Allow' | 'Block' | 'Log';
}

// Network Device
export interface NetworkDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: string;
  status: 'Active' | 'Warning' | 'Alert' | 'Inactive';
  lastSeen: string;
}

// Network Topology
export interface NetworkTopology {
  nodes: {
    id: string;
    label: string;
    type: string;
    status: 'Active' | 'Warning' | 'Alert' | 'Inactive';
  }[];
  edges: {
    from: string;
    to: string;
    bandwidth?: number;
    status?: string;
  }[];
  summary: {
    active: number;
    alert: number;
    warning: number;
    inactive: number;
  };
}

// Chat Message
export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: string;
}

// EDR Status
export interface EDRStatus {
  endpointCoverage: {
    percentage: number;
    protected: number;
    total: number;
  };
  detectionRate: {
    percentage: number;
    lastCalibration: string;
  };
}

// Endpoint Activity
export interface EndpointActivity {
  id: string;
  device: string;
  activity: string;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  timestamp: string;
}

// Log Analysis
export interface LogAnalysis {
  timeRange: string;
  data: {
    timestamp: string;
    count: number;
    severity: 'info' | 'warning' | 'error' | 'critical';
  }[];
}

// Log Summary
export interface LogSummary {
  total: number;
  warnings: number;
  errors: number;
  critical: number;
}

export interface TrafficPoint {
  time: string;      // Label formaté (ex: "14:30" ou "Lun 12")
  timestamp: number; // Valeur brute pour trier si besoin
  inbound: number;
  outbound: number;
  blocked: number;
}

export interface TrafficData {
  total_inbound: number;
  total_outbound: number;
  total_blocked: number;
  time_period: string;
  chart_data: TrafficPoint[]; // Le tableau pour le LineChart
}