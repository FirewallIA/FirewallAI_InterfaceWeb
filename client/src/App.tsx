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
import AuthPage from "@/pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      <ProtectedRoute path="/" component={() => (
        <Layout>
          <Dashboard />
        </Layout>
      )} />
      
      <ProtectedRoute path="/firewall-rules" component={() => (
        <Layout>
          <FirewallRulesPage />
        </Layout>
      )} />
      
      <ProtectedRoute path="/network-monitor" component={() => (
        <Layout>
          <NetworkMonitor />
        </Layout>
      )} />
      
      <ProtectedRoute path="/threat-detection" component={() => (
        <Layout>
          <ThreatDetectionPage />
        </Layout>
      )} />
      
      <ProtectedRoute path="/logs-analysis" component={() => (
        <Layout>
          <LogsAnalysisPage />
        </Layout>
      )} />
      
      <ProtectedRoute path="/ai-assistant" component={() => (
        <Layout>
          <AIAssistantPage />
        </Layout>
      )} />
      
      <ProtectedRoute path="/edr-monitoring" component={() => (
        <Layout>
          <EDRMonitoringPage />
        </Layout>
      )} />
      
      <ProtectedRoute path="/settings" component={() => (
        <Layout>
          <SettingsPage />
        </Layout>
      )} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
