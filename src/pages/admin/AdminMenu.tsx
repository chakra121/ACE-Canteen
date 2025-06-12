
import React, { useState, useEffect } from 'react';
import { mockMenuItems, menuCategories } from '@/data/menuData';
import { MenuItem } from '@/contexts/CartContext';
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
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    ingredients: '',
    isVeg: true,
    inStock: true
  });

  const availableImages = [
    'https://images.unsplash.com/photo-1630383249896-424e482df921?w=300',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300',
    'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300',
    'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
    'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300',
    'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=300',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300',
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300'
  ];

  const filteredItems = items.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
  );

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      image: '',
      ingredients: '',
      isVeg: true,
      inStock: true
    });
    setEditingItem(null);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      ingredients: item.ingredients.join(', '),
      isVeg: item.isVeg,
      inStock: item.inStock
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: MenuItem = {
      id: editingItem?.id || Math.random().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      ingredients: formData.ingredients.split(',').map(ing => ing.trim()),
      isVeg: formData.isVeg,
      inStock: formData.inStock,
      rating: editingItem?.rating || 4.0
    };

    if (editingItem) {
      setItems(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
      toast({
        title: "Item updated",
        description: "Menu item has been updated successfully.",
      });
    } else {
      setItems(prev => [...prev, newItem]);
      toast({
        title: "Item added",
        description: "New menu item has been added successfully.",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item deleted",
      description: "Menu item has been deleted successfully.",
    });
  };

  const toggleStock = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, inStock: !item.inStock } : item
    ));
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Select value={formData.image} onValueChange={(value) => setFormData(prev => ({ ...prev, image: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select image" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableImages.map((imageUrl, index) => (
                      <SelectItem key={imageUrl} value={imageUrl}>
                        <div className="flex items-center space-x-2">
                          <img src={imageUrl} alt={`Option ${index + 1}`} className="w-8 h-8 rounded" />
                          <span>Image {index + 1}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
                <Input
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
                  placeholder="Rice, Dal, Spices..."
                  required
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isVeg}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVeg: checked }))}
                  />
                  <Label>Vegetarian</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.inStock}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))}
                  />
                  <Label>In Stock</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedCategory === 'All' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </Button>
        {menuCategories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={item.isVeg ? 'default' : 'destructive'}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                  {item.isVeg ? 'Veg' : 'Non-Veg'}
                </Badge>
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant={item.inStock ? 'default' : 'secondary'}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <div className="text-lg font-semibold text-primary">₹{item.price}</div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Ingredients:</strong> {item.ingredients.join(', ')}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={item.inStock}
                    onCheckedChange={() => toggleStock(item.id)}
                  />
                  <span className="text-sm">In Stock</span>
                </div>
                
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
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
