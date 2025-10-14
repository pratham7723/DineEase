#!/bin/bash

echo "🔧 Update Render Environment Variables"
echo "====================================="
echo ""
echo "Please update your Render environment variables with the corrected MongoDB URI:"
echo ""
echo "MONGO_URI=mongodb+srv://zeltrax:6B6Zvt2vkzw0AdCY@qrcode.ygptz.mongodb.net/qrcode?retryWrites=true&w=majority&appName=qrcode"
echo ""
echo "Steps to update:"
echo "1. Go to https://render.com/dashboard"
echo "2. Click on your 'flavorfusion-backend' service"
echo "3. Go to 'Environment' tab"
echo "4. Find MONGO_URI and update it with the corrected value above"
echo "5. Click 'Save Changes'"
echo "6. Render will automatically redeploy"
echo ""
echo "The corrected URI fixes the database name placement in the connection string."

