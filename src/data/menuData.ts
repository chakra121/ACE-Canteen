import { MenuItem } from '../types';

export const menuCategories = [
  'Breakfast',
  'Lunch',
  'Snacks',
  'Beverages',
  'Desserts'
];

export const mockMenuItems: Omit<MenuItem, 'avgRating' | 'scheduledAvailability'>[] = [
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
