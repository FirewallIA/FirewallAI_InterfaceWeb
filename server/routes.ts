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
      protectionStatus: { status: 'Active', lastUpdated: '0 minutes ago' },
      threatsBlocked: { count: 0, percentChange: 0, period: 'Today' },
      systemHealth: { percentage: 100, status: 'Healthy' },
      activeDevices: { count: 0, newDevices: 0 }
    }
  },
  alerts: {
    alerts: [
      { id: '1', type: 'Critical', title: 'Test', message: 'Multiple intrusion attempts detected', timestamp: new Date().toISOString() }
    ]
  },
  networkTraffic: { data: [] },
  threats: {
    threats: [
      { id: '1', type: 'Ransomware Attempt', severity: 'High', source: '185.234.52.11', timestamp: '10 minutes ago', details: 'Attempted to encrypt system files', status: 'Blocked' },
      { id: '2', type: 'Suspicious Login', severity: 'Medium', source: 'admin@example.com', timestamp: '45 minutes ago', details: 'Multiple failed login attempts', status: 'Investigating' },
      { id: '3', type: 'Brute Force Attack', severity: 'Medium', source: '103.92.24.136', timestamp: '2 hours ago', details: 'SSH login attempts', status: 'Blocked' },
      { id: '4', type: 'Port Scan Detected', severity: 'Low', source: '41.78.103.246', timestamp: '3 hours ago', details: 'Scanned ports 20-1000', status: 'Monitoring' }
    ]
  },
  firewallRules: { rules: [] },
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
        { from: '1', to: '2' }, { from: '2', to: '3' }, { from: '2', to: '4' },
        { from: '2', to: '5' }, { from: '2', to: '6' }, { from: '2', to: '7' }
      ],
      summary: { active: 32, alert: 4, warning: 6, inactive: 2 }
    }
  },
  chatHistory: {
    messages: [
      { id: '1', sender: 'ai', content: "Hello! I'm your FirewallAI assistant. How can I help you today?", timestamp: new Date(Date.now() - 300000).toISOString() }
    ]
  },
  edrStatus: {
    status: {
      endpointCoverage: { percentage: 0, protected: 0, total: 0 },
      detectionRate: { percentage: 0, lastCalibration: '0 hours ago' }
    }
  },
  endpointActivities: {
    activities: [
      { id: '1', device: 'Test', activity: 'System update completed successfully', status: 'normal', timestamp: '10 minutes ago' },
      { id: '2', device: 'Test 2', activity: 'New application installed: Excel-Viewer.exe', status: 'warning', timestamp: '35 minutes ago' }
    ]
  },
  logAnalysis: {
    timeRange: '24h',
    data: [
      { timestamp: '00:00', count: 230, severity: 'info' },
      { timestamp: '02:00', count: 180, severity: 'info' },
      { timestamp: '12:00', count: 170, severity: 'warning' },
      { timestamp: '14:00', count: 220, severity: 'error' },
      { timestamp: '22:00', count: 150, severity: 'info' }
    ]
  },
  logSummary: {
    summary: { total: 245893, warnings: 1342, errors: 267, critical: 24 }
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // --- DÉFINITION DES ROUTES API ---

  // System routes (protégées)
  app.get('/api/system/status', ensureAuthenticated, (req, res) => res.json(mockData.systemStatus));
  app.get('/api/system/configuration', ensureAuthenticated, (req, res) => res.json({ message: "Not implemented yet" }));

  // Security routes (protégées)
  app.get('/api/alerts', ensureAuthenticated, (req, res) => res.json(mockData.alerts));
  app.get('/api/threats/latest', ensureAuthenticated, (req, res) => res.json(mockData.threats));

  // Network Traffic (gRPC)
  app.get('/api/network/traffic', ensureAuthenticated, async (req, res) => {
    try {
      const range = (req.query.range as string) || '24h';
      let rustRange = range;
      if (range === '7d') rustRange = '1w';
      if (range === '30d') rustRange = 'month';

      const response = await firewallClient.getTrafficStats(rustRange);
      const showDate = ['7d', '30d', '1w', 'month'].includes(rustRange);

      const chartData = (response.chart_data || []).map((point: any) => {
        const date = new Date(Number(point.timestamp) * 1000);
        let timeLabel;
        if (showDate) {
          timeLabel = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        } else {
          timeLabel = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: range === '5m' ? '2-digit' : undefined });
        }
        return {
          timestamp: Number(point.timestamp),
          time: timeLabel,
          inbound: Number(point.inbound),
          outbound: Number(point.outbound),
          blocked: Number(point.blocked),
        };
      });

      res.json({
        time_period: response.time_period,
        total_inbound: Number(response.total_inbound),
        total_outbound: Number(response.total_outbound),
        total_blocked: Number(response.total_blocked),
        chart_data: chartData
      });
    } catch (err) {
      console.error("Erreur API Traffic:", err);
      res.status(500).json({ message: "Erreur de récupération des stats trafic" });
    }
  });

  app.get('/api/network/topology', ensureAuthenticated, (req, res) => res.json(mockData.networkTopology));
  app.get('/api/network/interfaces', ensureAuthenticated, (req, res) => res.json({ message: "Not implemented yet" }));

  // Firewall Routes (gRPC)
  app.get('/api/firewall/status', ensureAuthenticated, async (req, res) => {
    try {
      const status = await firewallClient.getStatus();
      res.json(status);
    } catch (err) {
      console.error("Erreur gRPC GetStatus:", err);
      res.status(500).json({ message: "Erreur de communication avec le pare-feu" });
    }
  });

  app.get('/api/firewall/rules', ensureAuthenticated, async (req, res) => {
    try {
      const rawResponse = await firewallClient.listRules();
      const rawRules = rawResponse.rules || [];
      const formattedRules = rawRules.map((r: any) => ({
        id: r.id.toString(),
        name: r.name || 'Unnamed Rule',
        source: r.source_ip,
        destination: r.dest_ip,
        port: r.dest_port,
        protocol: r.protocol,
        action: r.action,
        status: 'Active',
        type: 'Inbound',
        usage_count: r.usage_count
      }));
      res.json({ rules: formattedRules });
    } catch (err) {
      console.error("Erreur gRPC ListRules:", err);
      res.status(500).json({ message: "Erreur de communication avec le pare-feu" });
    }
  });

  app.post('/api/firewall/rules', ensureAuthenticated, async (req, res) => {
    try {
      const resp = await firewallClient.createRule(req.body);
      res.json(resp);
    } catch (err) {
      console.error("Erreur gRPC CreateRule:", err);
      res.status(500).json({ message: "Erreur lors de la création de la règle" });
    }
  });

  app.delete('/api/firewall/rules/:id', ensureAuthenticated, async (req, res) => {
    try {
      const resp = await firewallClient.deleteRule(parseInt(req.params.id));
      res.json(resp);
    } catch (err) {
      console.error("Erreur gRPC DeleteRule:", err);
      res.status(500).json({ message: "Erreur lors de la suppression de la règle" });
    }
  });

  app.put('/api/firewall/rules/:id', ensureAuthenticated, async (req, res) => {
    try {
      const resp = await firewallClient.updateRule(parseInt(req.params.id), req.body);
      res.json(resp);
    } catch (err) {
      console.error("Erreur gRPC UpdateRule:", err);
      res.status(500).json({ message: "Erreur lors de la mise à jour de la règle" });
    }
  });

  // Logs & EDR & AI (Mock/Basic)
  app.get('/api/logs/analysis', ensureAuthenticated, (req, res) => res.json(mockData.logAnalysis));
  app.get('/api/logs/summary', ensureAuthenticated, (req, res) => res.json(mockData.logSummary));
  app.get('/api/logs/export', ensureAuthenticated, (req, res) => res.json({ message: "Export coming soon" }));

  app.get('/api/edr/status', ensureAuthenticated, (req, res) => res.json(mockData.edrStatus));
  app.get('/api/edr/activities', ensureAuthenticated, (req, res) => res.json(mockData.endpointActivities));
  app.get('/api/edr/settings', ensureAuthenticated, (req, res) => res.json({ message: "Not implemented" }));
  app.get('/api/edr/logs', ensureAuthenticated, (req, res) => res.json({ message: "Not implemented" }));

  app.get('/api/ai/chat/history', ensureAuthenticated, (req, res) => res.json(mockData.chatHistory));
  app.post('/api/ai/chat/message', ensureAuthenticated, (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Message content required' });
    
    mockData.chatHistory.messages.push({
      id: Date.now().toString(), sender: 'user', content, timestamp: new Date().toISOString()
    });
    setTimeout(() => {
      mockData.chatHistory.messages.push({
        id: (Date.now() + 1).toString(), sender: 'ai',
        content: `I've analyzed your query: "${content}". Simulated response.`,
        timestamp: new Date().toISOString()
      });
    }, 1000);
    res.status(201).json({ message: 'Message sent' });
  });

  // User Management
  app.get('/api/users', ensureAuthenticated, async (req, res) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: "Admin only" });
    const users = await storage.getAllUsers();
    res.json({ users: users.map(({ password, ...u }) => u) });
  });

  app.get('/api/users/:id', ensureAuthenticated, async (req, res) => {
    const uid = parseInt(req.params.id);
    if (req.user?.role !== 'admin' && uid !== req.user?.id) return res.status(403).json({ message: "Denied" });
    const user = await storage.getUser(uid);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...safe } = user;
    res.json(safe);
  });

  app.patch('/api/users/:id', ensureAuthenticated, async (req, res) => {
    const uid = parseInt(req.params.id);
    if (req.user?.role !== 'admin' && uid !== req.user?.id) return res.status(403).json({ message: "Denied" });
    
    if (req.body.password) {
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(req.body.password, salt, 64)) as Buffer;
      req.body.password = `${buf.toString("hex")}.${salt}`;
    }
    const updated = await storage.updateUser(uid, req.body);
    if (!updated) return res.status(500).json({ message: "Failed" });
    const { password, ...safe } = updated;
    res.json(safe);
  });

  app.delete('/api/users/:id', ensureAuthenticated, async (req, res) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: "Admin only" });
    const uid = parseInt(req.params.id);
    if (uid === req.user.id) return res.status(400).json({ message: "Cannot delete self" });
    const deleted = await storage.deleteUser(uid);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(204).send();
  });

  // Diagnostic route
  app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', version: '1.0.0', authenticated: req.isAuthenticated() });
  });

  // --- CRÉATION DU SERVEUR ---

  const httpServer = createServer(app);

  // 1. D'abord on crée le WebSocket Server
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });

  // 2. Gestion des connexions clients (Dashboard)
  wss.on('connection', (ws) => {
    console.log('[WS] Client dashboard connecté');
    ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
    
    // --- MODIFICATION ICI : Un stream gRPC par client ---
    // On demande au serveur Rust les logs (Historique + Live) pour CE client
    const grpcStream = firewallClient.getLogStream();

    grpcStream.on('data', (logEntry: any) => {
        // Vérification de sécurité pour ne pas crasher si le WS est fermé
        if (ws.readyState === ws.OPEN) {
             ws.send(JSON.stringify({
                type: 'log_entry',
                payload: {
                    message: logEntry.message,
                    level: logEntry.level,
                    timestamp: logEntry.timestamp
                }
            }));
        }
    });

    grpcStream.on('error', (err: any) => {
        // Les erreurs "Cancelled" sont normales quand on ferme la page
        if (!err.message.includes('Cancelled')) {
            console.error("[gRPC] Erreur de stream client:", err.message);
        }
        ws.close();
    });

    grpcStream.on('end', () => {
        console.log("[gRPC] Stream terminé par le serveur.");
        ws.close();
    });

    // 3. IMPORTANT : Nettoyage
    // Quand le navigateur se ferme ou change de page
    ws.on('close', () => {
      console.log('[WS] Client déconnecté - Arrêt du flux gRPC associé');
      // On coupe le tuyau gRPC pour ne pas que le serveur Rust continue d'envoyer pour rien
      if (grpcStream) {
          grpcStream.cancel(); 
      }
    });
  });

  // SUPPRIMEZ TOUTE LA FONCTION startLogStream() GLOBALE QUI ÉTAIT ICI
  // ET L'APPEL startLogStream();

  return httpServer;
}