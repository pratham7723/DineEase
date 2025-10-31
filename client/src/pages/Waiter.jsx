import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Utensils, Plus, X } from 'lucide-react';

const Waiter = () => {
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableOrder, setTableOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, tablesRes, menuRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`),
          fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/tables`),
          fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`)
        ]);
        
        const ordersData = await ordersRes.json();
        const tablesData = await tablesRes.json();
        const menuData = await menuRes.json();
        
        // Filter active orders (pending or preparing)
        const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
        const active = orders.filter(order => 
          ['pending', 'preparing'].includes(order.status?.toLowerCase())
        );
        setActiveOrders(active);
        
        // Set tables and menu items
        setTables(Array.isArray(tablesData) ? tablesData : (tablesData.data || tablesData));
        setMenuItems(Array.isArray(menuData) ? menuData : (menuData.data || menuData));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);


  const formatItems = (items) => {
    if (!items || !Array.isArray(items)) return "No items";
    return items.map(item => 
      `${item.quantity || 1}x ${item.name || 'Unnamed Item'}`
    ).join(', ');
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'unknown';
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[normalizedStatus] || 'bg-gray-100 text-gray-800';
  };

  const handleTableClick = async (table) => {
    setSelectedTable(table);
    
    // Find active orders for this table
    const tableOrders = activeOrders.filter(order => 
      order.tableNumber === table.tableNo
    );
    
    // If there's an active order, fetch its details
    if (tableOrders.length > 0) {
      try {
        const orderId = tableOrders[0].orderId || tableOrders[0]._id;
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${orderId}`);
        const orderData = await response.json();
        setTableOrder(orderData);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setTableOrder(tableOrders[0]); // Use the order from active orders
      }
    } else {
      setTableOrder(null);
    }
    
    setIsDialogOpen(true);
  };

  const addItemToOrder = async () => {
    if (!selectedMenuItem || !tableOrder) return;

    const menuItem = menuItems.find(item => item._id === selectedMenuItem);
    if (!menuItem) return;

    try {
      setLoading(true);
      
      // Prepare updated items array
      const existingItemIndex = tableOrder.items.findIndex(
        item => item._id === menuItem._id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        updatedItems = [...tableOrder.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + selectedQuantity
        };
      } else {
        // Add new item
        updatedItems = [
          ...tableOrder.items,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: selectedQuantity
          }
        ];
      }

      // Calculate new total
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + (item.price * (item.quantity || 1)),
        0
      );

      const orderId = tableOrder.orderId || tableOrder._id;
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${orderId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...tableOrder,
            items: updatedItems,
            total: newTotal
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update order');
      }

      const result = await response.json();
      // Handle both direct order response and wrapped response
      const updatedOrder = result.data || result;
      setTableOrder(updatedOrder);
      
      // Refresh active orders
      const ordersRes = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`);
      const ordersData = await ordersRes.json();
      const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
      const active = orders.filter(order => 
        ['pending', 'preparing'].includes(order.status?.toLowerCase())
      );
      setActiveOrders(active);

      // Reset form
      setSelectedMenuItem('');
      setSelectedQuantity(1);
      alert('Item added to order successfully!');
    } catch (error) {
      console.error('Error adding item to order:', error);
      alert(`Failed to add item to order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromOrder = async (itemIndex) => {
    if (!tableOrder) return;

    try {
      setLoading(true);
      const updatedItems = tableOrder.items.filter((_, index) => index !== itemIndex);
      
      const orderId = tableOrder.orderId || tableOrder._id;
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${orderId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...tableOrder,
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, item) => sum + (item.price * (item.quantity || 1)),
              0
            )
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to remove item');
      }

      const result = await response.json();
      // Handle both direct order response and wrapped response
      const updatedOrder = result.data || result;
      setTableOrder(updatedOrder);
      
      // Refresh active orders
      const ordersRes = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`);
      const ordersData = await ordersRes.json();
      const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
      const active = orders.filter(order => 
        ['pending', 'preparing'].includes(order.status?.toLowerCase())
      );
      setActiveOrders(active);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Waiter Dashboard</h2>
          <Button 
            onClick={() => navigate('/orders')}
            className="gap-2"
          >
            <Utensils className="h-4 w-4" />
            View All Orders
          </Button>
        </div>

        {/* Active Orders Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Active Orders</CardTitle>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/orders')}
                className="gap-2"
              >
                <Utensils className="h-4 w-4" />
                View All Orders
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading && activeOrders.length === 0 ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : activeOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No active orders at the moment.</p>
                <Button 
                  onClick={() => navigate('/orders')}
                  variant="outline"
                  className="gap-2"
                >
                  <Utensils className="h-4 w-4" />
                  Go to Orders Page
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeOrders.map((order) => {
                  const orderId = order.orderId || order._id;
                  return (
                    <div key={orderId} className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Order #{orderId}</p>
                          <p className="text-sm text-gray-600">Table {order.tableNumber}</p>
                        </div>
                        <Badge className={getStatusBadge(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Customer:</span> {order.customerName || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatItems(order.items)}
                        </p>
                        <p className="text-sm font-medium mt-2">
                          Total: ₹{typeof order.total === 'number' ? order.total.toFixed(2) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tables Section */}
        <Card>
          <CardHeader>
            <CardTitle>Tables</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && tables.length === 0 ? (
              <p className="text-gray-500">Loading tables...</p>
            ) : tables.length === 0 ? (
              <p className="text-gray-500">No tables available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tables.map((table) => {
                  const tableActiveOrder = activeOrders.find(
                    order => order.tableNumber === table.tableNo
                  );
                  
                  return (
                    <div
                      key={table._id}
                      onClick={() => handleTableClick(table)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        table.status === 'Available'
                          ? 'border-green-200 bg-green-50 hover:border-green-300'
                          : 'border-red-200 bg-red-50 hover:border-red-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-lg font-semibold">Table {table.tableNo}</p>
                          <p className="text-sm text-gray-600">Capacity: {table.capacity}</p>
                        </div>
                        <Badge className={
                          table.status === 'Available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }>
                          {table.status}
                        </Badge>
                      </div>
                      {tableActiveOrder && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-gray-600">
                            Active Order #{tableActiveOrder.orderId || tableActiveOrder._id}
                          </p>
                          <p className="text-xs font-medium">
                            ₹{typeof tableActiveOrder.total === 'number' ? tableActiveOrder.total.toFixed(2) : 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Table Order Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Table {selectedTable?.tableNo} - Order Details
              </DialogTitle>
              <DialogDescription>
                {tableOrder ? 'View and manage active order for this table' : 'No active order for this table'}
              </DialogDescription>
            </DialogHeader>

            {tableOrder ? (
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {tableOrder.customerName || 'Unknown'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {tableOrder.phoneNumber || 'N/A'}
                  </p>
                  <div className="mt-2">
                    <Badge className={getStatusBadge(tableOrder.status)}>
                      {tableOrder.status}
                    </Badge>
                  </div>
                </div>

                {/* Current Order Items */}
                <div>
                  <h4 className="font-semibold mb-2">Current Order Items</h4>
                  {tableOrder.items && tableOrder.items.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium">Item</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Qty</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Total</th>
                            <th className="px-4 py-2 text-left text-xs font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {tableOrder.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2">{item.name}</td>
                              <td className="px-4 py-2">{item.quantity || 1}</td>
                              <td className="px-4 py-2">₹{item.price?.toFixed(2) || '0.00'}</td>
                              <td className="px-4 py-2">
                                ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </td>
                              <td className="px-4 py-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItemFromOrder(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="3" className="px-4 py-2 font-semibold text-right">
                              Total:
                            </td>
                            <td className="px-4 py-2 font-semibold">
                              ₹{typeof tableOrder.total === 'number' ? tableOrder.total.toFixed(2) : '0.00'}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No items in this order</p>
                  )}
                </div>

                {/* Add Items Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Add Items to Order</h4>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="menu-item">Select Menu Item</Label>
                      <Select
                        value={selectedMenuItem}
                        onValueChange={setSelectedMenuItem}
                      >
                        <SelectTrigger id="menu-item">
                          <SelectValue placeholder="Select an item" />
                        </SelectTrigger>
                        <SelectContent>
                          {menuItems.map((item) => (
                            <SelectItem key={item._id} value={item._id}>
                              {item.name} - ₹{item.price?.toFixed(2) || '0.00'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={addItemToOrder}
                        disabled={!selectedMenuItem || loading}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No active order for Table {selectedTable?.tableNo}</p>
                <p className="text-sm text-gray-400">Create a new order from the Orders page</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
    </AppLayout>
  );
};

export default Waiter;