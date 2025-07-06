// scripts/seed.cjs
const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase-admin-credentials.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Data to seed (ensure this matches your MenuItem and MenuCategory types)
const menuCategories = [
  'Breakfast',
  'Lunch',
  'Snacks',
  'Beverages',
  'Desserts'
];

const mockMenuItems = [
  // Breakfast
  {
    id: '1',
    name: 'Masala Dosa',
    price: 45,
    categoryId: 'Breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300',
    ingredients: ['Rice', 'Urad Dal', 'Potato', 'Onion', 'Spices'],
    isVegetarian: true,
    inStock: true,
  },
  {
    id: '2',
    name: 'Idli Sambar',
    price: 35,
    categoryId: 'Breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300',
    ingredients: ['Rice', 'Urad Dal', 'Sambar', 'Coconut Chutney'],
    isVegetarian: true,
    inStock: true,
  },
  {
    id: '3',
    name: 'Poha',
    price: 25,
    categoryId: 'Breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300',
    ingredients: ['Flattened Rice', 'Onion', 'Peas', 'Turmeric', 'Curry Leaves'],
    isVegetarian: true,
    inStock: true,
  },
  
  // Lunch
  {
    id: '4',
    name: 'Chicken Biryani',
    price: 120,
    categoryId: 'Lunch',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300',
    ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Spices', 'Fried Onions'],
    isVegetarian: false,
    inStock: true,
  },
  {
    id: '5',
    name: 'Paneer Butter Masala',
    price: 85,
    categoryId: 'Lunch',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
    ingredients: ['Paneer', 'Tomato', 'Cream', 'Butter', 'Spices'],
    isVegetarian: true,
    inStock: true,
  },
  {
    id: '6',
    name: 'Dal Rice',
    price: 55,
    categoryId: 'Lunch',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300',
    ingredients: ['Dal', 'Rice', 'Turmeric', 'Cumin', 'Ghee'],
    isVegetarian: true,
    inStock: true,
  },

  // Snacks
  {
    id: '7',
    name: 'Samosa',
    price: 15,
    categoryId: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
    ingredients: ['Flour', 'Potato', 'Peas', 'Spices', 'Oil'],
    isVegetarian: true,
    inStock: true,
  },
  {
    id: '8',
    name: 'Vada Pav',
    price: 20,
    categoryId: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300',
    ingredients: ['Potato', 'Bread', 'Gram Flour', 'Chutneys', 'Spices'],
    isVegetarian: true,
    inStock: true,
  },
  {
    id: '9',
    name: 'Chicken Roll',
    price: 45,
    categoryId: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
    ingredients: ['Chicken', 'Roti', 'Onion', 'Sauce', 'Spices'],
    isVegetarian: false,
    inStock: true,
  },

  // Beverages
  {
    id: '10',
    name: 'Masala Chai',
    price: 12,
    categoryId: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300',
    ingredients: ['Tea', 'Milk', 'Sugar', 'Cardamom', 'Ginger'],
    isVegetarian: true,
    inStock: true,
  },
  {
    id: '11',
    name: 'Fresh Lime Water',
    price: 18,
    categoryId: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300',
    ingredients: ['Lime', 'Water', 'Sugar', 'Salt', 'Mint'],
    isVegetarian: true,
    inStock: true,
  },
  {
    id: '12',
    name: 'Mango Lassi',
    price: 35,
    categoryId: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300',
    ingredients: ['Mango', 'Yogurt', 'Sugar', 'Cardamom'],
    isVegetarian: true,
    inStock: true,
  },

  // Desserts
  {
    id: '13',
    name: 'Gulab Jamun',
    price: 25,
    categoryId: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300',
    ingredients: ['Milk Powder', 'Sugar', 'Cardamom', 'Rose Water'],
    isVegetarian: true,
    inStock: true,
  },
  {
    id: '14',
    name: 'Ice Cream',
    price: 30,
    categoryId: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300',
    ingredients: ['Milk', 'Sugar', 'Vanilla', 'Cream'],
    isVegetarian: true,
    inStock: true,
  }
];

async function seedDatabase() {
  console.log('Starting database seeding...');

  // --- Clear existing data (optional, but good for fresh seeding) ---
  console.log('Clearing existing categories and menu items...');
  const categoriesRef = db.collection('categories');
  const menuItemsRef = db.collection('menuItems');

  let deleteBatch = db.batch();
  const existingCategories = await categoriesRef.get();
  existingCategories.forEach((d) => {
    deleteBatch.delete(d.ref);
  });

  const existingMenuItems = await menuItemsRef.get();
  existingMenuItems.forEach((d) => {
    deleteBatch.delete(d.ref);
  });

  await deleteBatch.commit();
  console.log('Existing data cleared.');

  // --- Seed Categories ---
  console.log('Seeding categories...');
  let categoryBatch = db.batch(); // New batch for categories
  const categoryMap = {}; // Map category name to its Firestore ID

  for (const categoryName of menuCategories) {
    const newCategoryRef = categoriesRef.doc(); // Create a new document reference with an auto-generated ID
    categoryBatch.set(newCategoryRef, { name: categoryName });
    categoryMap[categoryName] = newCategoryRef.id;
    console.log(`Added category: ${categoryName} with ID: ${newCategoryRef.id}`);
  }
  await categoryBatch.commit(); // Commit category additions
  console.log('Categories seeded.');

  // --- Seed Menu Items ---
  console.log('Seeding menu items...');
  let menuItemsBatch = db.batch(); // New batch for menu items

  for (const item of mockMenuItems) {
    const categoryId = categoryMap[item.categoryId]; // Get the Firestore ID for the category

    if (!categoryId) {
      console.warn(`Category ID not found for category: ${item.categoryId}. Skipping item: ${item.name}`);
      continue;
    }

    const menuItemData = {
      name: item.name,
      price: item.price,
      ingredients: item.ingredients,
      imageUrl: item.imageUrl,
      isVegetarian: item.isVegetarian,
      inStock: item.inStock,
      categoryId: categoryId,
    };

    const newMenuItemRef = menuItemsRef.doc(); // Create a new document reference with an auto-generated ID
    menuItemsBatch.set(newMenuItemRef, menuItemData);
    console.log(`Added menu item: ${item.name} to category ID: ${categoryId}`);
  }
  await menuItemsBatch.commit(); // Commit menu item additions
  console.log('Menu items seeded.');

  console.log('Database seeding complete!');
}

seedDatabase().catch(console.error);