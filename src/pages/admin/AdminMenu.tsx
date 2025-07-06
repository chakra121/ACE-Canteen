
import React, { useState, useEffect } from 'react';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
  addCategory,
} from '@/services/adminMenuService';
import { MenuItem, MenuCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    imageUrl: '',
    ingredients: '',
    isVegetarian: true,
    inStock: true,
  });

  // This would typically be managed in a separate admin section for images
  const availableImages = [
    'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300',
    'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300',
  ];

  const fetchData = useCallback(async () => {
    try {
      const [menuItems, menuCategories] = await Promise.all([
        getMenuItems(),
        getCategories(),
      ]);
      setItems(menuItems);
      setCategories(menuCategories);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data.', variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = items.filter(item =>
    selectedCategory === 'All' || item.categoryId === selectedCategory
  );

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      categoryId: '',
      imageUrl: '',
      ingredients: '',
      isVegetarian: true,
      inStock: true,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
      ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(', ') : '',
      isVegetarian: item.isVegetarian,
      inStock: item.inStock,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients.split(',').map(ing => ing.trim()),
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, itemData);
        toast({ title: 'Success', description: 'Menu item updated.' });
      } else {
        await addMenuItem(itemData as Omit<MenuItem, 'id'>);
        toast({ title: 'Success', description: 'New menu item added.' });
      }
      
      fetchData(); // Refresh data
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save item.', variant: 'destructive' });
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteMenuItem(itemId);
      toast({ title: 'Success', description: 'Menu item deleted.' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete item.', variant: 'destructive' });
    }
  };

  const toggleStock = async (item: MenuItem) => {
    try {
      await updateMenuItem(item.id, { inStock: !item.inStock });
      toast({ title: 'Success', description: 'Stock status updated.' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update stock.', variant: 'destructive' });
    }
  };
  
  // A simple handler to add a new category for demonstration
  const handleAddCategory = async (name: string) => {
    if (!name || categories.some(c => c.name === name)) {
      toast({ title: 'Info', description: 'Category already exists or name is empty.' });
      return;
    }
    try {
      await addCategory(name);
      toast({ title: 'Success', description: `Category '${name}' added.` });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add category.', variant: 'destructive' });
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields remain largely the same, but bindings are updated */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Select value={formData.imageUrl} onValueChange={(value) => setFormData(prev => ({ ...prev, imageUrl: value }))}>
                  <SelectTrigger><SelectValue placeholder="Select image" /></SelectTrigger>
                  <SelectContent>
                    {availableImages.map((imageUrl) => (
                      <SelectItem key={imageUrl} value={imageUrl}>
                        <div className="flex items-center space-x-2">
                          <img src={imageUrl} alt="Menu item" className="w-8 h-8 rounded" />
                          <span>{imageUrl.split('/').pop()?.split('?')[0]}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
                <Input id="ingredients" value={formData.ingredients} onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))} required />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch checked={formData.isVegetarian} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVegetarian: checked }))} />
                  <Label>Vegetarian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={formData.inStock} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))} />
                  <Label>In Stock</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editingItem ? 'Update Item' : 'Add Item'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant={selectedCategory === 'All' ? 'default' : 'outline'} onClick={() => setSelectedCategory('All')}>All</Button>
        {categories.map(category => (
          <Button key={category.id} variant={selectedCategory === category.id ? 'default' : 'outline'} onClick={() => setSelectedCategory(category.id)}>
            {category.name}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2">
                <Badge variant={item.isVegetarian ? 'default' : 'destructive'}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${item.isVegetarian ? 'bg-green-500' : 'bg-red-500'}`} />
                  {item.isVegetarian ? 'Veg' : 'Non-Veg'}
                </Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant={item.inStock ? 'default' : 'secondary'}>{item.inStock ? 'In Stock' : 'Out of Stock'}</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <div className="text-lg font-semibold text-primary">₹{item.price}</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Category:</strong> {categories.find(c => c.id === item.categoryId)?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Ingredients:</strong> {Array.isArray(item.ingredients) ? item.ingredients.join(', ') : ''}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Switch checked={item.inStock} onCheckedChange={() => toggleStock(item)} />
                  <span className="text-sm">In Stock</span>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminMenu;
