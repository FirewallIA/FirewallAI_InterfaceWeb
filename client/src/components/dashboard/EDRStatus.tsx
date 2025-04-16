import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEDRStatus, useEndpointActivities } from '@/lib/data';
import { EndpointActivity } from '@/lib/types';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'normal':
      return 'bg-green-500/20 text-green-500';
    case 'warning':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'critical':
      return 'bg-red-500/20 text-red-500';
    case 'offline':
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
};

const EDRStatus: React.FC = () => {
  const { data: statusData, isLoading: isLoadingStatus, error: statusError } = useEDRStatus();
  const { data: activitiesData, isLoading: isLoadingActivities, error: activitiesError } = useEndpointActivities();

  const isLoading = isLoadingStatus || isLoadingActivities;
  const error = statusError || activitiesError;

  if (isLoading) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">EDR Monitoring</CardTitle>
          <div className="flex space-x-2 animate-pulse">
            <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#1a1d25] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-20 bg-gray-700 rounded"></div>
                  <div className="h-4 w-8 bg-gray-700 rounded"></div>
                </div>
                <div className="w-full bg-[#222631] rounded-full h-2">
                  <div className="bg-gray-700 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <div className="h-3 w-32 bg-gray-700 rounded mt-2"></div>
              </div>
            ))}
          </div>
          
          <div className="h-4 w-48 bg-gray-700 rounded mb-3"></div>
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#1a1d25] rounded-lg p-3">
                <div className="flex items-start">
                  <div className="mr-3 mt-1 w-8 h-8 bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 w-32 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 w-48 bg-gray-700 rounded mb-1"></div>
                    <div className="h-3 w-24 bg-gray-700 rounded"></div>
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
          <CardTitle className="text-white">EDR Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-full flex items-center justify-center text-red-400">
            Error loading EDR data
          </div>
        </CardContent>
      </Card>
    );
  }

  const edrStatus = statusData?.status || {
    endpointCoverage: { percentage: 98, protected: 42, total: 43 },
    detectionRate: { percentage: 99.7, lastCalibration: '4 hours ago' }
  };
  
  const activities: EndpointActivity[] = activitiesData?.activities || [];

  return (
    <Card className="bg-[#11131a] border-[#1a1d25]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">EDR Monitoring</CardTitle>
        <div className="flex space-x-2">
          <span className="flex items-center text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
            System Active
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-[#1a1d25] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Endpoint Coverage</h4>
              <span className="text-green-400">{edrStatus.endpointCoverage.percentage}%</span>
            </div>
            <Progress 
              value={edrStatus.endpointCoverage.percentage} 
              className="bg-[#222631] h-2" 
            />
            <p className="text-xs text-gray-400 mt-2">
              {edrStatus.endpointCoverage.protected} of {edrStatus.endpointCoverage.total} endpoints protected
            </p>
          </div>
          
          <div className="bg-[#1a1d25] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Threat Detection Rate</h4>
              <span className="text-green-400">{edrStatus.detectionRate.percentage}%</span>
            </div>
            <Progress 
              value={edrStatus.detectionRate.percentage} 
              className="bg-[#222631] h-2" 
            />
            <p className="text-xs text-gray-400 mt-2">Last calibration: {edrStatus.detectionRate.lastCalibration}</p>
          </div>
        </div>
        
        <h4 className="text-sm font-medium text-white mb-3">Recent Endpoint Activities</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="bg-[#1a1d25] rounded-lg p-3 flex items-start">
                <div className={`mr-3 mt-1 ${getStatusIcon(activity.status)} rounded-full p-1.5`}>
                  <i className="ri-computer-line"></i>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">{activity.device}</h4>
                  <p className="text-xs text-gray-400 mt-1">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              No recent endpoint activities
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EDRStatus;
