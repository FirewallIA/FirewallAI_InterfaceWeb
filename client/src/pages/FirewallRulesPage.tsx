import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FirewallRules from '@/components/dashboard/FirewallRules';

const FirewallRulesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader>
          <CardTitle className="text-white">Firewall Rules Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Manage and configure firewall rules to protect your network. Add, edit, or remove rules to control inbound and outbound traffic.
          </p>
        </CardContent>
      </Card>

      <FirewallRules />

      {/* Additional content would be added here for the full page */}
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader>
          <CardTitle className="text-white">Rule Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Use pre-configured rule templates for common security scenarios.
          </p>
          <div className="text-center py-16 text-gray-500">
            Full implementation of rule templates would be here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirewallRulesPage;
