// src/services/orderService.ts
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderItem } from '@/types';

interface PlaceOrderData {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  orderType: 'Dine-In' | 'Take Away';
  paymentMethod: 'Cash' | 'Online';
}

/**
 * Places a new order and saves it to Firestore.
 * Used by students.
 * @param orderData - The data for the new order.
 * @returns The newly created order object.
 */
export const placeOrder = async (orderData: PlaceOrderData): Promise<Order> => {
  console.log("Placing order with data:", orderData); // Added for debugging
  const ordersCol = collection(db, 'orders');
  const docRef = await addDoc(ordersCol, {
    ...orderData,
    status: 'Order Placed',
    createdAt: serverTimestamp(),
  });
  
  // We can't get the server timestamp back immediately without another read,
  // so we'll return the client-side date for now. The Firestore document will be accurate.
  return {
    id: docRef.id,
    ...orderData,
    status: 'Order Placed',
    createdAt: new Date(),
  };
};

/**
 * Fetches all orders for a specific user.
 * Used by students to see their order history.
 * @param userId - The UID of the user whose orders to fetch.
 * @returns A promise that resolves to an array of the user's orders.
 */
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const ordersCol = collection(db, 'orders');
  const q = query(
    ordersCol,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(), // Convert Timestamp to Date
    } as Order;
  });
};

/**
 * Fetches all orders from all users.
 * Used by admins.
 * @returns A promise that resolves to an array of all orders.
 */
export const getAllOrders = async (): Promise<Order[]> => {
  const ordersCol = collection(db, 'orders');
  const q = query(ordersCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(), // Convert Timestamp to Date
    } as Order;
  });
};

/**
 * Updates the status of a specific order.
 * Used by admins.
 * @param orderId - The ID of the order to update.
 * @param status - The new status for the order.
 * @returns A promise that resolves when the update is complete.
 */
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<void> => {
  const orderDoc = doc(db, 'orders', orderId);
  await updateDoc(orderDoc, { status });
};
