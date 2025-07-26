#!/bin/bash

echo "🚀 Setting up development environment..."

# ตรวจสอบว่า Vault ทำงานอยู่
if ! curl -s http://localhost:8201/v1/sys/health > /dev/null; then
    echo "❌ Vault is not running. Please start Vault first:"
    echo "   cd ../docker-compose up -d"
    exit 1
fi

# ตั้งค่า environment variables
export VAULT_ADDR=http://localhost:8201
export VAULT_TOKEN=myroot

echo "✅ Vault is running"

# รัน setup script
echo "📝 Setting up Vault secrets..."
node setup-vault.js

# ติดตั้ง dependencies ถ้ายังไม่ได้ติดตั้ง
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🎉 Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   npm start    - Start the application"
echo "   npm run dev  - Start with nodemon"
echo "   npm test     - Run tests"
echo ""
echo "🌐 URLs:"
echo "   Application: http://localhost:3000"
echo "   Vault UI:    http://localhost:8201"
echo ""