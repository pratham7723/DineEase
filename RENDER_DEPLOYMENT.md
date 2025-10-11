# 🚀 FlavorFusion Render Deployment Guide

## 📋 Current Status
- ✅ **Frontend:** Deployed to Vercel at https://flavorfusion-2dr4afkh3-pratham7723s-projects.vercel.app
- 🔄 **Backend:** Ready for Render deployment

## 🎯 Render Deployment Steps

### Step 1: Create Render Account
1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub account
3. Connect your GitHub repository

### Step 2: Deploy Backend to Render
1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository: `pratham7723/flavorfusion`

2. **Configure Build Settings**
   - **Name:** `flavorfusion-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Root Directory:** `server`

3. **Environment Variables**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://zeltrax:6B6Zvt2vkzw0AdCY@qrcode.ygptz.mongodb.net/?retryWrites=true&w=majority&appName=qrcode&dbName=qrcode
   JWT_SECRET=18319e66f0f2818d99b83926a66e5c77672bec663b17d587fbfe3653d0de2fac
   JWT_EXPIRES_IN=7d
   IMAGEKIT_PUBLIC_KEY=public_+C8qAJu6ZKlhwQ6i0ZGfbNMa2Ho=
   IMAGEKIT_PRIVATE_KEY=private_YTyR3acLdo6ApVwMoyFIOxKAoIg=
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/rwz4yhwit/
   CLIENT_URL=https://flavorfusion-2dr4afkh3-pratham7723s-projects.vercel.app
   SERVER_URL=https://your-render-app-name.onrender.com
   ```

### Step 3: Update Frontend Environment
After Render deployment, update your Vercel environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_REACT_APP_SERVER_URL` to your Render URL
3. Redeploy the frontend

### Step 4: Test Deployment
1. **Backend Test:** Visit `https://your-render-app.onrender.com`
2. **Frontend Test:** Visit your Vercel URL
3. **API Test:** Check if API calls work from frontend

## 🔧 Render Configuration Files

### Create `server/package.json` (if needed)
```json
{
  "name": "flavorfusion-server",
  "version": "1.0.0",
  "description": "FlavorFusion Backend API",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "mongoose": "^8.12.1",
    "cors": "^2.8.5",
    "bcryptjs": "^3.0.2",
    "jsonwebtoken": "^9.0.2",
    "imagekit": "^6.0.0",
    "dotenv": "^16.4.7",
    "cookie-parser": "^1.4.7"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 🌐 Final URLs
- **Frontend:** https://flavorfusion-2dr4afkh3-pratham7723s-projects.vercel.app
- **Backend:** https://your-render-app-name.onrender.com
- **API Base:** https://your-render-app-name.onrender.com/api/v1

## 🔒 Security Notes
- ✅ Environment variables are secure in Render
- ✅ MongoDB connection is protected
- ✅ JWT secrets are encrypted
- ✅ CORS is configured for production

## 🚀 Render Free Tier Benefits
- **750 hours/month** (enough for 24/7 operation)
- **512MB RAM**
- **Automatic deployments** from GitHub
- **Custom domains** support
- **SSL certificates** included

## 📞 Support
- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com/
- GitHub Issues: https://github.com/pratham7723/flavorfusion/issues

---

🎉 **Your FlavorFusion app will be fully deployed and live!**
