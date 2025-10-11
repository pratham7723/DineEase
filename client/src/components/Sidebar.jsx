import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Utensils, 
  Table, 
  Menu as MenuIcon, 
  QrCode, 
  Users, 
  TrendingUp, 
  LogOut,
  ChefHat
} from 'lucide-react';

const Sidebar = ({ disabled }) => {
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/orders', label: 'Orders', icon: Utensils },
    { path: '/Management', label: 'Table Manager', icon: Table },
    { path: '/menu', label: 'Menu', icon: MenuIcon },
    { path: '/Tableqrcodes', label: 'Table QR Codes', icon: QrCode },
    { path: '/staff', label: 'Staff', icon: Users },
    { path: '/reports', label: 'Reports', icon: TrendingUp },
  ];

  return (
    <div
      className={`bg-card w-64 p-6 shadow-lg flex flex-col justify-between h-screen border-r ${
        disabled ? "pointer-events-none opacity-50" : ""
      }`}
    >
      {/* Logo and Navigation Links */}
      <div>
        <div className="flex items-center gap-2 mb-8">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">FlavorFusion</h1>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div>
        <Separator className="mb-4" />
        <Button 
          variant="destructive" 
          className="w-full gap-2"
          onClick={() => {
            // Add logout logic here
            console.log('Logout clicked');
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
