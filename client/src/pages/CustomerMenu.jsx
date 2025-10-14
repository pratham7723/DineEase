import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, Plus, Minus, X, Smartphone, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog as HeadlessDialog, DialogBackdrop, DialogPanel, DialogTitle as HeadlessDialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// AR model configuration
const LOCAL_MODELS = {
  "Margerita": "/models/pizza.glb",
  "Burger": "/models/burger.glb",
  "Softy": "/models/icecream.glb",
  "Pina Colada": "/models/mocktail.glb",
  "Veg Sandwich": "/models/sandwich.glb",
  "Croissant": "/models/crossaint.glb",
  "Garlic Bread": "/models/garlicbread.glb",
  "Donut": "/models/donut.glb",
  "Coca Cola": "/models/coke.glb",
  "Red Velvet Pastry": "/models/redvelvet.glb",
  "cappuccino": "/models/coffee_cup.glb",
  "Cold Coffee": "/models/creamed_coffee.glb",
  "Iced Coffee": "/models/ice_coffee.glb",
  "Loaded Nachos": "/models/nachos.glb",
  "Veg Overloaded Pizza": "/models/Tp Pizza.glb",
  "Red Pepperoni Pizza": "/models/red peprika.glb",
  "Chicken Momos": "/models/momo_food.glb",
  "Veg Momos": "/models/momo_food.glb",
};

