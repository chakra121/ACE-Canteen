import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { getUserOrders } from '@/services/orderService';
import { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to view orders.', variant: 'destructive' });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch orders.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Order Placed': return 'bg-blue-500 hover:bg-blue-600';
      case 'Preparing': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Ready to Pickup': return 'bg-green-500 hover:bg-green-600';
      case 'Completed': return 'bg-gray-700 hover:bg-gray-800';
      case 'Cancelled': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatDate = (date: Date | any) => {
    if (!date) return 'N/A';
    // Handle Firestore Timestamp
    const jsDate = typeof date.toDate === 'function' ? date.toDate() : new Date(date);
    return jsDate.toLocaleString();
  };

  if (loading) {
    return <div className="text-center py-12">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Place your first order from our menu!</p>
          <Button onClick={() => navigate('/menu')}>
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
        <Button variant="outline" onClick={loadOrders} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-6">
        {orders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order #{order.id.slice(-8)}</CardTitle>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Order Type:</span>
                    <p className="font-semibold">{order.orderType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <p className="font-semibold">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <p className="font-semibold text-lg">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
