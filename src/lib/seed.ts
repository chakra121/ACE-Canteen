import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { menuCategories, mockMenuItems } from '../data/menuData';
import { MenuItem, MenuCategory } from '../types';

// Firebase configuration using process.env for Node.js environment
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

async function seedDatabase() {
  console.log('Starting database seeding...');

  // Initialize Firebase app and Firestore within the seed script
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const batch = writeBatch(db);

  // --- Clear existing data (optional, but good for fresh seeding) ---
  console.log('Clearing existing categories and menu items...');
  const categoriesRef = collection(db, 'categories');
  const menuItemsRef = collection(db, 'menuItems');

  const existingCategories = await getDocs(categoriesRef);
  existingCategories.forEach((d) => {
    batch.delete(d.ref);
  });

  const existingMenuItems = await getDocs(menuItemsRef);
  existingMenuItems.forEach((d) => {
    batch.delete(d.ref);
  });

  await batch.commit();
  console.log('Existing data cleared.');

  // --- Seed Categories ---
  console.log('Seeding categories...');
  const categoryMap: { [key: string]: string } = {}; // Map category name to its Firestore ID

  for (const categoryName of menuCategories) {
    const newCategoryRef = doc(categoriesRef); // Create a new document reference with an auto-generated ID
    batch.set(newCategoryRef, { name: categoryName });
    categoryMap[categoryName] = newCategoryRef.id;
    console.log(`Added category: ${categoryName} with ID: ${newCategoryRef.id}`);
  }
  await batch.commit(); // Commit category additions
  console.log('Categories seeded.');

  // --- Seed Menu Items ---
  console.log('Seeding menu items...');
  const menuItemsBatch = writeBatch(db); // New batch for menu items

  for (const item of mockMenuItems) {
    const categoryId = categoryMap[item.categoryId]; // Get the Firestore ID for the category

    if (!categoryId) {
      console.warn(`Category ID not found for category: ${item.categoryId}. Skipping item: ${item.name}`);
      continue;
    }

    const menuItemData: Omit<MenuItem, 'id' | 'avgRating' | 'scheduledAvailability'> = {
      name: item.name,
      price: item.price,
      ingredients: item.ingredients,
      imageUrl: item.imageUrl,
      isVegetarian: item.isVegetarian,
      inStock: item.inStock,
      categoryId: categoryId,
    };

    const newMenuItemRef = doc(menuItemsRef); // Create a new document reference with an auto-generated ID
    menuItemsBatch.set(newMenuItemRef, menuItemData);
    console.log(`Added menu item: ${item.name} to category ID: ${categoryId}`);
  }
  await menuItemsBatch.commit(); // Commit menu item additions
  console.log('Menu items seeded.');

  console.log('Database seeding complete!');
}

seedDatabase().catch(console.error);