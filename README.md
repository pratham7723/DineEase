# 🍽️ DineEase

Complete Restaurant Management System with AR Menu, Order Management, and Real-time Updates

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🎯 **AR 3D Menu Visualization** - Interactive 3D models of food items
- 📱 **QR Code Table Management** - Generate and manage QR codes for tables
- 📊 **Real-time Order Management** - Track orders in real-time across different roles
- 👥 **Role-based Access Control** - Separate dashboards for Admin, Staff, Waiter, and Kitchen Staff
- 🍕 **Menu Management** - Add, edit, and organize menu items with images
- 📈 **Reports & Analytics** - Generate sales reports and analytics
- 🧾 **Bill Generation** - PDF bill generation for orders
- 🎨 **Modern UI** - Built with React, Tailwind CSS, and shadcn/ui components

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Routing
- **Three.js / React Three Fiber** - 3D/AR menu visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **ImageKit** - Image storage and CDN
- **bcrypt** - Password hashing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **MongoDB** - Either local installation or MongoDB Atlas account
- **ImageKit Account** - For image uploads (optional for local development)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/pratham7723/DineEase.git
cd DineEase
```

### 2. Install Dependencies

You can install dependencies for all packages at once:

```bash
npm run install:all
```

Or install them separately:

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

## 🔐 Environment Variables

### Server Environment Variables

Create a `.env.development.local` file in the `server/` directory:

```env
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/dineease
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:8000
PORT=8000
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
JWT_SECRET=your_jwt_secret_key
```

**Note**: The app is now configured to use **local MongoDB** by default. If you want to use MongoDB Atlas (cloud), change the `MONGO_URI` to your Atlas connection string.

### Client Environment Variables

Create a `.env.development.local` file in the `client/` directory:

```env
# Server URL for API calls
VITE_REACT_APP_SERVER_URL=http://localhost:8000

# Client URL for redirects
VITE_REACT_APP_CLIENT_URL=http://localhost:5173

# ImageKit Configuration for client-side uploads
VITE_REACT_APP_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
VITE_REACT_APP_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### Root Environment Variables (Optional)

Create a `.env.development.local` file in the root directory if needed:

```env
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:8000
PORT=8000
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
JWT_SECRET=your_jwt_secret_key
```

### Getting Environment Variable Values

1. **MongoDB URI**: 
   - For local MongoDB: `mongodb://localhost:27017/dineease` (default)
   - For MongoDB Atlas: Get connection string from your Atlas cluster

2. **ImageKit Credentials**:
   - Sign up at [ImageKit.io](https://imagekit.io)
   - Get your Public Key, Private Key, and URL Endpoint from the dashboard

3. **JWT Secret**:
   - Generate a random string (at least 32 characters)
   - You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## ▶️ Running the Application

### Development Mode

Run both client and server concurrently:

```bash
npm run dev
```

This will start:
- **Client**: http://localhost:5173
- **Server**: http://localhost:8000

### Run Client and Server Separately

**Client only:**
```bash
npm run dev:client
# or
cd client && npm run dev
```

**Server only:**
```bash
npm run dev:server
# or
cd server && npm run dev
```

### Production Build

**Build client:**
```bash
npm run build
# or
npm run build:client
```

**Start server in production:**
```bash
npm start
# or
cd server && npm start
```

## 📁 Project Structure

```
dineease/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   │   └── models/        # 3D GLB models
│   ├── .env.development.local
│   └── package.json
│
├── server/                # Express backend application
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── database/          # Database connection
│   ├── middlewares/       # Express middlewares
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── .env.development.local
│   ├── index.js           # Server entry point
│   └── package.json
│
├── .env.development.local # Root environment (optional)
├── package.json           # Root package.json
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## 🎯 Key Features Implementation

### Roles

The system supports multiple user roles:
- **Admin/Management** - Full access to all features
- **Staff** - Menu and order management
- **Waiter** - Order taking and table management
- **Kitchen Staff** - View and update order status

### QR Code Generation

- QR codes are generated for each table
- Customers scan QR codes to access the menu
- QR codes use the production client URL

### 3D Menu

- Interactive 3D models of food items using Three.js
- GLB format models stored in `client/public/models/`

## 🌐 Deployment

### Vercel Deployment

The project is configured for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

**Important**: Make sure to set the production environment variables in Vercel:
- Use production MongoDB URI
- Use production ImageKit credentials
- Set `VITE_REACT_APP_CLIENT_URL` to your production domain

### Server Deployment

For the server, you can deploy to:
- **Render** - Recommended (as used in production)
- **Railway**
- **Heroku**
- Any Node.js hosting platform

Make sure to set the production environment variables on your hosting platform.

## 🔧 Troubleshooting

### Port Already in Use

If port 8000 or 5173 is already in use:

1. Change the port in environment variables
2. Or kill the process using the port:
   ```bash
   # For macOS/Linux
   lsof -ti:8000 | xargs kill -9
   ```

### MongoDB Connection Issues

- Verify your MongoDB URI is correct
- For MongoDB Atlas, ensure your IP is whitelisted
- Check if MongoDB is running (for local installation)

### ImageKit Issues

- Verify your ImageKit credentials
- Check if the ImageKit keys have the correct permissions
- For local development, ImageKit is optional (you can use placeholder images)

### Build Errors

- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules client/node_modules server/node_modules
  npm run install:all
  ```

## 📝 Available Scripts

### Root Level

- `npm run dev` - Run both client and server in development mode
- `npm run dev:client` - Run only client
- `npm run dev:server` - Run only server
- `npm run build` - Build client for production
- `npm run start` - Start server in production mode
- `npm run install:all` - Install all dependencies

### Client Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server Scripts

- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start server

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**pratham7723**

- GitHub: [@pratham7723](https://github.com/pratham7723)
- Repository: [DineEase](https://github.com/pratham7723/DineEase)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [ImageKit](https://imagekit.io) for image storage
- [Three.js](https://threejs.org) for 3D graphics
- All open-source contributors

---

⭐ If you find this project helpful, please consider giving it a star!

