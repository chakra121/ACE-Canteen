// src/services/reportingService.ts
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, MenuItem, MenuCategory } from '@/types';

// Helper to get all menu items for report generation.
const getAllMenuItems = async (): Promise<Map<string, MenuItem>> => {
  const menuItemsCol = collection(db, 'menuItems');
  const snapshot = await getDocs(menuItemsCol);
  const menuItemsMap = new Map<string, MenuItem>();
  snapshot.docs.forEach(doc => {
    menuItemsMap.set(doc.id, { id: doc.id, ...doc.data(), avgRating: doc.data().avgRating || 0 } as MenuItem);
  });
  return menuItemsMap;
};

// Helper to get all categories for report generation.
const getAllCategories = async (): Promise<Map<string, string>> => {
  const categoriesCol = collection(db, 'categories');
  const snapshot = await getDocs(categoriesCol);
  const categoriesMap = new Map<string, string>();
  snapshot.docs.forEach(doc => {
    const category = doc.data() as MenuCategory;
    categoriesMap.set(doc.id, category.name);
  });
  return categoriesMap;
};

export interface DailyReport {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueByCategory: { name: string; value: number }[];
  vegNonVegSplit: { name: string; value: number }[];
  mostOrderedItems: { name: string; count: number }[];
  leastOrderedItems: { name: string; count: number }[];
}

export const generateDailyReport = async (date: Date): Promise<DailyReport> => {
  // 1. Set date range for the start and end of the selected day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const startTimestamp = Timestamp.fromDate(startOfDay);
  const endTimestamp = Timestamp.fromDate(endOfDay);

  // 2. Fetch all necessary data in parallel
  const ordersCol = collection(db, 'orders');
  const q = query(
    ordersCol,
    where('status', '==', 'Completed'),
    where('createdAt', '>=', startTimestamp),
    where('createdAt', '<=', endTimestamp)
  );
  
  const [ordersSnapshot, menuItemsMap, categoriesMap] = await Promise.all([
    getDocs(q),
    getAllMenuItems(),
    getAllCategories()
  ]);
  
  const orders = ordersSnapshot.docs.map(doc => doc.data() as Order);

  // 3. Process the data
  let totalRevenue = 0;
  const revenueByCategory = new Map<string, number>();
  const itemOrderCount = new Map<string, number>();
  let vegCount = 0;
  let nonVegCount = 0;

  for (const order of orders) {
    totalRevenue += order.totalAmount;
    for (const item of order.items) {
      const menuItem = menuItemsMap.get(item.menuItemId);
      if (menuItem) {
        // Get category name from the map
        const categoryName = categoriesMap.get(menuItem.categoryId) || 'Uncategorized';
        revenueByCategory.set(categoryName, (revenueByCategory.get(categoryName) || 0) + (item.price * item.quantity));

        itemOrderCount.set(menuItem.name, (itemOrderCount.get(menuItem.name) || 0) + item.quantity);

        if (menuItem.isVegetarian) {
          vegCount += item.quantity;
        } else {
          nonVegCount += item.quantity;
        }
      }
    }
  }

  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const sortedItems = [...itemOrderCount.entries()].sort((a, b) => b[1] - a[1]);

  // 4. Format for charting libraries
  const formattedRevenueByCategory = [...revenueByCategory.entries()].map(([name, value]) => ({ name, value }));
  const formattedVegNonVeg = [
    { name: 'Vegetarian', value: vegCount },
    { name: 'Non-Vegetarian', value: nonVegCount },
  ];

  return {
    date: date.toDateString(),
    totalRevenue,
    totalOrders,
    averageOrderValue,
    revenueByCategory: formattedRevenueByCategory,
    vegNonVegSplit: formattedVegNonVeg,
    mostOrderedItems: sortedItems.slice(0, 5).map(([name, count]) => ({ name, count })),
    leastOrderedItems: sortedItems.slice(-5).reverse().map(([name, count]) => ({ name, count })),
  };
};
