import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogAnalysis, useLogSummary } from '@/lib/data';
import { LogSummary } from '@/lib/types';

const LogAnalysis: React.FC = () => {
  const { data: analysisData, isLoading: isLoadingAnalysis, error: analysisError } = useLogAnalysis();
  const { data: summaryData, isLoading: isLoadingSummary, error: summaryError } = useLogSummary();
  const [searchTerm, setSearchTerm] = useState('');

  const isLoading = isLoadingAnalysis || isLoadingSummary;
  const error = analysisError || summaryError;

  const handleSearch = () => {
    // Implementation would go here
    alert(`Searching for: ${searchTerm}`);
  };

  const handleFilter = () => {
    // Implementation would go here
    alert('Filter functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-white">Log Analysis</CardTitle>
          <div className="flex space-x-2 animate-pulse">
            <div className="h-8 w-48 bg-gray-700 rounded-md"></div>
            <div className="h-8 w-8 bg-gray-700 rounded-md"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-[#090a0d] rounded-lg animate-pulse"></div>
          <div className="mt-4 animate-pulse">
            <div className="h-4 w-32 bg-gray-700 rounded mb-2"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#1a1d25] rounded-lg p-2 h-16"></div>
              ))}
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
          <CardTitle className="text-white">Log Analysis</CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 bg-[#1a1d25] border-[#222631] h-8 text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 p-0"
                onClick={handleSearch}
              >
                <i className="ri-search-line text-gray-400 text-xs"></i>
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#1a1d25] hover:bg-[#222631] h-8"
              onClick={handleFilter}
            >
              <i className="ri-filter-line"></i>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-[#090a0d] rounded-lg flex items-center justify-center text-red-400">
            Error loading log analysis data
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-white mb-2">Log Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-[#1a1d25] rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Total Logs</p>
                <p className="text-lg font-bold text-white">Error</p>
              </div>
              <div className="bg-[#1a1d25] rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Warnings</p>
                <p className="text-lg font-bold text-yellow-400">Error</p>
              </div>
              <div className="bg-[#1a1d25] rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Errors</p>
                <p className="text-lg font-bold text-red-400">Error</p>
              </div>
              <div className="bg-[#1a1d25] rounded-lg p-2 text-center">
                <p className="text-xs text-gray-400">Critical</p>
                <p className="text-lg font-bold text-red-500">Error</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summary: LogSummary = summaryData?.summary || {
    total: 245893,
    warnings: 1342,
    errors: 267,
    critical: 24
  };

  return (
    <Card className="bg-[#11131a] border-[#1a1d25]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">Log Analysis</CardTitle>
        <div className="flex space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 bg-[#1a1d25] border-[#222631] h-8 text-xs"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6 p-0"
              onClick={handleSearch}
            >
              <i className="ri-search-line text-gray-400 text-xs"></i>
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1a1d25] hover:bg-[#222631] h-8"
            onClick={handleFilter}
          >
            <i className="ri-filter-line"></i>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 bg-[#090a0d] rounded-lg flex items-center justify-center">
          <div className="text-sm text-gray-400">
            Log analysis visualization would be implemented here
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-white mb-2">Log Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#1a1d25] rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Total Logs</p>
              <p className="text-lg font-bold text-white">{summary.total.toLocaleString()}</p>
            </div>
            <div className="bg-[#1a1d25] rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Warnings</p>
              <p className="text-lg font-bold text-yellow-400">{summary.warnings.toLocaleString()}</p>
            </div>
            <div className="bg-[#1a1d25] rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Errors</p>
              <p className="text-lg font-bold text-red-400">{summary.errors.toLocaleString()}</p>
            </div>
            <div className="bg-[#1a1d25] rounded-lg p-2 text-center">
              <p className="text-xs text-gray-400">Critical</p>
              <p className="text-lg font-bold text-red-500">{summary.critical.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogAnalysis;
