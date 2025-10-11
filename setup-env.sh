#!/bin/bash

echo "🚀 Setting up FlavorFusion Environment Variables"
echo "================================================"

# Create server environment file
echo "📁 Creating server environment file..."
cp env.development.example .env.development.local

# Create client environment file
echo "📁 Creating client environment file..."
cp client/env.development.example client/.env.development.local

echo "✅ Environment files created!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.development.local in the root directory"
echo "2. Edit client/.env.development.local in the client directory"
echo "3. Fill in your actual values for:"
echo "   - MONGO_URI (MongoDB connection string)"
echo "   - JWT_SECRET (a secure random string)"
echo "   - IMAGEKIT_PUBLIC_KEY (from ImageKit dashboard)"
echo "   - IMAGEKIT_PRIVATE_KEY (from ImageKit dashboard)"
echo "   - IMAGEKIT_URL_ENDPOINT (from ImageKit dashboard)"
echo ""
echo "🔒 These files are already in .gitignore and won't be committed to git."
echo ""
echo "🌐 For production deployment, add these same variables to your Vercel dashboard."
