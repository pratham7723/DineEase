# 🚀 FlavorFusion Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
1. **MongoDB Atlas Account** - For cloud database
2. **ImageKit Account** - For image and AR model storage
3. **Vercel Account** - For hosting

### Step 1: Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Replace `<password>` with your actual password

### Step 2: ImageKit Setup

1. Go to [ImageKit](https://imagekit.io/)
2. Create a new account
3. Get your:
   - Public Key
   - Private Key
   - URL Endpoint

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: flavorfusion
# - Directory: ./
# - Override settings? No
```

#### Option B: Deploy via GitHub Integration

1. Push your code to GitHub (already done)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import from GitHub: `pratham7723/flavorfusion`
5. Configure settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Step 4: Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

#### Server Variables:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flavorfusion?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
```

#### Client Variables:
```
VITE_REACT_APP_SERVER_URL=https://your-vercel-app.vercel.app
VITE_IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
```

### Step 5: Update Client Configuration

Update `client/src/pages/CustomerMenu.jsx` and other files to use the production server URL:

```javascript
// Replace localhost URLs with your Vercel URL
const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL || 'https://your-vercel-app.vercel.app';
```

### Step 6: Deploy Server Functions

The server will be deployed as Vercel Serverless Functions. Make sure your server code is compatible:

1. **Update server/index.js** to work with Vercel's serverless environment
2. **API routes** will be available at `/api/*`
3. **Static files** will be served from the client build

### Step 7: Test Deployment

1. Visit your Vercel URL
2. Test all functionality:
   - User registration/login
   - Menu browsing
   - AR model viewing
   - Order placement
   - Admin dashboard

## Alternative: Separate Deployments

### Client on Vercel + Server on Railway/Render

#### Deploy Client to Vercel:
```bash
cd client
vercel --prod
```

#### Deploy Server to Railway:
1. Go to [Railway](https://railway.app/)
2. Connect your GitHub repo
3. Select the `server` folder
4. Add environment variables
5. Deploy

#### Deploy Server to Render:
1. Go to [Render](https://render.com/)
2. Create new Web Service
3. Connect GitHub repo
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Add environment variables

## Post-Deployment Checklist

- [ ] Database connection working
- [ ] User authentication working
- [ ] Menu items loading
- [ ] AR models displaying
- [ ] Order placement working
- [ ] Admin dashboard accessible
- [ ] Image uploads working
- [ ] Email notifications (if implemented)
- [ ] SSL certificate active
- [ ] Performance optimized

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Update server CORS settings for production domain
2. **Environment Variables**: Ensure all variables are set in Vercel
3. **Database Connection**: Check MongoDB Atlas IP whitelist
4. **Build Errors**: Check Node.js version compatibility
5. **API Routes**: Verify serverless function deployment

### Support:
- Check Vercel logs in dashboard
- Check MongoDB Atlas logs
- Check ImageKit dashboard for upload issues

## Performance Optimization

1. **Enable Vercel Analytics**
2. **Optimize images** with ImageKit
3. **Enable CDN** for static assets
4. **Monitor** database performance
5. **Set up** error tracking (Sentry)

---

🎉 **Your FlavorFusion app is now live on Vercel!**
