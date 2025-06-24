import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNetworkTopology } from '@/lib/data';

const NetworkTopology: React.FC = () => {
  const { data, isLoading, error } = useNetworkTopology();
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.2, 0.5));
  };

  const handleRefresh = () => {
    // Implementation would go here
    alert('Refresh topology functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Network Topology</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-7" disabled>
              <i className="ri-zoom-in-line"></i>
            </Button>
            <Button variant="outline" size="sm" className="h-7" disabled>
              <i className="ri-zoom-out-line"></i>
            </Button>
            <Button variant="outline" size="sm" className="h-7" disabled>
              <i className="ri-refresh-line"></i>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-[#090a0d] rounded-lg p-2 animate-pulse flex items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
              <div className="h-3 w-10 bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center text-xs">
                <span className="w-3 h-3 rounded-full bg-gray-700 mr-2"></span>
                <span className="h-3 bg-gray-700 rounded w-20"></span>
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
          <CardTitle className="text-white">Network Topology</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-[#1a1d25] hover:bg-[#222631] h-7"
              onClick={handleZoomIn}
            >
              <i className="ri-zoom-in-line"></i>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#1a1d25] hover:bg-[#222631] h-7"
              onClick={handleZoomOut}
            >
              <i className="ri-zoom-out-line"></i>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#1a1d25] hover:bg-[#222631] h-7"
              onClick={handleRefresh}
            >
              <i className="ri-refresh-line"></i>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-[#090a0d] rounded-lg p-2 flex items-center justify-center text-red-400">
            Error loading network topology
          </div>
        </CardContent>
      </Card>
    );
  }

  const topology = data?.topology || { summary: { active: 0, alert: 0, warning: 0, inactive: 0 } };

  // For the actual implementation, this would be replaced with a real network graph visualization
  return (
    <Card className="bg-[#11131a] border-[#1a1d25]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">Network Topology</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1a1d25] hover:bg-[#222631] h-7"
            onClick={handleZoomIn}
          >
            <i className="ri-zoom-in-line"></i>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1a1d25] hover:bg-[#222631] h-7"
            onClick={handleZoomOut}
          >
            <i className="ri-zoom-out-line"></i>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1a1d25] hover:bg-[#222631] h-7"
            onClick={handleRefresh}
          >
            <i className="ri-refresh-line"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 bg-[#090a0d] rounded-lg p-2 flex items-center justify-center">
          <div className="text-gray-400 text-sm">
            Network topology visualization would be implemented here
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-gray-500">Active Devices ({topology.summary.active || 32})</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-gray-500">Alert Status ({topology.summary.alert || 4})</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            <span className="text-gray-500">Warning Status ({topology.summary.warning || 6})</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
            <span className="text-gray-500">Inactive ({topology.summary.inactive || 2})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkTopology;