const CustomerMenu = () => {
  const { table: pathTable } = useParams();
  const [searchParams] = useSearchParams();
  const tableNumber = pathTable || searchParams.get("table") || "N/A";

  // State management
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [arModelUrl, setArModelUrl] = useState(null);
  const [existingOrders, setExistingOrders] = useState([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/menus`
        );
        setMenuItems(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  // Fetch existing orders when table number changes
  useEffect(() => {
    const fetchExistingOrders = async () => {
      try {
        const tableNum = parseInt(tableNumber, 10);
        if (isNaN(tableNum)) return;

        setIsFetchingOrders(true);
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?table=${tableNum}`
        );
        
        // Filter for active orders (not completed/cancelled)
        const orders = response.data.data || response.data;
        const activeOrders = orders.filter(order => 
          !['completed', 'cancelled'].includes(order.status?.toLowerCase())
        );
        
        setExistingOrders(activeOrders);
        
        // Auto-fill customer details from existing orders
        if (activeOrders.length > 0 && (!userName || !phoneNumber)) {
          const latestOrder = activeOrders[0]; // Get the most recent order
          if (latestOrder.customerName && !userName) {
            setUserName(latestOrder.customerName);
          }
          if (latestOrder.phoneNumber && !phoneNumber) {
            setPhoneNumber(latestOrder.phoneNumber);
          }
        }
      } catch (error) {
        console.error("Error fetching existing orders:", error);
      } finally {
        setIsFetchingOrders(false);
      }
    };

    fetchExistingOrders();
  }, [tableNumber]);

  // Helper functions
  const categories = ["All", ...new Set(menuItems.map((item) => item.category))];

  const filteredMenuItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
      return existingItem
        ? prevCart.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        : [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId));
  };

  const updateItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item => 
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      // Validate inputs
      const tableNum = parseInt(tableNumber, 10);
      if (isNaN(tableNum)) {
        toast.error("Please scan a valid table QR code");
        return;
      }
  
      if (!userName?.trim() || !phoneNumber?.trim()) {
        toast.error("Please enter your name and phone number");
        return;
      }
  
      if (cart.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      setIsProcessing(true);

      // Prepare order data
      const orderData = {
        customerName: userName.trim(),
        phoneNumber: phoneNumber.trim(),
        tableNumber: tableNum,
        items: cart.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: totalAmount,
        specialInstructions: "",
        status: "pending"
      };

      // Check for existing order from same customer
      const existingOrder = existingOrders.find(order => 
        order.customerName === userName.trim() && 
        order.phoneNumber === phoneNumber.trim()
      );

      let response;
      
      if (existingOrder) {
        // Update existing order by merging items
        const mergedItems = [...existingOrder.items];
        
        cart.forEach(cartItem => {
          const existingItemIndex = mergedItems.findIndex(
            item => item._id === cartItem._id
          );
          
          if (existingItemIndex >= 0) {
            mergedItems[existingItemIndex].quantity += cartItem.quantity;
          } else {
            mergedItems.push({
              _id: cartItem._id,
              name: cartItem.name,
              price: cartItem.price,
              quantity: cartItem.quantity
            });
          }
        });

        const updatedTotal = mergedItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );

        response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders/${existingOrder._id}`,
          {
            ...existingOrder,
            items: mergedItems,
            total: updatedTotal
          }
        );
      } else {
        // Create new order
        response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?table=${tableNum}`,
          orderData
        );
      }

      // Handle success
      if (response.status === 200 || response.status === 201) {
        const order = response.data.data || response.data;
        setOrderPlaced(true);
        setOrderNumber(order.orderId || "N/A");
        setCart([]);
        
        toast.success(`Order #${order.orderId || order._id} placed successfully!`);
        
        // Refresh existing orders
        const updatedResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/v1/orders?table=${tableNum}`
        );
        const updatedOrders = updatedResponse.data.data || updatedResponse.data;
        setExistingOrders(updatedOrders.filter(order => 
          !['completed', 'cancelled'].includes(order.status?.toLowerCase())
        ));
        
        setTimeout(() => setOrderPlaced(false), 5000);
      }

    } catch (error) {
      console.error("Order Error:", error);
      const errorMessage = error.response?.data?.message || 
        error.response?.data?.error ||
        "Order failed. Please check your connection and try again";
      
      toast.error(errorMessage);
      
      // Log detailed error for debugging
      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        console.error("Network Error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // AR Modal Component
  const ARModal = () => (
    <Dialog open={!!arModelUrl} onOpenChange={() => setArModelUrl(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>3D Model Viewer</DialogTitle>
        </DialogHeader>
        <div className="relative p-6">
          <model-viewer
            src={arModelUrl}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            style={{ width: '100%', height: '400px' }}
            alt="3D Model"
          >
            <Button 
              slot="ar-button" 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              View in AR
            </Button>
          </model-viewer>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Menu</h2>
        <p className="text-muted-foreground">Explore our delicious dishes and order now!</p>
        <Badge variant="outline" className="mt-2 text-lg">
          Table Number: {tableNumber}
        </Badge>
        {existingOrders.length > 0 && (
          <Badge variant="default" className="mt-1 ml-2">
            {existingOrders.length} active order(s)
          </Badge>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredMenuItems.map((item) => (
          <Card key={item._id} className={`overflow-hidden ${item.status !== "Available" ? "opacity-60" : ""}`}>
            <div className="w-full h-32 md:h-40 overflow-hidden">
              <img
                src={item.photo}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">{item.name}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary" className="w-fit">
                  {item.category}
                </Badge>
                <Badge 
                  variant={item.status === "Available" ? "default" : "destructive"}
                  className="w-fit"
                >
                  {item.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-md md:text-lg font-bold text-primary mb-4">
                ₹{item.price.toFixed(2)}
              </p>

              <div className="space-y-2">
                <Button
                  onClick={() => addToCart(item)}
                  className="w-full gap-2"
                  size="sm"
                  disabled={item.status !== "Available"}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {item.status === "Available" ? "Add to Cart" : "Out of Stock"}
                </Button>

                {(item.arModel || LOCAL_MODELS[item.name]) && (
                  <Button
                    onClick={() => {
                      const modelPath = item.arModel ? `/models/${item.arModel}` : LOCAL_MODELS[item.name];
                      console.log('AR Model for', item.name, ':', modelPath);
                      setArModelUrl(modelPath);
                    }}
                    variant="outline"
                    className="w-full gap-2"
                    size="sm"
                  >
                    <Eye className="h-4 w-4" />
                    View in 3D
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Floating Cart Button */}
      <Button
        className="fixed bottom-4 left-4 rounded-full shadow-lg"
        size="lg"
        onClick={() => setCartOpen(true)}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        {cart.length} {cart.length === 1 ? "Item" : "Items"}
      </Button>

      {/* Cart Panel - Headless UI Design */}
      <HeadlessDialog open={cartOpen} onClose={setCartOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <HeadlessDialogTitle className="text-lg font-medium text-gray-900">Shopping cart</HeadlessDialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setCartOpen(false)}
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-8">
                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
                      ) : (
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {cart.map((item) => (
                              <li key={item._id} className="flex py-6">
                                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  {item.photo ? (
                                    <img
                                      alt={item.name}
                                      src={item.photo}
                                      className="size-full object-cover"
                                    />
                                  ) : (
                                    <div className="size-full bg-gray-100 flex items-center justify-center">
                                      <Image className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <span>{item.name}</span>
                                      </h3>
                                      <p className="ml-4">₹{item.price.toFixed(2)}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Each</p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        onClick={() => updateItemQuantity(item._id, item.quantity - 1)}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <p className="text-gray-500">Qty {item.quantity}</p>
                                      <Button
                                        onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() => removeFromCart(item._id)}
                                        className="font-medium text-red-600 hover:text-red-500"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      {/* Existing Orders Summary */}
                      {existingOrders.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Active Orders ({existingOrders.length})
                            </span>
                          </div>
                          <div className="space-y-1">
                            {existingOrders.slice(0, 2).map((order, index) => (
                              <div key={index} className="text-xs text-blue-700">
                                Order #{order.orderId || index + 1}: {order.items.length} items (₹{order.total.toFixed(2)})
                              </div>
                            ))}
                            {existingOrders.length > 2 && (
                              <div className="text-xs text-blue-600 font-medium">
                                +{existingOrders.length - 2} more orders
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>₹{totalAmount.toFixed(2)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                      
                      {/* Customer Details */}
                      {existingOrders.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Customer details pre-filled from existing order
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 space-y-4">
                        <div>
                          <Label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                            Your Name
                            {existingOrders.length > 0 && (
                              <span className="text-green-600 ml-1 text-xs">(pre-filled)</span>
                            )}
                          </Label>
                          <Input
                            id="userName"
                            type="text"
                            placeholder="Enter your name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number
                            {existingOrders.length > 0 && (
                              <span className="text-green-600 ml-1 text-xs">(pre-filled)</span>
                            )}
                          </Label>
                          <Input
                            id="phoneNumber"
                            type="tel"
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          onClick={placeOrder}
                          disabled={isProcessing}
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-orange-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                              Processing Order...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-5 w-5 mr-2" />
                              Place Order - ₹{totalAmount.toFixed(2)}
                            </>
                          )}
                        </button>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{' '}
                          <button
                            type="button"
                            onClick={() => setCartOpen(false)}
                            className="font-medium text-orange-600 hover:text-orange-500"
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </HeadlessDialog>

      {/* Order Confirmation - Now handled by toast notifications */}

      {/* AR Viewer Modal */}
      <ARModal />

      {/* Add model-viewer script */}
      <script 
        type="module" 
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" 
        async
      />
    </div>
  );
};

export default CustomerMenu;