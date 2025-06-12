
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate(isAdmin ? '/admin' : '/menu')}
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              ACE Canteen
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {!isAdmin && (
              <>
                <Button
                  variant={location.pathname === '/menu' ? 'default' : 'ghost'}
                  onClick={() => navigate('/menu')}
                >
                  Menu
                </Button>
                <Button
                  variant={location.pathname === '/orders' ? 'default' : 'ghost'}
                  onClick={() => navigate('/orders')}
                >
                  Orders
                </Button>
                <Button
                  variant="ghost"
                  className="relative"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </>
            )}

            {isAdmin && (
              <>
                <Button
                  variant={location.pathname === '/admin' ? 'default' : 'ghost'}
                  onClick={() => navigate('/admin')}
                >
                  Dashboard
                </Button>
                <Button
                  variant={location.pathname === '/admin/menu' ? 'default' : 'ghost'}
                  onClick={() => navigate('/admin/menu')}
                >
                  Menu Management
                </Button>
                <Button
                  variant={location.pathname === '/admin/reports' ? 'default' : 'ghost'}
                  onClick={() => navigate('/admin/reports')}
                >
                  Reports
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin/settings')}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </>
            )}

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2"
              >
                <User className="h-5 w-5" />
                <span>{user.name}</span>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
