
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

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

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('aceCanteenOrders') || '[]');
    const userOrders = allOrders.filter((order: Order) => order.userId === user?.id);
    setOrders(userOrders.sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Place your first order from our menu!</p>
          <Button onClick={() => window.location.href = '/menu'}>
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
        <Button variant="outline" onClick={loadOrders}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
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
                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-2">Items:</h4>
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-1">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Order Type:</span>
                    <p className="font-semibold">{order.orderType === 'dine-in' ? 'Dine In' : 'Take Away'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <p className="font-semibold">{order.paymentMethod === 'cash' ? 'Cash' : 'Online Payment'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <p className="font-semibold text-lg">₹{order.total.toFixed(2)}</p>
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
