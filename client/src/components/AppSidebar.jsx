import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../contexts/AuthContext';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasAnyRole } = useAuth();

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const allItems = [
      { path: '/dashboard', label: 'Dashboard', icon: BarChart3, roles: ['Owner', 'Manager'] },
      { path: '/orders', label: 'Orders', icon: Utensils, roles: ['Owner', 'Manager', 'Waiter'] },
      { path: '/Management', label: 'Table Manager', icon: Table, roles: ['Owner', 'Manager', 'Waiter'] },
      { path: '/menu', label: 'Menu', icon: MenuIcon, roles: ['Owner', 'Manager'] },
      { path: '/Tableqrcodes', label: 'Table QR Codes', icon: QrCode, roles: ['Owner', 'Manager'] },
      { path: '/Staff', label: 'Staff', icon: Users, roles: ['Owner', 'Manager'] },
      { path: '/Reports', label: 'Reports', icon: TrendingUp, roles: ['Owner', 'Manager'] },
    ];

    // Filter items based on user role
    return allItems.filter(item => hasAnyRole(item.roles));
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    navigate('/loginpage');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">FlavorFusion</span>
            <span className="truncate text-xs text-muted-foreground">Restaurant Management</span>
          </div>
        </div>
        {user && (
          <div className="px-2 py-1 border-t">
            <div className="text-xs text-muted-foreground">
              <div className="font-medium">{user.name}</div>
              <div className="capitalize">{user.role}</div>
            </div>
          </div>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
