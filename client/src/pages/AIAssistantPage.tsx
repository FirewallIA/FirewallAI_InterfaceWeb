import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AIAssistant from '@/components/dashboard/AIAssistant';

const AIAssistantPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader>
          <CardTitle className="text-white">AI Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Interact with ChatSec AI Assistant to analyze security events, get recommendations, and automate routine security tasks.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-[#11131a] border-[#1a1d25] h-full">
            <CardHeader>
              <CardTitle className="text-white">ChatSec Conversation</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <AIAssistant />
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-[#11131a] border-[#1a1d25]">
          <CardHeader>
            <CardTitle className="text-white">AI Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                <span>Security event analysis and explanation</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                <span>Firewall rule recommendations</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                <span>Threat intelligence insights</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                <span>Security posture assessment</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                <span>Log analysis and pattern detection</span>
              </li>
              <li className="flex items-start">
                <i className="ri-check-line text-green-500 mr-2 mt-1"></i>
                <span>Security best practices guidance</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Additional content would be added here for the full page */}
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader>
          <CardTitle className="text-white">AI-Powered Automations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-gray-500">
            AI automation configuration would be implemented here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistantPage;
