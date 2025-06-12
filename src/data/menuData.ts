
import { MenuItem } from '@/contexts/CartContext';

export const menuCategories = [
  'Breakfast',
  'Lunch',
  'Snacks',
  'Beverages',
  'Desserts'
];

export const mockMenuItems: MenuItem[] = [
  // Breakfast
  {
    id: '1',
    name: 'Masala Dosa',
    price: 45,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300',
    ingredients: ['Rice', 'Urad Dal', 'Potato', 'Onion', 'Spices'],
    isVeg: true,
    inStock: true,
    rating: 4.5
  },
  {
    id: '2',
    name: 'Idli Sambar',
    price: 35,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300',
    ingredients: ['Rice', 'Urad Dal', 'Sambar', 'Coconut Chutney'],
    isVeg: true,
    inStock: true,
    rating: 4.3
  },
  {
    id: '3',
    name: 'Poha',
    price: 25,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300',
    ingredients: ['Flattened Rice', 'Onion', 'Peas', 'Turmeric', 'Curry Leaves'],
    isVeg: true,
    inStock: true,
    rating: 4.1
  },
  
  // Lunch
  {
    id: '4',
    name: 'Chicken Biryani',
    price: 120,
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300',
    ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Spices', 'Fried Onions'],
    isVeg: false,
    inStock: true,
    rating: 4.8
  },
  {
    id: '5',
    name: 'Paneer Butter Masala',
    price: 85,
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
    ingredients: ['Paneer', 'Tomato', 'Cream', 'Butter', 'Spices'],
    isVeg: true,
    inStock: true,
    rating: 4.4
  },
  {
    id: '6',
    name: 'Dal Rice',
    price: 55,
    category: 'Lunch',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300',
    ingredients: ['Dal', 'Rice', 'Turmeric', 'Cumin', 'Ghee'],
    isVeg: true,
    inStock: true,
    rating: 4.0
  },

  // Snacks
  {
    id: '7',
    name: 'Samosa',
    price: 15,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
    ingredients: ['Flour', 'Potato', 'Peas', 'Spices', 'Oil'],
    isVeg: true,
    inStock: true,
    rating: 4.2
  },
  {
    id: '8',
    name: 'Vada Pav',
    price: 20,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300',
    ingredients: ['Potato', 'Bread', 'Gram Flour', 'Chutneys', 'Spices'],
    isVeg: true,
    inStock: true,
    rating: 4.3
  },
  {
    id: '9',
    name: 'Chicken Roll',
    price: 45,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
    ingredients: ['Chicken', 'Roti', 'Onion', 'Sauce', 'Spices'],
    isVeg: false,
    inStock: true,
    rating: 4.6
  },

  // Beverages
  {
    id: '10',
    name: 'Masala Chai',
    price: 12,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300',
    ingredients: ['Tea', 'Milk', 'Sugar', 'Cardamom', 'Ginger'],
    isVeg: true,
    inStock: true,
    rating: 4.4
  },
  {
    id: '11',
    name: 'Fresh Lime Water',
    price: 18,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300',
    ingredients: ['Lime', 'Water', 'Sugar', 'Salt', 'Mint'],
    isVeg: true,
    inStock: true,
    rating: 4.1
  },
  {
    id: '12',
    name: 'Mango Lassi',
    price: 35,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300',
    ingredients: ['Mango', 'Yogurt', 'Sugar', 'Cardamom'],
    isVeg: true,
    inStock: true,
    rating: 4.7
  },

  // Desserts
  {
    id: '13',
    name: 'Gulab Jamun',
    price: 25,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300',
    ingredients: ['Milk Powder', 'Sugar', 'Cardamom', 'Rose Water'],
    isVeg: true,
    inStock: true,
    rating: 4.5
  },
  {
    id: '14',
    name: 'Ice Cream',
    price: 30,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300',
    ingredients: ['Milk', 'Sugar', 'Vanilla', 'Cream'],
    isVeg: true,
    inStock: true,
    rating: 4.3
  }
];
