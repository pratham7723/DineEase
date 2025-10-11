import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <ChefHat className="h-8 w-8 text-primary" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">FlavorFusion</span>
            <span className="truncate text-xs text-muted-foreground">Restaurant Management</span>
          </div>
        </div>
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
              onClick={() => {
                // Add logout logic here
                console.log('Logout clicked');
              }}
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
