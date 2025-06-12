
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

interface Order {
  id: string;
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  orderType: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    avgOrderValue: 0
  });

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('aceCanteenOrders') || '[]');
    setOrders(allOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
    
    // Calculate stats
    const total = allOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
    const pending = allOrders.filter((order: Order) => order.status !== 'Completed').length;
    setStats({
      totalRevenue: total,
      totalOrders: allOrders.length,
      pendingOrders: pending,
      avgOrderValue: allOrders.length > 0 ? total / allOrders.length : 0
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const allOrders = JSON.parse(localStorage.getItem('aceCanteenOrders') || '[]');
    const updatedOrders = allOrders.map((order: Order) => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('aceCanteenOrders', JSON.stringify(updatedOrders));
    loadOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-blue-500';
      case 'Preparing':
        return 'bg-yellow-500';
      case 'Ready to Pickup':
        return 'bg-green-500';
      case 'Completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Order Placed':
        return 'Preparing';
      case 'Preparing':
        return 'Ready to Pickup';
      case 'Ready to Pickup':
        return 'Completed';
      default:
        return currentStatus;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button variant="outline" onClick={loadOrders}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.avgOrderValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No orders found</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 10).map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      {order.status !== 'Completed' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                        >
                          Update Status
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Items:</span>
                      <div>
                        {order.items.map(item => (
                          <p key={item.id}>{item.name} x {item.quantity}</p>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Order Type:</span>
                      <p>{order.orderType === 'dine-in' ? 'Dine In' : 'Take Away'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
