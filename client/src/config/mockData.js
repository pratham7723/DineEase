// Mock Data for Demo Mode
// This file contains all dummy data for demo purposes

// Mock Menu Data
export const MOCK_MENU = [
  {
    _id: "mock_menu_1",
    name: "Veg Burger",
    category: "Fastfood",
    price: 340,
    status: "Available",
    photo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    arModel: "burger.glb",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    _id: "mock_menu_2",
    name: "Margherita Pizza",
    category: "Pizzas & Garlic Bread",
    price: 599,
    status: "Available",
    photo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    arModel: "pizza.glb",
    createdAt: "2025-01-15T10:05:00Z",
    updatedAt: "2025-01-15T10:05:00Z"
  },
  {
    _id: "mock_menu_3",
    name: "Cold Coffee",
    category: "Beverages",
    price: 210,
    status: "Available",
    photo: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80",
    arModel: "creamed_coffee.glb",
    createdAt: "2025-01-15T10:10:00Z",
    updatedAt: "2025-01-15T10:10:00Z"
  },
  {
    _id: "mock_menu_4",
    name: "Red Velvet Pastry",
    category: "Dessert",
    price: 299,
    status: "Available",
    photo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    arModel: "redvelvet.glb",
    createdAt: "2025-01-15T10:15:00Z",
    updatedAt: "2025-01-15T10:15:00Z"
  },
  {
    _id: "mock_menu_5",
    name: "Loaded Nachos",
    category: "Mexican",
    price: 250,
    status: "Available",
    photo: "https://images.unsplash.com/photo-1636565802643-5c9f7bd4d1eb?w=400&q=80",
    arModel: "nachos.glb",
    createdAt: "2025-01-15T10:20:00Z",
    updatedAt: "2025-01-15T10:20:00Z"
  },
  {
    _id: "mock_menu_6",
    name: "Veg Momos",
    category: "Momos",
    price: 160,
    status: "Available",
    photo: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80",
    arModel: "momo_food.glb",
    createdAt: "2025-01-15T10:25:00Z",
    updatedAt: "2025-01-15T10:25:00Z"
  }
];

// Mock Orders Data
export const MOCK_ORDERS = [
  {
    _id: "mock_order_1",
    orderId: 1001,
    customerName: "John Doe",
    tableNumber: 5,
    status: "pending",
    items: [
      { name: "Veg Burger", price: 340, quantity: 2 },
      { name: "Cold Coffee", price: 210, quantity: 1 }
    ],
    total: 890,
    createdAt: "2025-01-20T12:00:00Z",
    updatedAt: "2025-01-20T12:00:00Z"
  },
  {
    _id: "mock_order_2",
    orderId: 1002,
    customerName: "Jane Smith",
    tableNumber: 3,
    status: "preparing",
    items: [
      { name: "Margherita Pizza", price: 599, quantity: 1 },
      { name: "Loaded Nachos", price: 250, quantity: 1 }
    ],
    total: 849,
    createdAt: "2025-01-20T12:15:00Z",
    updatedAt: "2025-01-20T12:30:00Z"
  },
  {
    _id: "mock_order_3",
    orderId: 1003,
    customerName: "Bob Wilson",
    tableNumber: 7,
    status: "ready",
    items: [
      { name: "Veg Momos", price: 160, quantity: 3 }
    ],
    total: 480,
    createdAt: "2025-01-20T12:30:00Z",
    updatedAt: "2025-01-20T13:00:00Z"
  },
  {
    _id: "mock_order_4",
    orderId: 1004,
    customerName: "Alice Brown",
    tableNumber: 2,
    status: "completed",
    items: [
      { name: "Red Velvet Pastry", price: 299, quantity: 2 },
      { name: "Cold Coffee", price: 210, quantity: 2 }
    ],
    total: 1018,
    createdAt: "2025-01-20T11:00:00Z",
    updatedAt: "2025-01-20T13:15:00Z"
  }
];

// Mock Tables Data (matching real database schema)
export const MOCK_TABLES = [
  { _id: "mock_table_1", tableNo: 1, capacity: 4, status: "Available", menuItems: [], currentOrder: null },
  { _id: "mock_table_2", tableNo: 2, capacity: 2, status: "Booked", menuItems: [
    { menuItem: "67e13ecb7a371bfb754d57d2", quantity: 2 },
    { menuItem: "67e141177a371bfb754d5804", quantity: 1 }
  ], currentOrder: "67dda1124694c47c712d39a7", customerName: "John Doe", customerPhone: "9876543210" },
  { _id: "mock_table_3", tableNo: 3, capacity: 6, status: "Available", menuItems: [], currentOrder: null },
  { _id: "mock_table_4", tableNo: 4, capacity: 4, status: "Available", menuItems: [], currentOrder: null },
  { _id: "mock_table_5", tableNo: 5, capacity: 4, status: "Booked", menuItems: [
    { menuItem: "67e1420e7a371bfb754d5808", quantity: 1 }
  ], currentOrder: "67dda1124694c47c712d39b8", customerName: "Jane Smith", customerPhone: "9876543211" },
  { _id: "mock_table_6", tableNo: 6, capacity: 8, status: "Available", menuItems: [], currentOrder: null },
  { _id: "mock_table_7", tableNo: 7, capacity: 2, status: "Booked", menuItems: [], currentOrder: null },
  { _id: "mock_table_8", tableNo: 8, capacity: 4, status: "Available", menuItems: [], currentOrder: null }
];

// Mock Staff Data
export const MOCK_STAFF = [
  {
    _id: "mock_staff_1",
    name: "Sarah Manager",
    email: "sarah@dineease.com",
    phone: "9876543210",
    role: "Manager",
    createdAt: "2025-01-01T00:00:00Z"
  },
  {
    _id: "mock_staff_2",
    name: "Mike Waiter",
    email: "mike@dineease.com",
    phone: "9876543211",
    role: "Waiter",
    createdAt: "2025-01-01T00:00:00Z"
  },
  {
    _id: "mock_staff_3",
    name: "David Chef",
    email: "david@dineease.com",
    phone: "9876543212",
    role: "Chef",
    createdAt: "2025-01-01T00:00:00Z"
  }
];

// Mock Reports Data
export const MOCK_REPORTS = {
  daily: {
    revenue: 12500,
    orders: 45,
    avgOrderValue: 278,
    date: new Date().toISOString().split('T')[0]
  },
  weekly: {
    revenue: 87500,
    orders: 315,
    avgOrderValue: 278,
    startDate: "2025-01-14",
    endDate: "2025-01-20"
  },
  topItems: [
    { name: "Margherita Pizza", quantity: 45, revenue: 26955 },
    { name: "Cold Coffee", quantity: 38, revenue: 7980 },
    { name: "Veg Burger", quantity: 32, revenue: 10880 },
    { name: "Veg Momos", quantity: 28, revenue: 4480 }
  ]
};

// Note: This function will be imported separately to avoid circular dependencies
// It's defined here for documentation purposes

// Simulate API delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

