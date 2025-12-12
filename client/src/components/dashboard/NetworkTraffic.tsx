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

// Types pour les props des boutons de filtre
type TimeRange = '5m' | '1h' | '24h' | '7d' | '30d';

const NetworkTraffic: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  
  // Le hook récupère maintenant les nouvelles données complètes
  const { data, isLoading, error } = useNetworkTraffic(timeRange);

  const trafficData = data as TrafficData;

  const handleExport = () => {
    alert('Export non implémenté');
  };

  // Affichage des KPIs (Chiffres clés) en haut du graph
  const renderStats = () => {
    if (!trafficData) return null;
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1a1d25] p-3 rounded border border-gray-800 flex flex-col items-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Inbound</p>
          <p className="text-xl text-blue-500 font-bold mt-1">
            {trafficData.total_inbound?.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#1a1d25] p-3 rounded border border-gray-800 flex flex-col items-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Outbound</p>
          <p className="text-xl text-green-500 font-bold mt-1">
            {trafficData.total_outbound?.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#1a1d25] p-3 rounded border border-gray-800 flex flex-col items-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Blocked</p>
          <p className="text-xl text-red-500 font-bold mt-1">
            {trafficData.total_blocked?.toLocaleString()}
          </p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader><CardTitle className="text-white">Traffic</CardTitle></CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
            <span className="text-gray-500 animate-pulse">Chargement des données...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
         <CardContent className="h-80 flex items-center justify-center text-red-400">
            Erreur de chargement
         </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#11131a] border-[#1a1d25]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white flex items-center gap-2">
            Network Traffic
            {trafficData && (
                <span className="text-xs font-normal text-gray-500 bg-[#1a1d25] px-2 py-1 rounded">
                    {trafficData.time_period}
                </span>
            )}
        </CardTitle>
        <div className="flex space-x-1">
          {(['5m', '1h', '24h', '7d', '30d'] as TimeRange[]).map((range) => (
            <Button 
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'} 
                size="sm" 
                className={`text-xs h-7 ${timeRange === range ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-[#222631]'}`}
                onClick={() => setTimeRange(range)}
            >
                {range}
            </Button>
          ))}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 ml-2 text-gray-400 hover:text-white" onClick={handleExport}>
            <i className="ri-download-line"></i>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* 1. Les KPIs */}
        {renderStats()}

        {/* 2. Le Graphique */}
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trafficData?.chart_data || []} // On utilise le tableau formaté par l'API
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#222631" vertical={false} />
              
              <XAxis 
                dataKey="time" 
                stroke="#6b7280" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              
              <YAxis 
                stroke="#6b7280" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
              />
              
              <Tooltip 
                contentStyle={{ backgroundColor: '#11131a', borderColor: '#222631', color: '#e2e8f0' }}
                itemStyle={{ fontSize: 12 }}
                labelStyle={{ color: '#9ca3af', marginBottom: 5 }}
              />
              
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              
              <Line 
                name="Inbound"
                type="monotone" 
                dataKey="inbound" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#3b82f6' }} 
              />
              <Line 
                name="Outbound"
                type="monotone" 
                dataKey="outbound" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                name="Blocked"
                type="monotone" 
                dataKey="blocked" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkTraffic;