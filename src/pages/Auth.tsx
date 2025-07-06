import React, { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { House } from "lucide-react"; // 💡 Lucide icon

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Guest Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => (window.location.href = "/")}
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              ACE Canteen
            </button>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" className="font-semibold">
                <Link
                  to="/"
                  className="flex items-center gap-1 text-sm font-medium transition"
                >
                  <House size={18} />
                  Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
