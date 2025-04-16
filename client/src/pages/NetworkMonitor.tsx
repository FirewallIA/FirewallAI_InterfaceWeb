import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NetworkTraffic from '@/components/dashboard/NetworkTraffic';
import NetworkTopology from '@/components/dashboard/NetworkTopology';

const NetworkMonitor: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader>
          <CardTitle className="text-white">Network Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Monitor your network traffic, view bandwidth usage, and analyze network topology in real-time.
          </p>
        </CardContent>
      </Card>

      <NetworkTraffic />
      <NetworkTopology />

      {/* Additional content would be added here for the full page */}
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader>
          <CardTitle className="text-white">Advanced Network Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-gray-500">
            Full implementation of advanced network analytics would be here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkMonitor;
