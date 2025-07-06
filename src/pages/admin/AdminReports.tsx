
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { generateDailyReport, DailyReport } from '@/services/reportingService';

const AdminReports = () => {
  const [reportData, setReportData] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setLoading(true);
    setReportData(null);
    try {
      const data = await generateDailyReport(selectedDate);
      setReportData(data);
      if (data.totalOrders === 0) {
        toast({ title: 'Info', description: 'No completed orders found for the selected date.' });
      }
    } catch (error: Error) {
      console.error("Failed to generate report:", error); // Detailed error logging
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    if (!reportData) {
      toast({ title: 'Info', description: 'Please generate a report first.' });
      return;
    }
    const reportContent = `
Daily Report - ${reportData.date}
=====================================

Summary:
- Total Revenue: ₹${reportData.totalRevenue.toFixed(2)}
- Total Orders: ${reportData.totalOrders}
- Average Order Value: ₹${reportData.averageOrderValue.toFixed(2)}

Category Breakdown:
${reportData.revenueByCategory.map(cat => `- ${cat.name}: ₹${cat.value.toFixed(2)}`).join('\n')}

Most Ordered Items:
${reportData.mostOrderedItems.map((item, index) => `${index + 1}. ${item.name}: ${item.count} orders`).join('\n')}

Least Ordered Items:
${reportData.leastOrderedItems.map((item, index) => `${index + 1}. ${item.name}: ${item.count} orders`).join('\n')}

Veg vs Non-Veg Split:
- Vegetarian: ${reportData.vegNonVegSplit.find(d => d.name === 'Vegetarian')?.value || 0} items
- Non-Vegetarian: ${reportData.vegNonVegSplit.find(d => d.name === 'Non-Vegetarian')?.value || 0} items
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-report-${format(selectedDate, 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Daily Reports</h1>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleGenerateReport} disabled={loading}>
            <FileText className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
          <Button onClick={exportReport} variant="outline" disabled={!reportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {reportData ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold text-green-600">₹{reportData.totalRevenue.toFixed(2)}</div></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold text-blue-600">{reportData.totalOrders}</div></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Average Order Value</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold text-purple-600">₹{reportData.averageOrderValue.toFixed(2)}</div></CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={reportData.revenueByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                      {reportData.revenueByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Veg vs Non-Veg Split</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={reportData.vegNonVegSplit} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                      <Cell fill="#00C49F" />
                      <Cell fill="#FF8042" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bar Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle>Most Ordered Items</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.mostOrderedItems} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Least Ordered Items</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.leastOrderedItems} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FF8042" name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">Please select a date and click "Generate Report" to see the data.</p>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
