
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download } from 'lucide-react';

interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    isVeg: boolean;
  }>;
  total: number;
  orderType: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const AdminReports = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderSize: 0,
    categoryData: [] as any[],
    vegNonVegData: [] as any[],
    mostOrdered: [] as any[],
    leastOrdered: [] as any[]
  });

  const generateReport = () => {
    const allOrders = JSON.parse(localStorage.getItem('aceCanteenOrders') || '[]');
    const today = new Date().toDateString();
    const todaysOrders = allOrders.filter((order: Order) => 
      new Date(order.createdAt).toDateString() === today
    );

    setOrders(todaysOrders);

    // Calculate metrics
    const totalRevenue = todaysOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const totalOrders = todaysOrders.length;
    const avgOrderSize = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Category breakdown
    const categoryRevenue: { [key: string]: number } = {};
    const itemCounts: { [key: string]: number } = {};
    let vegCount = 0, nonVegCount = 0;

    todaysOrders.forEach((order: Order) => {
      order.items.forEach(item => {
        // Category revenue
        categoryRevenue[item.category] = (categoryRevenue[item.category] || 0) + (item.price * item.quantity);
        
        // Item counts
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        
        // Veg/Non-veg counts
        if (item.isVeg) {
          vegCount += item.quantity;
        } else {
          nonVegCount += item.quantity;
        }
      });
    });

    const categoryData = Object.entries(categoryRevenue).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));

    const vegNonVegData = [
      { name: 'Vegetarian', value: vegCount },
      { name: 'Non-Vegetarian', value: nonVegCount }
    ];

    const sortedItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]);
    const mostOrdered = sortedItems.slice(0, 5).map(([name, count]) => ({ name, count }));
    const leastOrdered = sortedItems.slice(-5).reverse().map(([name, count]) => ({ name, count }));

    setReportData({
      totalRevenue,
      totalOrders,
      avgOrderSize,
      categoryData,
      vegNonVegData,
      mostOrdered,
      leastOrdered
    });
  };

  useEffect(() => {
    generateReport();
  }, []);

  const exportReport = () => {
    const reportContent = `
Daily Report - ${new Date().toDateString()}
=====================================

Summary:
- Total Revenue: ₹${reportData.totalRevenue.toFixed(2)}
- Total Orders: ${reportData.totalOrders}
- Average Order Size: ₹${reportData.avgOrderSize.toFixed(2)}

Category Breakdown:
${reportData.categoryData.map(cat => `- ${cat.name}: ₹${cat.value}`).join('\n')}

Most Ordered Items:
${reportData.mostOrdered.map((item, index) => `${index + 1}. ${item.name}: ${item.count} orders`).join('\n')}

Least Ordered Items:
${reportData.leastOrdered.map((item, index) => `${index + 1}. ${item.name}: ${item.count} orders`).join('\n')}

Veg vs Non-Veg:
- Vegetarian: ${reportData.vegNonVegData.find(d => d.name === 'Vegetarian')?.value || 0} items
- Non-Vegetarian: ${reportData.vegNonVegData.find(d => d.name === 'Non-Vegetarian')?.value || 0} items
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Daily Reports</h1>
        <div className="space-x-2">
          <Button onClick={generateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ₹{reportData.totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {reportData.totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Order Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              ₹{reportData.avgOrderSize.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Revenue Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportData.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Veg vs Non-Veg Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Veg vs Non-Veg Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.vegNonVegData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#00C49F" />
                  <Cell fill="#FF8042" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Most and Least Ordered Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Most Ordered Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.mostOrdered}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Least Ordered Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.leastOrdered}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
