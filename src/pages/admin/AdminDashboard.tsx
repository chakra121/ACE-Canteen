
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, DollarSign, ShoppingBag, Users, TrendingUp, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/services/orderService';
import { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todaysRevenue: 0, // Added for today's revenue
    totalOrders: 0,
    pendingOrders: 0,
    avgOrderValue: 0
  });

  const statusFlow: Order['status'][] = ['Order Placed', 'Preparing', 'Ready to Pickup', 'Completed', 'Cancelled'];

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const allOrders = await getAllOrders();
      setOrders(allOrders);

      // Calculate stats from live data
      const completedOrders = allOrders.filter(o => o.status === 'Completed');
      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      // Calculate today's revenue
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaysCompletedOrders = completedOrders.filter(o => new Date(o.createdAt) >= today);
      const todaysRevenue = todaysCompletedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      const totalOrders = allOrders.length;
      const pendingOrders = allOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setStats({
        totalRevenue,
        todaysRevenue,
        totalOrders,
        pendingOrders,
        avgOrderValue
      });

    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load dashboard data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({ title: 'Success', description: `Order status updated to ${newStatus}.` });
      loadDashboardData(); // Refresh data
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update order status.', variant: 'destructive' });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Order Placed': return 'bg-blue-500 hover:bg-blue-600';
      case 'Preparing': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Ready to Pickup': return 'bg-green-500 hover:bg-green-600';
      case 'Completed': return 'bg-gray-700 hover:bg-gray-800';
      case 'Cancelled': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < statusFlow.length - 2) { // -2 because 'Completed' and 'Cancelled' are final states
      return statusFlow[currentIndex + 1];
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button variant="outline" onClick={loadDashboardData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">₹{stats.todaysRevenue.toFixed(2)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (All Time)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.totalOrders}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.pendingOrders}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders found</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const nextStatus = getNextStatus(order.status);
                return (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        {nextStatus && (
                          <Button size="sm" onClick={() => handleUpdateStatus(order.id, nextStatus)} title={`Mark as ${nextStatus}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Items:</span>
                        <div>{order.items.map(item => <p key={item.menuItemId}>{item.name} x {item.quantity}</p>)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Order Type:</span>
                        <p>{order.orderType}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <p className="font-semibold">₹{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
