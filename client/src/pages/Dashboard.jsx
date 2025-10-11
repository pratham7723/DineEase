import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Bell, TrendingUp, Users, Utensils } from 'lucide-react';

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const Dashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    occupiedTables: 0,
    totalTables: 0,
    todaysRevenue: 0
  });
  const [loading, setLoading] = useState({
    orders: true,
    stats: true,
    tables: true
  });
  const [error, setError] = useState({
    orders: '',
    stats: '',
    tables: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent orders
        setLoading(prev => ({ ...prev, orders: true }));
        const ordersResponse = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?limit=5&sort=-createdAt`);
        
        if (!ordersResponse.ok) {
          throw new Error(`Failed to fetch orders: ${ordersResponse.status}`);
        }

        const ordersData = await ordersResponse.json();
        const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
        setRecentOrders(orders);
        setError(prev => ({ ...prev, orders: '' }));

        // Fetch statistics
        setLoading(prev => ({ ...prev, stats: true }));
        const statsResponse = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/stats`);
        
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();
        
        // Fetch all orders to filter out cancelled ones
        const allOrdersResponse = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`);
        if (!allOrdersResponse.ok) {
          throw new Error(`Failed to fetch all orders: ${allOrdersResponse.status}`);
        }
        const allOrdersData = await allOrdersResponse.json();
        const allOrders = Array.isArray(allOrdersData) ? allOrdersData : (allOrdersData.data || []);
        
        // Filter out cancelled orders
        const validOrders = allOrders.filter(order => 
          order.status?.toLowerCase() !== 'cancelled'
        );
        
        // Calculate total revenue and orders excluding cancelled ones
        const totalRevenue = validOrders.reduce((sum, order) => 
          sum + (order.total || 0), 0
        );
        
        // Calculate today's revenue (excluding cancelled)
        const today = new Date().toISOString().split('T')[0];
        const todaysRevenue = validOrders
          .filter(order => order.createdAt?.includes(today))
          .reduce((sum, order) => sum + (order.total || 0), 0);
        
        // Fetch tables data
        setLoading(prev => ({ ...prev, tables: true }));
        const tablesResponse = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables`);
        
        if (!tablesResponse.ok) {
          throw new Error(`Failed to fetch tables: ${tablesResponse.status}`);
        }

        const tablesData = await tablesResponse.json();
        const totalTables = tablesData.length || 0;
        const occupiedTables = tablesData.filter(table => 
          table.status === 'Occupied' || table.status === 'Booked'
        ).length;

        setStats({
          totalOrders: validOrders.length, // Only count non-cancelled orders
          totalRevenue: totalRevenue,
          occupiedTables: occupiedTables,
          totalTables: totalTables,
          todaysRevenue: todaysRevenue
        });
        
        setError(prev => ({ ...prev, stats: '', tables: '' }));
      } catch (err) {
        if (err.message.includes('orders')) {
          setError(prev => ({ ...prev, orders: err.message }));
        } else if (err.message.includes('tables')) {
          setError(prev => ({ ...prev, tables: err.message }));
        } else {
          setError(prev => ({ ...prev, stats: err.message }));
        }
        console.error("Error fetching data:", err);
      } finally {
        setLoading(prev => ({ orders: false, stats: false, tables: false }));
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000); // Auto-refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // ... rest of the component code remains the same ...
  const getStatusBadge = (status) => {
    const statusVariants = {
      pending: "secondary",
      preparing: "default",
      completed: "default",
      cancelled: "destructive"
    };
    
    const normalizedStatus = status?.toLowerCase() || 'unknown';
    const variant = statusVariants[normalizedStatus] || "secondary";
    
    return (
      <Badge variant={variant} className="capitalize">
        {normalizedStatus}
      </Badge>
    );
  };

  const formatItems = (items) => {
    if (!items || !Array.isArray(items)) return "No items";
    return items.map(item => 
      `${item.quantity || 1}x ${item.name || 'Unnamed Item'}`
    ).join(', ');
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <Button className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </Button>
        </div>
      </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading.stats ? (
                <Skeleton className="h-8 w-3/4" />
              ) : error.stats ? (
                <p className="text-destructive text-sm">Error loading</p>
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">
                    {formatNumber(stats.totalOrders)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.occupiedTables > 0 ? 
                      `${stats.occupiedTables} tables occupied` : 
                      'No active orders'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Revenue */} 
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading.stats ? (
                <Skeleton className="h-8 w-3/4" />
              ) : error.stats ? (
                <p className="text-destructive text-sm">Error loading</p>
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">
                    {formatINR(stats.totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Today's revenue: {formatINR(stats.todaysRevenue)}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tables - Combined View */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tables</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading.tables ? (
                <Skeleton className="h-8 w-3/4" />
              ) : error.tables ? (
                <p className="text-destructive text-sm">Error loading</p>
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">
                    {stats.occupiedTables}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalTables - stats.occupiedTables} available (Total: {stats.totalTables})
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Orders</CardTitle>
              {error.orders && (
                <Badge variant="destructive">{error.orders}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading.orders ? (
              <div className="flex justify-center items-center py-12">
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent orders found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => {
                    const orderId = order.orderId || order._id;
                    const total = typeof order.total === 'number' ? order.total.toFixed(2) : 'N/A';
                    
                    return (
                      <TableRow key={orderId}>
                        <TableCell className="font-medium">#{orderId}</TableCell>
                        <TableCell>{order.customerName || 'Unknown'}</TableCell>
                        <TableCell>{order.phoneNumber || 'N/A'}</TableCell>
                        <TableCell>{formatItems(order.items)}</TableCell>
                        <TableCell>₹{total}</TableCell>
                        <TableCell>{order.tableNumber || 'N/A'}</TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
    </AppLayout>
  );
};

export default Dashboard;