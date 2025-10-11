import React, { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, RefreshCw, Clock, CheckCircle, XCircle, ChefHat, Utensils } from 'lucide-react';

const Orders = () => {
  // State for orders management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);

  // State for manual order addition
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    phoneNumber: "",
    tableNumber: "",
    items: [{ menuItemId: "", name: "", price: 0, quantity: 1 }]
  });

  // Fetch orders and menu items from API
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [ordersResponse, menuResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders`),
        fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`)
      ]);

      if (!ordersResponse.ok) throw new Error(`Orders fetch failed: ${ordersResponse.status}`);
      if (!menuResponse.ok) throw new Error(`Menu fetch failed: ${menuResponse.status}`);

      const ordersData = await ordersResponse.json();
      const menuData = await menuResponse.json();

      setOrders(Array.isArray(ordersData) ? ordersData : (ordersData.data || []));
      setMenuItems(Array.isArray(menuData) ? menuData : (menuData.data || []));
      setLastUpdated(new Date());
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to fetch data: ${error.message}`);
      
      // Fallback to mock data if API fails (remove in production)
      if (error.message.includes("Menu fetch failed")) {
        setMenuItems([
          { _id: "1", name: "Burger", price: 120, category: "Main" },
          { _id: "2", name: "Pizza", price: 180, category: "Main" },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh data
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Cancel an order
  const cancelOrder = async (orderId) => {
    if (!orderId) {
      alert("❌ Invalid order ID.");
      return;
    }

    const confirmCancel = window.confirm(`Are you sure you want to cancel Order #${orderId}?`);
    if (!confirmCancel) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${orderId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel order");
      }

      setOrders(prevOrders => prevOrders.filter(order => 
        (order.orderId || order._id) !== orderId
      ));
      alert(`✅ Order #${orderId} cancelled successfully!`);
    } catch (error) {
      console.error("Error canceling order:", error);
      alert(`❌ Failed to cancel order: ${error.message}`);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus.toLowerCase() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order status");
      }

      const updatedOrder = await response.json();
      setOrders(prevOrders => 
        prevOrders.map(order => 
          (order.orderId || order._id) === orderId ? updatedOrder : order
        )
      );
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(`❌ Failed to update order: ${error.message}`);
      return false;
    }
  };

  // Add new order manually
  const addOrderManually = async () => {
    try {
      if (!newOrder.customerName || !newOrder.phoneNumber || !newOrder.tableNumber) {
        throw new Error("Customer name, phone number, and table number are required");
      }
      if (newOrder.items.length === 0 || newOrder.items.some(item => !item.menuItemId)) {
        throw new Error("Please add at least one valid menu item");
      }

      setLoading(true);
      
      // Prepare items for the API
      const itemsForApi = newOrder.items.map(item => ({
        _id: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?table=${newOrder.tableNumber}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: newOrder.customerName,
          phoneNumber: newOrder.phoneNumber,
          items: itemsForApi,
          total: newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const createdOrder = await response.json();
      setOrders([createdOrder, ...orders]);
      setShowAddOrderModal(false);
      setNewOrder({
        customerName: "",
        phoneNumber: "",
        tableNumber: "",
        items: [{ menuItemId: "", name: "", price: 0, quantity: 1 }]
      });
      alert("✅ Order created successfully!");
    } catch (error) {
      alert(`❌ Failed to create order: ${error.message}`);
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for item management
  const addNewItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { menuItemId: "", name: "", price: 0, quantity: 1 }]
    }));
  };

  const removeItem = (index) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setNewOrder(prev => {
      const updatedItems = [...prev.items];
      if (field === 'menuItemId') {
        const selectedItem = menuItems.find(item => item._id === value);
        updatedItems[index] = {
          ...updatedItems[index],
          menuItemId: value,
          name: selectedItem?.name || "",
          price: selectedItem?.price || 0
        };
      } else {
        updatedItems[index] = { ...updatedItems[index], [field]: value };
      }
      return { ...prev, items: updatedItems };
    });
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => 
    filter === "all" || order.status?.toLowerCase() === filter.toLowerCase()
  );

  // Format order items for display
  const formatItems = (items) => {
    if (!items || !Array.isArray(items)) return "No items";
    return items.map(item => 
      `${item.quantity || 1}x ${item.name || 'Unnamed Item'} (₹${item.price || 0})`
    ).join(', ');
  };

  // Format order items for detailed display
  const formatItemsDetailed = (items) => {
    if (!items || !Array.isArray(items)) return [];
    return items.map((item, index) => ({
      id: index,
      name: item.name || 'Unnamed Item',
      quantity: item.quantity || 1,
      price: item.price || 0,
      total: (item.quantity || 1) * (item.price || 0)
    }));
  };

  // Get status badge with appropriate styling
  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase() || 'unknown';
    
    const statusVariants = {
      pending: "secondary",
      preparing: "default", 
      completed: "default",
      cancelled: "destructive"
    };
    
    const variant = statusVariants[normalizedStatus] || "secondary";
    
    return (
      <Badge variant={variant} className="capitalize">
        {normalizedStatus}
      </Badge>
    );
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Orders Management</h2>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button 
            onClick={() => setShowAddOrderModal(true)}
            className="gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Order</span>
            <span className="sm:hidden">Add</span>
          </Button>
          <Button 
            onClick={fetchData}
            variant="outline"
            disabled={loading}
            className="gap-2"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'pending', 'preparing', 'completed', 'cancelled'].map((status) => (
          <Button
            key={status}
            onClick={() => setFilter(status)}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            className="capitalize text-xs sm:text-sm"
          >
            {status === 'all' ? (
              <>
                <span className="hidden sm:inline">All Orders</span>
                <span className="sm:hidden">All</span>
              </>
            ) : (
              status
            )}
          </Button>
        ))}
      </div>

      {/* Add Order Modal */}
      <Dialog open={showAddOrderModal} onOpenChange={setShowAddOrderModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
          </DialogHeader>
              
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  type="text"
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={newOrder.phoneNumber}
                  onChange={(e) => setNewOrder({...newOrder, phoneNumber: e.target.value})}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                type="text"
                value={newOrder.tableNumber}
                onChange={(e) => setNewOrder({...newOrder, tableNumber: e.target.value})}
                placeholder="Enter table number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Order Items</Label>
              {newOrder.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Select
                    value={item.menuItemId}
                    onValueChange={(value) => updateItem(index, 'menuItemId', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Menu Item" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuItems.map(menuItem => (
                        <SelectItem key={menuItem._id} value={menuItem._id}>
                          {menuItem.name} - ₹{menuItem.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    className="w-20"
                    placeholder="Qty"
                  />
                  {newOrder.items.length > 1 && (
                    <Button
                      onClick={() => removeItem(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                onClick={addNewItem}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                onClick={() => setShowAddOrderModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={addOrderManually}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading orders...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <XCircle className="h-5 w-5" />
              <span className="font-semibold">Error loading orders</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No orders found</h3>
            <p className="text-sm text-muted-foreground text-center">
              {filter === 'all' ? 'No orders in the system yet' : `No ${filter} orders at the moment`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      {!loading && filteredOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Orders ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const orderId = order.orderId || order._id;
                    const phoneNumber = order.phoneNumber || "N/A";

                    return (
                      <TableRow key={orderId}>
                        <TableCell className="font-medium">#{orderId}</TableCell>
                        <TableCell>{order.customerName || "Unknown"}</TableCell>
                        <TableCell>
                          {phoneNumber && phoneNumber !== "N/A" ? (
                            <span className="text-sm">{phoneNumber}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Not provided</span>
                          )}
                        </TableCell>
                        <TableCell>Table {order.tableNumber || "N/A"}</TableCell>
                        <TableCell className="max-w-xs">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsOrderDetailsOpen(true);
                                  }}
                                >
                                  {formatItemsDetailed(order.items).slice(0, 2).map((item) => (
                                    <div key={item.id} className="text-sm">
                                      <span className="font-medium">{item.quantity}x</span> {item.name}
                                      <span className="text-muted-foreground ml-1">(₹{item.total})</span>
                                    </div>
                                  ))}
                                  {formatItemsDetailed(order.items).length > 2 && (
                                    <div className="text-xs text-muted-foreground">
                                      +{formatItemsDetailed(order.items).length - 2} more items
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to view full order details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{typeof order.total === 'number' ? order.total.toFixed(2) : "N/A"}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(order.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                const newStatus = order.status === 'preparing' ? 'completed' : 'preparing';
                                updateOrderStatus(orderId, newStatus);
                              }}
                              size="sm"
                              variant={order.status === 'preparing' ? "default" : "outline"}
                              disabled={['completed', 'cancelled'].includes(order.status?.toLowerCase())}
                            >
                              {order.status === 'preparing' ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Complete
                                </>
                              ) : (
                                <>
                                  <Clock className="h-4 w-4 mr-1" />
                                  Start Preparing
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => cancelOrder(orderId)}
                              size="sm"
                              variant="destructive"
                              disabled={['completed', 'cancelled'].includes(order.status?.toLowerCase())}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Order Details #{selectedOrder?.orderId || selectedOrder?._id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Customer Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customerName || "Unknown"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Phone Number</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.phoneNumber || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Table Number</Label>
                  <p className="text-sm text-muted-foreground">Table {selectedOrder.tableNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Order Items</Label>
                <div className="space-y-2">
                  {formatItemsDetailed(selectedOrder.items).map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.quantity}x</p>
                        <p className="text-sm text-muted-foreground">₹{item.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Order Total */}
              <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-xl font-bold text-primary">
                  ₹{typeof selectedOrder.total === 'number' ? selectedOrder.total.toFixed(2) : "N/A"}
                </span>
              </div>

              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Special Instructions</Label>
                  <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    {selectedOrder.specialInstructions}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Orders;