#!/bin/bash
# Quick deployment script for Hostinger

echo "🚀 Starting Hostinger deployment..."

# Create production .env file
echo "📝 Creating production environment file..."
cat > .env << EOF
# Production Environment Configuration for Hostinger
MONGODB_URI=mongodb+srv://24uglyandrew:weaklings162@sanricosite.vgnc0qj.mongodb.net/
DATABASE_NAME=MyProductsDb
JWT_SECRET=your_super_secure_jwt_secret_key_here_must_be_long_and_random_production
SENDER_EMAIL=sanricomercantileofficial@gmail.com
N8N_WEBHOOK_URL=http://localhost:5678/webhook/send-verification-email
PORT=3000
NODE_ENV=production
EOF

echo "✅ Environment file created"
echo "⚠️  IMPORTANT: Change JWT_SECRET to a secure random string before going live!"

echo "📦 Installing dependencies..."
npm install

echo "🔧 Starting server..."
npm start

