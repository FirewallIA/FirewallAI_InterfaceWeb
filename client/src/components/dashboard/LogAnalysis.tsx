import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LogAnalysis: React.FC = () => {
  // On utilise des données fictives pour l'aperçu de la fonctionnalité à venir.
  // Les hooks API et les states de recherche ont été retirés.
  const summary = {
    total: 245893,
    warnings: 1342,
    errors: 267,
    critical: 24
  };

  return (
    <Card className="bg-[#11131a] border-[#1a1d25] relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          <CardTitle className="text-gray-300">Log Analysis</CardTitle>
          {/* Badge Coming Soon */}
          <span className="flex items-center text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-medium">
            <i className="ri-time-line mr-1.5"></i>
            Coming Soon
          </span>
        </div>
        
        {/* Les inputs sont gardés pour le visuel ("teasing") mais désactivés */}
        <div className="flex space-x-2 opacity-30 pointer-events-none select-none">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search logs..."
              readOnly
              className="w-48 bg-[#1a1d25] border-[#222631] h-8 text-xs cursor-not-allowed"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6 p-0"
              disabled
            >
              <i className="ri-search-line text-gray-400 text-xs"></i>
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-[#1a1d25] border-[#222631] h-8 cursor-not-allowed"
            disabled
          >
            <i className="ri-filter-line"></i>
          </Button>
        </div>
      </CardHeader>

      {/* Container relatif pour superposer l'overlay */}
      <CardContent className="relative">
        
        {/* OVERLAY DE BLOCAGE - Indique clairement que c'est indisponible */}
        <div className="absolute inset-0 z-10 backdrop-blur-[3px] bg-[#11131a]/70 flex flex-col items-center justify-center rounded-b-xl pb-4">
          <div className="bg-[#1a1d25] p-3 rounded-full mb-3 border border-[#2a2e3d] shadow-lg">
            <i className="ri-lock-2-line text-2xl text-blue-400"></i>
          </div>
          <h3 className="text-white font-medium mb-1 text-lg">Centralized Log Management</h3>
          <p className="text-sm text-gray-400 text-center max-w-[280px]">
            Advanced log search, parsing, and correlation will be available in an upcoming update.
          </p>
        </div>

        {/* CONTENU FLOU ET DÉSACTIVÉ (Aperçu de ce qui arrivera) */}
        <div className="opacity-30 pointer-events-none select-none transition-opacity duration-300">
          <div className="h-80 bg-[#090a0d] border border-[#1a1d25] rounded-lg flex items-center justify-center">
            <div className="text-sm text-gray-500 flex flex-col items-center">
              <i className="ri-bar-chart-grouped-line text-3xl mb-2"></i>
              Log analysis visualization preview
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
        </div>
      </CardContent>
    </Card>
  );
};

export default LogAnalysis;