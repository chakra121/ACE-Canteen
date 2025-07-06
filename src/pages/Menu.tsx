import React, { useState, useEffect } from 'react';
import { getMenuItems, getCategories } from '@/services/adminMenuService';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MenuItem, MenuCategory } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { submitRating, updateAverageRating } from '@/services/ratingService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [selectedMenuItemForRating, setSelectedMenuItemForRating] = useState<MenuItem | null>(null);
  const [currentRating, setCurrentRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items, cats] = await Promise.all([getMenuItems(), getCategories()]);
        setMenuItems(items.filter(item => item.inStock)); // Only show items in stock
        setCategories(cats);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to load menu.', variant: 'destructive' });
      }
    };
    fetchData();
  }, [toast]);

  const filteredItems = menuItems.filter(item => {
    const categoryName = categories.find(c => c.id === item.categoryId)?.name || '';
    const matchesCategory = selectedCategory === 'All' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleOpenRatingDialog = (item: MenuItem) => {
    if (!user) {
      toast({ title: 'Error', description: 'Please log in to rate items.', variant: 'destructive' });
      return;
    }
    setSelectedMenuItemForRating(item);
    setCurrentRating(0); // Reset rating when opening dialog
    setIsRatingDialogOpen(true);
  };

  const handleSubmitRating = async () => {
    if (!user || !selectedMenuItemForRating || currentRating === 0) {
      toast({ title: 'Error', description: 'Please select a rating.', variant: 'destructive' });
      return;
    }

    try {
      await submitRating(selectedMenuItemForRating.id, user.uid, currentRating);
      await updateAverageRating(selectedMenuItemForRating.id); // Update average rating
      toast({ title: 'Success', description: `Rated ${selectedMenuItemForRating.name} ${currentRating} stars!` });
      setIsRatingDialogOpen(false);
      setSelectedMenuItemForRating(null);
      setCurrentRating(0);
      // Refresh menu items to show updated average rating
      const [items, cats] = await Promise.all([getMenuItems(), getCategories()]);
      setMenuItems(items.filter(item => item.inStock));
      setCategories(cats);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to submit rating.', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Menu</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={item.isVegetarian ? 'default' : 'destructive'}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${item.isVegetarian ? 'bg-green-500' : 'bg-red-500'}`} />
                  {item.isVegetarian ? 'Veg' : 'Non-Veg'}
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-primary">
                    ₹{item.price}
                  </CardDescription>
                </div>
                {item.avgRating !== undefined && ( // Check if avgRating exists
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm">{item.avgRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Ingredients:</strong> {Array.isArray(item.ingredients) ? item.ingredients.join(', ') : ''}
              </p>
              <div className="flex justify-between items-center mt-4">
                <Button 
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 mr-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenRatingDialog(item)}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
        </div>
      )}

      {/* Rating Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate {selectedMenuItemForRating?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <RadioGroup value={currentRating.toString()} onValueChange={(value) => setCurrentRating(parseInt(value))}>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="flex items-center space-x-1">
                    <RadioGroupItem value={star.toString()} id={`star-${star}`} />
                    <Label htmlFor={`star-${star}`}>{star} <Star className="h-4 w-4 inline-block fill-yellow-400 text-yellow-400" /></Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
          <Button onClick={handleSubmitRating} disabled={currentRating === 0}>
            Submit Rating
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;