// Demo API Wrapper
// Intercepts all API calls and returns mock data when DEMO_MODE is enabled

import { DEMO_MODE } from '../config/demoMode';
import { 
  MOCK_MENU, 
  MOCK_ORDERS, 
  MOCK_TABLES, 
  MOCK_STAFF, 
  MOCK_REPORTS,
  delay 
} from '../config/mockData';

// Original fetch function
const originalFetch = window.fetch;

// Demo mode fetch wrapper
export const setupDemoMode = () => {
  if (!DEMO_MODE) {
    return; // Don't override if not in demo mode
  }

  // Override global fetch
  window.fetch = async (url, options = {}) => {
    const urlStr = typeof url === 'string' ? url : url.toString();
    
    // Only intercept API calls to our server
    if (urlStr.includes('api/v1')) {
      console.log('🎭 Demo Mode: Intercepting API call:', urlStr);
      return mockApiCall(urlStr, options);
    }
    
    // Let all other fetch calls pass through
    return originalFetch(url, options);
  };
};

// Mock API call handler
const mockApiCall = async (url, options) => {
  await delay(300); // Simulate network delay
  
  const method = options.method || 'GET';
  
  // Parse the URL to determine endpoint
  const endpoint = url.split('api/v1/')[1]?.split('?')[0];
  const searchParams = new URLSearchParams(url.split('?')[1]);
  
  try {
    // Handle different endpoints
    switch (endpoint) {
      case 'orders':
        if (method === 'GET') {
          // Check for query parameters
          const limit = parseInt(searchParams.get('limit')) || MOCK_ORDERS.length;
          const sort = searchParams.get('sort');
          
          let orders = [...MOCK_ORDERS];
          
          // Handle sorting
          if (sort === '-createdAt') {
            orders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }
          
          return createResponse(orders.slice(0, limit), 200);
        }
        if (method === 'POST') {
          const body = JSON.parse(options.body);
          const newOrder = {
            ...body,
            _id: `mock_order_${Date.now()}`,
            orderId: MOCK_ORDERS[MOCK_ORDERS.length - 1]?.orderId + 1 || 1001,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          MOCK_ORDERS.push(newOrder);
          return createResponse({ success: true, data: newOrder }, 201);
        }
        if (method === 'PATCH') {
          const orderId = url.split('/').pop();
          const body = JSON.parse(options.body);
          const order = MOCK_ORDERS.find(o => o._id === orderId || o.orderId === parseInt(orderId));
          if (order) {
            Object.assign(order, body, { updatedAt: new Date().toISOString() });
            return createResponse({ success: true, data: order }, 200);
          }
          return createErrorResponse('Order not found', 404);
        }
        break;
        
      case 'orders/stats':
        if (method === 'GET') {
          const totalOrders = MOCK_ORDERS.length;
          const totalRevenue = MOCK_ORDERS.reduce((sum, order) => sum + (order.total || 0), 0);
          return createResponse({
            totalOrders,
            totalRevenue,
            avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
          }, 200);
        }
        break;
        
      case 'menus':
        if (method === 'GET') {
          return createResponse(MOCK_MENU, 200);
        }
        if (method === 'POST') {
          const body = JSON.parse(options.body);
          const newMenu = {
            ...body,
            _id: `mock_menu_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          MOCK_MENU.push(newMenu);
          return createResponse({ success: true, data: newMenu }, 201);
        }
        if (method === 'DELETE') {
          const menuId = url.split('/').pop();
          const index = MOCK_MENU.findIndex(m => m._id === menuId);
          if (index !== -1) {
            MOCK_MENU.splice(index, 1);
            return createResponse({ success: true }, 200);
          }
          return createErrorResponse('Menu item not found', 404);
        }
        break;
        
      case 'tables':
        if (method === 'GET') {
          return createResponse(MOCK_TABLES, 200);
        }
        if (method === 'POST') {
          const body = JSON.parse(options.body);
          const newTable = {
            ...body,
            _id: `mock_table_${Date.now()}`,
            qrCode: `DEMO_QR_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          MOCK_TABLES.push(newTable);
          return createResponse({ success: true, data: newTable }, 201);
        }
        if (method === 'PATCH') {
          const tableId = url.split('/').pop();
          const body = JSON.parse(options.body);
          const table = MOCK_TABLES.find(t => t._id === tableId);
          if (table) {
            Object.assign(table, body, { updatedAt: new Date().toISOString() });
            return createResponse({ success: true, data: table }, 200);
          }
          return createErrorResponse('Table not found', 404);
        }
        break;
        
      case 'users':
        if (method === 'GET') {
          return createResponse(MOCK_STAFF, 200);
        }
        break;
        
      case 'reports/daily':
        if (method === 'GET') {
          const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
          return createResponse({ ...MOCK_REPORTS.daily, date }, 200);
        }
        break;
        
      case 'reports/weekly':
        if (method === 'GET') {
          return createResponse(MOCK_REPORTS.weekly, 200);
        }
        break;
        
      case 'reports/top-items':
        if (method === 'GET') {
          return createResponse(MOCK_REPORTS.topItems, 200);
        }
        break;
        
      default:
        console.warn('🎭 Demo Mode: Unknown endpoint:', endpoint);
        return createErrorResponse('Endpoint not implemented in demo mode', 501);
    }
    
    // Default error response
    return createErrorResponse('Method not allowed in demo mode', 405);
    
  } catch (error) {
    console.error('🎭 Demo Mode: Error handling mock API call:', error);
    return createErrorResponse(error.message || 'Internal server error', 500);
  }
};

// Helper function to create a successful response
const createResponse = (data, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : status === 201 ? 'Created' : 'Error',
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
};

// Helper function to create an error response
const createErrorResponse = (message, status = 500) => {
  return Promise.resolve({
    ok: false,
    status,
    statusText: 'Error',
    json: async () => ({ error: message, success: false }),
    text: async () => JSON.stringify({ error: message, success: false }),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
};

// Cleanup function to restore original fetch
export const cleanupDemoMode = () => {
  window.fetch = originalFetch;
};

