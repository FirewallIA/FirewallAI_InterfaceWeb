import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#11131a] border-[#1a1d25]">
        <CardHeader>
          <CardTitle className="text-white">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Configure system settings, user preferences, and application behavior.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[#1a1d25] border-[#222631]">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary-600">
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary-600">
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary-600">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary-600">
            Users
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-primary-600">
            API
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card className="bg-[#11131a] border-[#1a1d25]">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="FirewallAI Inc." className="bg-[#1a1d25] border-[#222631]" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select id="timezone" className="w-full h-9 rounded-md bg-[#1a1d25] border-[#222631] px-3 text-sm">
                    <option>UTC (GMT+0)</option>
                    <option>Eastern Time (GMT-5)</option>
                    <option>Pacific Time (GMT-8)</option>
                    <option>Central European Time (GMT+1)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-[#222631] pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-xs text-gray-400">Enable dark mode interface</p>
                </div>
                <Switch id="darkMode" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between border-t border-[#222631] pt-4">
                <div className="space-y-0.5">
                  <Label htmlFor="autoRefresh">Auto-Refresh</Label>
                  <p className="text-xs text-gray-400">Automatically refresh dashboard data</p>
                </div>
                <Switch id="autoRefresh" defaultChecked />
              </div>
              
              <div className="space-y-2 border-t border-[#222631] pt-4">
                <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                <Input id="refreshInterval" type="number" defaultValue="30" className="bg-[#1a1d25] border-[#222631]" />
              </div>
              
              <Button className="bg-primary-600 hover:bg-primary-500 text-white">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tabs would be implemented similarly */}
        <TabsContent value="security">
          <Card className="bg-[#11131a] border-[#1a1d25]">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-gray-500">
                Security settings would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="bg-[#11131a] border-[#1a1d25]">
            <CardHeader>
              <CardTitle className="text-white">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-gray-500">
                Notification settings would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="bg-[#11131a] border-[#1a1d25]">
            <CardHeader>
              <CardTitle className="text-white">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-gray-500">
                User management would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card className="bg-[#11131a] border-[#1a1d25]">
            <CardHeader>
              <CardTitle className="text-white">API Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-gray-500">
                API settings would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
