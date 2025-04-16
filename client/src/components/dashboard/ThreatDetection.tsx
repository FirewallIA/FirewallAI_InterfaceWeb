import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useThreats } from '@/lib/data';
import { Threat } from '@/lib/types';

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'High':
      return 'red';
    case 'Medium':
      return severity === 'Medium' ? 'orange' : 'yellow';
    case 'Low':
      return 'blue';
    default:
      return 'gray';
  }
};

const getIconForThreatType = (type: string) => {
  if (type.includes('Ransomware')) return 'ri-virus-line';
  if (type.includes('Login')) return 'ri-spam-2-line';
  if (type.includes('Brute Force')) return 'ri-door-lock-line';
  if (type.includes('Port Scan')) return 'ri-scan-line';
  return 'ri-shield-flash-line';
};

const ThreatDetection: React.FC = () => {
  const { data, isLoading, error } = useThreats();

  const renderThreatItem = (threat: Threat) => {
    const severityColor = getSeverityColor(threat.severity);
    const icon = getIconForThreatType(threat.type);
    
    return (
      <div key={threat.id} className="bg-[#1a1d25] rounded-lg p-3 flex items-start">
        <div className={`mr-3 mt-1 bg-${severityColor}-500/20 rounded-full p-1.5`}>
          <i className={`${icon} text-${severityColor}-500`}></i>
        </div>
        <div>
          <div className="flex items-center">
            <h4 className="text-sm font-medium text-white">{threat.type}</h4>
            <span className={`ml-2 bg-${severityColor}-500/20 text-${severityColor}-400 text-xs px-1.5 py-0.5 rounded-full`}>
              {threat.severity}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">From: {threat.source}</p>
          <p className="text-xs text-gray-400">{threat.timestamp}</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Latest Threats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#1a1d25] rounded-lg p-3 animate-pulse">
                <div className="flex items-start">
                  <div className="mr-3 mt-1 bg-gray-700 rounded-full p-1.5 w-8 h-8"></div>
                  <div className="w-full">
                    <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Latest Threats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-full flex items-center justify-center text-red-400">
            Error loading threat data
          </div>
        </CardContent>
      </Card>
    );
  }

  const threats: Threat[] = data?.threats || [];

  return (
    <Card className="bg-[#11131a] border-[#1a1d25]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">Latest Threats</CardTitle>
        <Button variant="link" className="text-primary-400 hover:text-primary-300 text-xs p-0">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {threats.length > 0 ? (
            threats.map(renderThreatItem)
          ) : (
            <div className="text-center py-8 text-gray-400">
              <i className="ri-shield-check-line text-3xl mb-2 text-green-500"></i>
              <p>No recent threats detected</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatDetection;
