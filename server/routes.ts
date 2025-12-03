import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from 'ws';
import { setupAuth } from "./auth";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { FirewallClient } from "./firewall_client";

const scryptAsync = promisify(scrypt);
// Initialise le client gRPC
const firewallClient = new FirewallClient();

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
        lastUpdated: '0 minutes ago'
      },
      threatsBlocked: {
        count: 0,
        percentChange: 0,
        period: 'Today'
      },
      systemHealth: {
        percentage: 100,
        status: 'Healthy'
      },
      activeDevices: {
        count: 0,
        newDevices: 0
      }
    }
  },
  
  alerts: {
    alerts: [
      {
        id: '1',
        type: 'Critical',
        title: 'Test',
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
      }
    ]
  },
  
  edrStatus: {
    status: {
      endpointCoverage: {
        percentage: 0,
        protected: 0,
        total: 0
      },
      detectionRate: {
        percentage: 0,
        lastCalibration: '0 hours ago'
      }
    }
  },
  
  endpointActivities: {
    activities: [
      {
        id: '1',
        device: 'Test',
        activity: 'System update completed successfully',
        status: 'normal',
        timestamp: '10 minutes ago'
      },
      {
        id: '2',
        device: 'Test 2',
        activity: 'New application installed: Excel-Viewer.exe',
        status: 'warning',
        timestamp: '35 minutes ago'
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
    {
      method: 'get',
      path: '/api/firewall/status',
      handler: async (req, res) => {
        try {
          const status = await firewallClient.getStatus();
          res.json(status);
        } catch (err: any) {
          console.error("Erreur gRPC GetStatus:", err);
          res.status(500).json({ message: "Erreur de communication avec le pare-feu" });
        }
      },
    },
    {
      method: 'get',
      path: '/api/firewall/rules',
      handler: async (req, res) => {
        try {
          const rules = await firewallClient.listRules();
          res.json(rules);
          console.log(rules)
        } catch (err: any) {
          console.error("Erreur gRPC ListRules:", err);
          res.status(500).json({ message: "Erreur de communication avec le pare-feu" });
        }
        
      },
      
    },
    {
      method: 'post',
      path: '/api/firewall/rules',
      handler: async (req, res) => {
        try {
          const rule = req.body; // { source_ip, dest_ip, ... }
          const resp = await firewallClient.createRule(rule);
          res.json(resp);
        } catch (err: any) {
          console.error("Erreur gRPC CreateRule:", err);
          res.status(500).json({ message: "Erreur lors de la création de la règle" });
        }
      },
    },
    {
      method: 'delete',
      path: '/api/firewall/rules/:id',
      handler: async (req, res) => {
        try {
          const id = parseInt(req.params.id);
          const resp = await firewallClient.deleteRule(id);
          res.json(resp);
        } catch (err: any) {
          console.error("Erreur gRPC DeleteRule:", err);
          res.status(500).json({ message: "Erreur lors de la suppression de la règle" });
        }
      },
  },
    
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
    { 
      method: 'get', 
      path: '/api/users/:id', 
      handler: async (req, res) => {
        if (req.user?.role !== 'admin' && parseInt(req.params.id) !== req.user?.id) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        try {
          const userId = parseInt(req.params.id);
          const user = await storage.getUser(userId);
          
          if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
          }
          
          // Remove password from response
          const { password, ...safeUser } = user;
          res.json(safeUser);
        } catch (error) {
          res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
        }
      }
    },
    { 
      method: 'patch', 
      path: '/api/users/:id', 
      handler: async (req, res) => {
        const userId = parseInt(req.params.id);
        
        // Vérifier les permissions
        if (req.user?.role !== 'admin' && userId !== req.user?.id) {
          return res.status(403).json({ message: "Permission denied" });
        }
        
        try {
          const user = await storage.getUser(userId);
          
          if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
          }
          
          // Un utilisateur standard ne peut pas changer son rôle
          if (req.user?.role !== 'admin' && req.body.role) {
            delete req.body.role;
          }
          
          // Si un mot de passe est fourni, le hacher
          if (req.body.password) {
            const salt = randomBytes(16).toString("hex");
            const buf = (await scryptAsync(req.body.password, salt, 64)) as Buffer;
            req.body.password = `${buf.toString("hex")}.${salt}`;
          }
          
          const updatedUser = await storage.updateUser(userId, req.body);
          
          if (!updatedUser) {
            return res.status(500).json({ message: "Échec de la mise à jour de l'utilisateur" });
          }
          
          // Remove password from response
          const { password, ...safeUser } = updatedUser;
          res.json(safeUser);
        } catch (error) {
          res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
        }
      }
    },
    { 
      method: 'delete', 
      path: '/api/users/:id', 
      handler: async (req, res) => {
        // Seul un admin peut supprimer des utilisateurs
        if (req.user?.role !== 'admin') {
          return res.status(403).json({ message: "Permission denied - Admin access required" });
        }
        
        const userId = parseInt(req.params.id);
        
        // Empêcher la suppression de son propre compte
        if (userId === req.user.id) {
          return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
        }
        
        try {
          const deleted = await storage.deleteUser(userId);
          
          if (!deleted) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
          }
          
          res.status(204).send();
        } catch (error) {
          res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
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
