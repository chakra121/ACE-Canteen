// src/services/adminMenuService.ts
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MenuCategory, MenuItem } from '@/types';

// --- Category Management ---

export const getCategories = async (): Promise<MenuCategory[]> => {
  const categoriesCol = collection(db, 'categories');
  const q = query(categoriesCol, orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuCategory));
};

export const addCategory = async (name: string): Promise<MenuCategory> => {
  const categoriesCol = collection(db, 'categories');
  const docRef = await addDoc(categoriesCol, { name });
  return { id: docRef.id, name };
};

export const updateCategory = async (id: string, name: string): Promise<void> => {
  const categoryDoc = doc(db, 'categories', id);
  await updateDoc(categoryDoc, { name });
};

export const deleteCategory = async (id: string): Promise<void> => {
  // Note: Consider the implications of deleting a category.
  // You might want to prevent this if menu items are still associated with it.
  const categoryDoc = doc(db, 'categories', id);
  await deleteDoc(categoryDoc);
};


// --- Menu Item Management ---

export const getMenuItems = async (): Promise<MenuItem[]> => {
  const menuItemsCol = collection(db, 'menuItems');
  const q = query(menuItemsCol, orderBy('name'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      avgRating: data.avgRating || 0, // Ensure avgRating is a number, default to 0 if undefined
    } as MenuItem;
  });
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
  const menuItemsCol = collection(db, 'menuItems');
  const docRef = await addDoc(menuItemsCol, item);
  return { id: docRef.id, ...item };
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<void> => {
  const menuItemDoc = doc(db, 'menuItems', id);
  await updateDoc(menuItemDoc, updates);
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  const menuItemDoc = doc(db, 'menuItems', id);
  await deleteDoc(menuItemDoc);
};
