import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from 'ws';
import { setupAuth } from "./auth";

// Middleware pour vérifier si l'utilisateur est authentifié
const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized - Authentication required" });
};

// Mock data for the FirewallAI frontend
const mockData = {
  systemStatus: {
    status: {
      protectionStatus: {
        status: 'Active',
        lastUpdated: '2 minutes ago'
      },
      threatsBlocked: {
        count: 1284,
        percentChange: 28,
        period: 'Today'
      },
      systemHealth: {
        percentage: 98,
        status: 'Healthy'
      },
      activeDevices: {
        count: 42,
        newDevices: 3
      }
    }
  },
  
  alerts: {
    alerts: [
      {
        id: '1',
        type: 'Critical',
        title: 'Critical Alert',
        message: 'Multiple intrusion attempts detected from IP 185.234.52.11 - Automatically blocked for 24h',
        timestamp: new Date().toISOString()
      }
    ]
  },
  
  networkTraffic: {
    data: [
      { time: '00:00', inbound: 120, outbound: 80, blocked: 5 },
      { time: '02:00', inbound: 90, outbound: 60, blocked: 2 },
      { time: '04:00', inbound: 70, outbound: 50, blocked: 1 },
      { time: '06:00', inbound: 120, outbound: 80, blocked: 3 },
      { time: '08:00', inbound: 180, outbound: 100, blocked: 10 },
      { time: '10:00', inbound: 250, outbound: 150, blocked: 15 },
      { time: '12:00', inbound: 270, outbound: 180, blocked: 13 },
      { time: '14:00', inbound: 290, outbound: 200, blocked: 20 },
      { time: '16:00', inbound: 310, outbound: 230, blocked: 18 },
      { time: '18:00', inbound: 250, outbound: 170, blocked: 12 },
      { time: '20:00', inbound: 200, outbound: 120, blocked: 8 },
      { time: '22:00', inbound: 150, outbound: 90, blocked: 6 }
    ]
  },
  
  threats: {
    threats: [
      {
        id: '1',
        type: 'Ransomware Attempt',
        severity: 'High',
        source: '185.234.52.11',
        timestamp: '10 minutes ago',
        details: 'Attempted to encrypt system files',
        status: 'Blocked'
      },
      {
        id: '2',
        type: 'Suspicious Login',
        severity: 'Medium',
        source: 'admin@example.com',
        timestamp: '45 minutes ago',
        details: 'Multiple failed login attempts',
        status: 'Investigating'
      },
      {
        id: '3',
        type: 'Brute Force Attack',
        severity: 'Medium',
        source: '103.92.24.136',
        timestamp: '2 hours ago',
        details: 'SSH login attempts',
        status: 'Blocked'
      },
      {
        id: '4',
        type: 'Port Scan Detected',
        severity: 'Low',
        source: '41.78.103.246',
        timestamp: '3 hours ago',
        details: 'Scanned ports 20-1000',
        status: 'Monitoring'
      }
    ]
  },
  
  firewallRules: {
    rules: [
      {
        id: '1',
        name: 'Block Malicious IPs',
        type: 'Inbound',
        status: 'Active',
        protocol: 'Any',
        port: 'Any',
        source: 'Blacklist',
        destination: 'Any',
        action: 'Block'
      },
      {
        id: '2',
        name: 'Allow HTTPS Traffic',
        type: 'Outbound',
        status: 'Active',
        protocol: 'TCP',
        port: '443',
        source: 'Any',
        destination: 'Any',
        action: 'Allow'
      },
      {
        id: '3',
        name: 'Block P2P Traffic',
        type: 'Outbound',
        status: 'Disabled',
        protocol: 'TCP/UDP',
        port: 'Multiple',
        source: 'Any',
        destination: 'Any',
        action: 'Block'
      },
      {
        id: '4',
        name: 'DMZ Access',
        type: 'Inbound',
        status: 'Active',
        protocol: 'TCP',
        port: '80,443',
        source: 'Any',
        destination: 'DMZ',
        action: 'Allow'
      }
    ]
  },
  
  networkTopology: {
    topology: {
      nodes: [
        { id: '1', label: 'Gateway', type: 'router', status: 'Active' },
        { id: '2', label: 'Switch-1', type: 'switch', status: 'Active' },
        { id: '3', label: 'Server-1', type: 'server', status: 'Active' },
        { id: '4', label: 'Server-2', type: 'server', status: 'Warning' },
        { id: '5', label: 'Client-1', type: 'workstation', status: 'Active' },
        { id: '6', label: 'Client-2', type: 'workstation', status: 'Alert' },
        { id: '7', label: 'Client-3', type: 'workstation', status: 'Inactive' }
      ],
      edges: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '2', to: '4' },
        { from: '2', to: '5' },
        { from: '2', to: '6' },
        { from: '2', to: '7' }
      ],
      summary: {
        active: 32,
        alert: 4,
        warning: 6,
        inactive: 2
      }
    }
  },
  
  chatHistory: {
    messages: [
      {
        id: '1',
        sender: 'ai',
        content: "Hello! I'm your FirewallAI assistant. How can I help you today?",
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: '2',
        sender: 'user',
        content: 'Can you explain why there was a spike in blocked traffic around 3pm?',
        timestamp: new Date(Date.now() - 240000).toISOString()
      },
      {
        id: '3',
        sender: 'ai',
        content: "I analyzed the spike at 3pm and found it was primarily due to a distributed port scan attempt from multiple IPs originating from the same ASN. The system automatically blocked these IPs and raised the threat level temporarily. Would you like me to show you the detailed logs?",
        timestamp: new Date(Date.now() - 180000).toISOString()
      }
    ]
  },
  
  edrStatus: {
    status: {
      endpointCoverage: {
        percentage: 98,
        protected: 42,
        total: 43
      },
      detectionRate: {
        percentage: 99.7,
        lastCalibration: '4 hours ago'
      }
    }
  },
  
  endpointActivities: {
    activities: [
      {
        id: '1',
        device: 'DEV-LAPTOP-03',
        activity: 'System update completed successfully',
        status: 'normal',
        timestamp: '10 minutes ago'
      },
      {
        id: '2',
        device: 'ACCOUNTING-PC-12',
        activity: 'New application installed: Excel-Viewer.exe',
        status: 'warning',
        timestamp: '35 minutes ago'
      },
      {
        id: '3',
        device: 'MARKETING-PC-05',
        activity: 'Unusual process activity detected: svchost.exe',
        status: 'warning',
        timestamp: '1 hour ago'
      },
      {
        id: '4',
        device: 'SERVER-BACKUP-02',
        activity: 'Agent disconnected - manual check required',
        status: 'offline',
        timestamp: '2 hours ago'
      }
    ]
  },
  
  logAnalysis: {
    timeRange: '24h',
    data: [
      { timestamp: '00:00', count: 230, severity: 'info' },
      { timestamp: '02:00', count: 180, severity: 'info' },
      { timestamp: '04:00', count: 120, severity: 'info' },
      { timestamp: '06:00', count: 90, severity: 'info' },
      { timestamp: '08:00', count: 140, severity: 'info' },
      { timestamp: '10:00', count: 210, severity: 'info' },
      { timestamp: '12:00', count: 170, severity: 'warning' },
      { timestamp: '14:00', count: 220, severity: 'error' },
      { timestamp: '16:00', count: 250, severity: 'critical' },
      { timestamp: '18:00', count: 210, severity: 'warning' },
      { timestamp: '20:00', count: 180, severity: 'info' },
      { timestamp: '22:00', count: 150, severity: 'info' }
    ]
  },
  
  logSummary: {
    summary: {
      total: 245893,
      warnings: 1342,
      errors: 267,
      critical: 24
    }
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Groupes de routes protégées (nécessitant une authentification)
  const protectedRoutes = [
    // System routes (protégées)
    { method: 'get', path: '/api/system/status', handler: (req, res) => res.json(mockData.systemStatus) },
    { method: 'get', path: '/api/system/configuration', handler: (req, res) => res.json({ message: "Not implemented yet" }) },
    
    // Security routes (protégées)
    { method: 'get', path: '/api/alerts', handler: (req, res) => res.json(mockData.alerts) },
    { method: 'get', path: '/api/threats/latest', handler: (req, res) => res.json(mockData.threats) },
    
    // Network routes (protégées)
    { method: 'get', path: '/api/network/traffic', handler: (req, res) => res.json(mockData.networkTraffic) },
    { method: 'get', path: '/api/network/topology', handler: (req, res) => res.json(mockData.networkTopology) },
    { method: 'get', path: '/api/network/interfaces', handler: (req, res) => res.json({ message: "Not implemented yet" }) },
    
    // Firewall routes (protégées)
    { method: 'get', path: '/api/firewall/rules', handler: (req, res) => res.json(mockData.firewallRules) },
    
    // Logs routes (protégées)
    { method: 'get', path: '/api/logs/analysis', handler: (req, res) => res.json(mockData.logAnalysis) },
    { method: 'get', path: '/api/logs/summary', handler: (req, res) => res.json(mockData.logSummary) },
    { method: 'get', path: '/api/logs/export', handler: (req, res) => res.json({ message: "Export functionality coming soon" }) },
    
    // EDR routes (protégées)
    { method: 'get', path: '/api/edr/status', handler: (req, res) => res.json(mockData.edrStatus) },
    { method: 'get', path: '/api/edr/activities', handler: (req, res) => res.json(mockData.endpointActivities) },
    { method: 'get', path: '/api/edr/settings', handler: (req, res) => res.json({ message: "EDR settings not implemented yet" }) },
    { method: 'get', path: '/api/edr/logs', handler: (req, res) => res.json({ message: "EDR logs not implemented yet" }) },
    
    // AI Assistant routes (protégées)
    { method: 'get', path: '/api/ai/chat/history', handler: (req, res) => res.json(mockData.chatHistory) },
    { 
      method: 'post', 
      path: '/api/ai/chat/message', 
      handler: (req, res) => {
        const { content } = req.body;
        if (!content) {
          return res.status(400).json({ message: 'Message content is required' });
        }

        // Add user message to history
        const userMessage = {
          id: Date.now().toString(),
          sender: 'user',
          content,
          timestamp: new Date().toISOString()
        };
        mockData.chatHistory.messages.push(userMessage);

        // Simulate AI response
        setTimeout(() => {
          const aiMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            content: `I've analyzed your query: "${content}". This is a simulated response from the AI assistant.`,
            timestamp: new Date().toISOString()
          };
          mockData.chatHistory.messages.push(aiMessage);
        }, 1000);

        res.status(201).json({ message: 'Message sent successfully' });
      }
    },
    
    // User management routes (admin only)
    { 
      method: 'get', 
      path: '/api/users', 
      handler: async (req, res) => {
        if (req.user?.role !== 'admin') {
          return res.status(403).json({ message: "Permission denied - Admin access required" });
        }
        
        try {
          const users = await storage.getAllUsers();
          // Remove password from response
          const safeUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
          });
          
          res.json({ users: safeUsers });
        } catch (error) {
          res.status(500).json({ message: "Error fetching users" });
        }
      }
    },
  ];

  // Enregistrer routes protégées
  protectedRoutes.forEach(route => {
    const { method, path, handler } = route;
    app[method as keyof Express](path, ensureAuthenticated, handler);
  });

  // Route de diagnostic (non protégée)
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'OK',
      version: '1.0.0',
      authenticated: req.isAuthenticated()
    });
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    // Send a welcome message to confirm connection
    ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
    
    ws.on('message', (message) => {
      console.log('Received message:', message);
      try {
        // Echo back the message to confirm receipt
        ws.send(JSON.stringify({ type: 'echo', data: JSON.parse(message.toString()) }));
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  return httpServer;
}
