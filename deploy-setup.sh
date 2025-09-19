#!/bin/bash
# Production Deployment Instructions for Vercel

echo "🔧 Setting up environment for production deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Creating sample..."
    cat > .env.sample << EOF
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET=your_super_secret_jwt_key_here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF
    echo "📝 Created .env.sample file. Please copy it to .env and fill in your values."
else
    echo "✅ .env file found"
fi

echo ""
echo "🚀 IMPORTANT: For Vercel deployment, you need to set these environment variables:"
echo ""
echo "1. In your Vercel dashboard, go to your project settings"
echo "2. Add these environment variables:"
echo "   - MONGODB_URI: Your MongoDB connection string"
echo "   - JWT_SECRET: A secure random string (NOT the same as NEXT_PUBLIC_JWT_SECRET)"
echo "   - ADMIN_USERNAME: Your admin username"
echo "   - ADMIN_PASSWORD: Your admin password"
echo "   - NEXT_PUBLIC_BASE_URL: Your production domain (e.g., https://yourapp.vercel.app)"
echo ""
echo "3. REMOVE the NEXT_PUBLIC_JWT_SECRET from Vercel (security fix)"
echo ""
echo "⚠️  SECURITY NOTICE: We've fixed a critical security issue where JWT_SECRET was exposed to the client."
echo "   Make sure to use JWT_SECRET (server-side only) instead of NEXT_PUBLIC_JWT_SECRET"
echo ""
echo "4. After setting environment variables, redeploy your application."
echo ""
echo "✅ Your admin authentication should now work properly in production!"
