import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useNetworkTraffic } from '@/lib/data';
import { TrafficData } from '@/lib/types';

const NetworkTraffic: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');
  const { data, isLoading, error } = useNetworkTraffic();

  const handleExport = () => {
    // Handle exporting data
    alert('Export functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Network Traffic</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">Loading...</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 w-20 bg-gray-700 rounded mb-3"></div>
              <div className="h-60 w-full bg-gray-800 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Network Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-red-400">
            Error loading network traffic data
          </div>
        </CardContent>
      </Card>
    );
  }

  const trafficData: TrafficData = data as TrafficData;

  return (
    <Card className="bg-[#11131a] border-[#1a1d25]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">Network Traffic</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === '24h' ? 'default' : 'outline'} 
            size="sm" 
            className={timeRange === '24h' ? 'bg-primary-600 text-white' : 'bg-[#1a1d25] hover:bg-[#222631]'}
            onClick={() => setTimeRange('24h')}
          >
            24h
          </Button>
          <Button 
            variant={timeRange === '7d' ? 'default' : 'outline'} 
            size="sm" 
            className={timeRange === '7d' ? 'bg-primary-600 text-white' : 'bg-[#1a1d25] hover:bg-[#222631]'}
            onClick={() => setTimeRange('7d')}
          >
            7d
          </Button>
          <Button 
            variant={timeRange === '30d' ? 'default' : 'outline'} 
            size="sm"
            className={timeRange === '30d' ? 'bg-primary-600 text-white' : 'bg-[#1a1d25] hover:bg-[#222631]'} 
            onClick={() => setTimeRange('30d')}
          >
            30d
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#1a1d25] hover:bg-[#222631]" 
            onClick={handleExport}
          >
            <i className="ri-download-line"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trafficData?.data || []}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#222631" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1a1d25', 
                  borderColor: '#222631',
                  color: '#e2e8f0'
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="inbound" 
                stroke="#3b82f6" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="outbound" 
                stroke="#10b981" 
              />
              <Line 
                type="monotone" 
                dataKey="blocked" 
                stroke="#ef4444" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkTraffic;
