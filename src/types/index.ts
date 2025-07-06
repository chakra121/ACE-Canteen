// src/types/index.ts

// Represents a user in the 'users' collection
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  rollNumber: string;
  phoneNumber: string;
  role: 'student' | 'admin';
}

// Represents a menu category in the 'categories' collection
export interface MenuCategory {
  id: string;
  name: string;
}

// Represents a single item in the 'menuItems' collection
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  ingredients: string[];
  imageUrl: string;
  isVegetarian: boolean;
  inStock: boolean;
  categoryId: string;
  avgRating?: number; // Optional, as it might not exist for new items
  scheduledAvailability?: {
    startTime: string; // e.g., "09:00"
    endTime: string;   // e.g., "12:00"
  };
}

// Represents an item within an order
export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

// Represents an order in the 'orders' collection
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Order Placed' | 'Preparing' | 'Ready to Pickup' | 'Completed' | 'Cancelled';
  orderType: 'Dine-In' | 'Take Away';
  paymentMethod: 'Cash' | 'Online';
  createdAt: Date;
}

// Represents a rating in the 'ratings' sub-collection of a menuItem
export interface Rating {
  userId: string;
  rating: number; // e.g., 1-5 stars
  createdAt: Date;
}

// Represents the canteen settings in the 'settings' collection
export interface CanteenSettings {
  canteenName: string;
  openingTime: string; // e.g., "08:00"
  closingTime: string; // e.g., "20:00"
  isOpen: boolean;
  taxRate: number;
  deliveryFee: number;
  minimumOrderAmount: number;
  orderPreparationTime: number;
}