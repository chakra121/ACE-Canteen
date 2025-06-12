
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    canteenName: 'ACE Canteen',
    openingTime: '08:00',
    closingTime: '20:00',
    isOpen: true,
    taxRate: 5,
    deliveryFee: 0,
    minimumOrderAmount: 50,
    orderPreparationTime: 15
  });

  const { toast } = useToast();

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // In real app, this would save to database
    localStorage.setItem('aceCanteenSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Canteen settings have been updated successfully.",
    });
  };

  const handleReset = () => {
    setSettings({
      canteenName: 'ACE Canteen',
      openingTime: '08:00',
      closingTime: '20:00',
      isOpen: true,
      taxRate: 5,
      deliveryFee: 0,
      minimumOrderAmount: 50,
      orderPreparationTime: 15
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Canteen Settings</h1>

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="canteenName">Canteen Name</Label>
              <Input
                id="canteenName"
                value={settings.canteenName}
                onChange={(e) => handleChange('canteenName', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.isOpen}
                onCheckedChange={(checked) => handleChange('isOpen', checked)}
              />
              <Label>Canteen is currently open</Label>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openingTime">Opening Time</Label>
                <Input
                  id="openingTime"
                  type="time"
                  value={settings.openingTime}
                  onChange={(e) => handleChange('openingTime', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingTime">Closing Time</Label>
                <Input
                  id="closingTime"
                  type="time"
                  value={settings.closingTime}
                  onChange={(e) => handleChange('closingTime', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderPreparationTime">Average Order Preparation Time (minutes)</Label>
              <Input
                id="orderPreparationTime"
                type="number"
                value={settings.orderPreparationTime}
                onChange={(e) => handleChange('orderPreparationTime', parseInt(e.target.value))}
                min="5"
                max="60"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                  min="0"
                  max="30"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  value={settings.deliveryFee}
                  onChange={(e) => handleChange('deliveryFee', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumOrderAmount">Minimum Order Amount (₹)</Label>
                <Input
                  id="minimumOrderAmount"
                  type="number"
                  value={settings.minimumOrderAmount}
                  onChange={(e) => handleChange('minimumOrderAmount', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">System Version:</span>
                <p className="font-semibold">1.0.0</p>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-600">Database Status:</span>
                <p className="font-semibold text-green-600">Connected</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Gateway:</span>
                <p className="font-semibold">Razorpay (Test Mode)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
