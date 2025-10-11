# 🔧 Environment Variables Setup Guide

## 📋 Required Environment Variables

### 🖥️ Server Environment Variables (`.env.development.local`)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/flavorfusion` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-jwt-key-here` |
| `JWT_EXPIRES_IN` | JWT token expiration | `7d` |
| `CLIENT_URL` | Frontend URL | `http://localhost:5174` |
| `SERVER_URL` | Backend URL | `http://localhost:5000` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | `public_xxxxxxxxxx` |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | `private_xxxxxxxxxx` |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | `https://ik.imagekit.io/your-imagekit-id` |

### 🌐 Client Environment Variables (`client/.env.development.local`)

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `VITE_REACT_APP_SERVER_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_REACT_APP_CLIENT_URL` | Frontend URL | `http://localhost:5174` |
| `VITE_REACT_APP_IMAGEKIT_PUBLIC_KEY` | ImageKit public key | `public_xxxxxxxxxx` |
| `VITE_REACT_APP_IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | `https://ik.imagekit.io/your-imagekit-id` |

## 🚀 Quick Setup

### 1. Run the Setup Script
```bash
./setup-env.sh
```

### 2. Edit Environment Files
```bash
# Edit server environment
nano .env.development.local

# Edit client environment
nano client/.env.development.local
```

## 🔑 Getting Your Values

### MongoDB Connection String

#### Local MongoDB:
```bash
MONGO_URI=mongodb://localhost:27017/flavorfusion
```

#### MongoDB Atlas (Cloud):
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Create a database user
4. Get connection string:
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/flavorfusion?retryWrites=true&w=majority
```

### JWT Secret
Generate a secure random string:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use any secure random string generator
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure
```

### ImageKit Configuration
1. Go to [ImageKit](https://imagekit.io/)
2. Create an account
3. Get your credentials from the dashboard:
   - Public Key: `public_xxxxxxxxxx`
   - Private Key: `private_xxxxxxxxxx`
   - URL Endpoint: `https://ik.imagekit.io/your-imagekit-id`

## 🌍 Production Environment Variables

### For Vercel Deployment:

#### Server Variables (in Vercel Dashboard):
```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/flavorfusion?retryWrites=true&w=majority
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
```

#### Client Variables (in Vercel Dashboard):
```
VITE_REACT_APP_SERVER_URL=https://your-vercel-app.vercel.app
VITE_REACT_APP_CLIENT_URL=https://your-vercel-app.vercel.app
VITE_REACT_APP_IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
VITE_REACT_APP_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id
```

## 🔒 Security Notes

1. **Never commit `.env` files to git** (already in `.gitignore`)
2. **Use different JWT secrets** for development and production
3. **Keep ImageKit private keys secure**
4. **Use strong, unique passwords** for database users
5. **Enable IP whitelisting** in MongoDB Atlas for production

## 🧪 Testing Your Setup

### 1. Start the Server
```bash
cd server
npm run dev
```

### 2. Start the Client
```bash
cd client
npm run dev
```

### 3. Test API Connection
Visit: `http://localhost:5000/api/v1/health` (if you have a health endpoint)

### 4. Test Frontend
Visit: `http://localhost:5174`

## 🐛 Troubleshooting

### Common Issues:

1. **"Cannot connect to MongoDB"**
   - Check `MONGO_URI` is correct
   - Ensure MongoDB is running (local) or cluster is accessible (Atlas)

2. **"JWT_SECRET is required"**
   - Make sure `JWT_SECRET` is set in server environment

3. **"ImageKit upload failed"**
   - Verify ImageKit credentials are correct
   - Check ImageKit dashboard for API limits

4. **"API calls failing"**
   - Ensure `VITE_REACT_APP_SERVER_URL` matches your server URL
   - Check CORS settings in server

### Debug Commands:
```bash
# Check if environment variables are loaded
node -e "console.log(process.env.MONGO_URI)"

# Test MongoDB connection
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('Connected!')).catch(console.error)"
```

## 📚 Additional Resources

- [MongoDB Atlas Setup Guide](https://docs.atlas.mongodb.com/getting-started/)
- [ImageKit Documentation](https://docs.imagekit.io/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
