
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Clock, 
  Star, 
  Users, 
  PieChart, 
  Shield,
  ChevronRight,
  CheckCircle
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: "Easy Ordering",
      description: "Browse menu, add to cart, and place orders seamlessly with real-time updates."
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Track your order status from placed to ready for pickup with live notifications."
    },
    {
      icon: Star,
      title: "Rate & Review",
      description: "Rate menu items and help fellow students discover the best dishes."
    },
    {
      icon: PieChart,
      title: "Admin Analytics",
      description: "Comprehensive dashboard with sales reports and inventory management."
    },
    {
      icon: Users,
      title: "User Management",
      description: "Secure authentication with role-based access for students and administrators."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing with multiple payment options."
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Students" },
    { number: "50+", label: "Menu Items" },
    { number: "1000+", label: "Orders Served" },
    { number: "4.8★", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
              <Button asChild variant="default" className="font-semibold">
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="mb-2 text-2xl">
            Welcome to ACE Canteen
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Your Campus
            <span className="text-blue-600"> Food Hub</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Experience seamless food ordering with real-time tracking, diverse
            menu options, and a user-friendly interface designed for the modern
            campus lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/auth">
                Get Started <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">
                {stat.number}
              </div>
              <div className="text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose ACE Canteen?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the features that make our canteen management system the
            perfect choice for your campus.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works?
          </h2>
          <p className="text-lg text-gray-600">
            Simple steps to get your favorite food
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse Menu</h3>
            <p className="text-gray-600">
              Explore our diverse menu with detailed descriptions, images, and
              prices.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Place Order</h3>
            <p className="text-gray-600">
              Add items to cart, choose dine-in or takeaway, and confirm your
              order.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Enjoy Food</h3>
            <p className="text-gray-600">
              Track your order in real-time and pick up when ready.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for Campus Life
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Fast & Convenient</h3>
                  <p className="text-gray-600">
                    Quick ordering process designed for busy student schedules.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Real-time Updates</h3>
                  <p className="text-gray-600">
                    Stay informed about your order status and pickup times.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Secure Payments</h3>
                  <p className="text-gray-600">
                    Multiple payment options with secure transaction processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Order?</h3>
              <p className="mb-6">
                Join hundreds of students who trust ACE Canteen for their daily
                meals.
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link to="/auth">Start Ordering Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">ACE Canteen</h3>
            <p className="text-gray-400 mb-6">
              Your campus food hub - making dining convenient and enjoyable.
            </p>
            
              <p className="text-sm">
                © {new Date().getFullYear()} ACE Canteen. All rights reserved.
              </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
