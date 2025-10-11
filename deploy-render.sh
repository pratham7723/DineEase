#!/bin/bash

echo "🚀 FlavorFusion Render Deployment Script"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first."
    exit 1
fi

# Check if we're on the main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "⚠️  You're on branch '$current_branch'. Switching to main branch..."
    git checkout main
fi

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes found. Committing them..."
    git add .
    git commit -m "Prepare for Render deployment - $(date)"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed to GitHub successfully!"
echo ""
echo "🌐 Next Steps:"
echo "1. Go to https://render.com/"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your GitHub repository: pratham7723/flavorfusion"
echo "5. Configure the following settings:"
echo "   - Name: flavorfusion-backend"
echo "   - Environment: Node"
echo "   - Build Command: cd server && npm install"
echo "   - Start Command: cd server && npm start"
echo "   - Root Directory: server"
echo ""
echo "6. Add these Environment Variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo "   - MONGO_URI=mongodb+srv://zeltrax:6B6Zvt2vkzw0AdCY@qrcode.ygptz.mongodb.net/?retryWrites=true&w=majority&appName=qrcode&dbName=qrcode"
echo "   - JWT_SECRET=18319e66f0f2818d99b83926a66e5c77672bec663b17d587fbfe3653d0de2fac"
echo "   - JWT_EXPIRES_IN=7d"
echo "   - IMAGEKIT_PUBLIC_KEY=public_+C8qAJu6ZKlhwQ6i0ZGfbNMa2Ho="
echo "   - IMAGEKIT_PRIVATE_KEY=private_YTyR3acLdo6ApVwMoyFIOxKAoIg="
echo "   - IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/rwz4yhwit/"
echo "   - CLIENT_URL=https://flavorfusion-2dr4afkh3-pratham7723s-projects.vercel.app"
echo "   - SERVER_URL=https://your-render-app-name.onrender.com"
echo ""
echo "7. Click 'Create Web Service'"
echo ""
echo "🎉 Your FlavorFusion backend will be deployed to Render!"
echo "📱 Frontend: https://flavorfusion-2dr4afkh3-pratham7723s-projects.vercel.app"
echo "🖥️  Backend: https://your-render-app-name.onrender.com"
