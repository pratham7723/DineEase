// Demo Mode Configuration
// Set this to true to enable demo mode (no backend required)
// Set to false to use real backend

export const DEMO_MODE = true;

// Demo Users Credentials
export const DEMO_USERS = [
  {
    email: "owner@dineease.com",
    password: "owner123",
    role: "Owner",
    name: "John Owner",
    id: "demo_owner_1"
  },
  {
    email: "manager@dineease.com",
    password: "manager123",
    role: "Manager",
    name: "Sarah Manager",
    id: "demo_manager_1"
  },
  {
    email: "waiter@dineease.com",
    password: "waiter123",
    role: "Waiter",
    name: "Mike Waiter",
    id: "demo_waiter_1"
  },
  {
    email: "chef@dineease.com",
    password: "chef123",
    role: "Chef",
    name: "David Chef",
    id: "demo_chef_1"
  }
];

// Demo Token Generator
export const generateDemoToken = (userId) => {
  return `demo_token_${userId}_${Date.now()}`;
};

