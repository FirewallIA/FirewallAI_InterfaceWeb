import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import FirewallRulesPage from "@/pages/FirewallRulesPage";
import NetworkMonitor from "@/pages/NetworkMonitor";
import ThreatDetectionPage from "@/pages/ThreatDetectionPage";
import LogsAnalysisPage from "@/pages/LogsAnalysisPage";
import AIAssistantPage from "@/pages/AIAssistantPage";
import EDRMonitoringPage from "@/pages/EDRMonitoringPage";
import SettingsPage from "@/pages/SettingsPage";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/firewall-rules" component={FirewallRulesPage} />
        <Route path="/network-monitor" component={NetworkMonitor} />
        <Route path="/threat-detection" component={ThreatDetectionPage} />
        <Route path="/logs-analysis" component={LogsAnalysisPage} />
        <Route path="/ai-assistant" component={AIAssistantPage} />
        <Route path="/edr-monitoring" component={EDRMonitoringPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
