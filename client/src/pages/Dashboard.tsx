import React from 'react';
import { useSystemStatus, useAlerts } from '@/lib/data';
import StatusCard from '@/components/dashboard/StatusCard';
import AlertBanner from '@/components/dashboard/AlertBanner';
import NetworkTraffic from '@/components/dashboard/NetworkTraffic';
import ThreatDetection from '@/components/dashboard/ThreatDetection';
import FirewallRules from '@/components/dashboard/FirewallRules';
import NetworkTopology from '@/components/dashboard/NetworkTopology';
import AIAssistant from '@/components/dashboard/AIAssistant';
import EDRStatus from '@/components/dashboard/EDRStatus';
import LogAnalysis from '@/components/dashboard/LogAnalysis';

const Dashboard: React.FC = () => {
  const { data: systemData, isLoading: isLoadingSystem } = useSystemStatus();
  const { data: alertsData, isLoading: isLoadingAlerts } = useAlerts();

  const system = systemData?.status || {
    protectionStatus: { status: 'Active', lastUpdated: '2 minutes ago' },
    threatsBlocked: { count: 1284, percentChange: 28, period: 'Today' },
    systemHealth: { percentage: 98, status: 'Healthy' },
    activeDevices: { count: 42, newDevices: 3 }
  };

  const alerts = alertsData?.alerts || [];
  const criticalAlerts = alerts.filter(alert => alert.type === 'Critical');

  return (
    <div>
      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <AlertBanner alert={criticalAlerts[0]} />
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatusCard
          title="Protection Status"
          value={system.protectionStatus.status}
          subtitle={`Last updated: ${system.protectionStatus.lastUpdated}`}
          icon="ri-shield-check-fill"
          iconColor="green"
          statusBadge={{ text: 'Active', color: 'green' }}
        />
        
        <StatusCard
          title="Threats Blocked"
          value={system.threatsBlocked.count}
          subtitle={`${system.threatsBlocked.percentChange > 0 ? '+' : ''}${system.threatsBlocked.percentChange}% from yesterday`}
          icon="ri-shield-flash-fill"
          iconColor="yellow"
          statusBadge={{ text: system.threatsBlocked.period, color: 'yellow' }}
        />
        
        <StatusCard
          title="System Health"
          value={`${system.systemHealth.percentage}%`}
          subtitle="All systems operational"
          icon="ri-heart-pulse-fill"
          iconColor="green"
          statusBadge={{ text: system.systemHealth.status, color: 'green' }}
        />
        
        <StatusCard
          title="Active Devices"
          value={system.activeDevices.count}
          subtitle={`${system.activeDevices.newDevices > 0 ? '+' : ''}${system.activeDevices.newDevices} new devices today`}
          icon="ri-computer-fill"
          iconColor="blue"
          statusBadge={{ text: 'Monitored', color: 'blue' }}
        />
      </div>

      {/* Main dashboard content - first row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <NetworkTraffic />
        </div>
        <ThreatDetection />
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <FirewallRules />
        <NetworkTopology />
        <AIAssistant />
      </div>

      {/* Third row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <EDRStatus />
        <LogAnalysis />
      </div>
    </div>
  );
};

export default Dashboard;
