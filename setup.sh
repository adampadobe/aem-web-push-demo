#!/bin/bash

# AEM Web Push Demo - Setup Script
# This script helps you set up the project

echo "🚀 AEM Web Push Demo - Setup Script"
echo "===================================="
echo ""

# Check if config.js exists
if [ ! -f "scripts/config.js" ]; then
    echo "❌ Error: scripts/config.js not found!"
    exit 1
fi

# Check if placeholder values still exist
if grep -q "YOUR_DATASTREAM_ID_HERE" scripts/config.js; then
    echo "⚠️  WARNING: You need to configure scripts/config.js with your credentials"
    echo ""
    echo "Please update the following values in scripts/config.js:"
    echo "  1. datastreamId - Get from Adobe Experience Platform Data Collection"
    echo "  2. orgId - Your Adobe Organization ID"
    echo "  3. trackingDatasetId - Get from Journey Optimizer > Datasets"
    echo ""
    echo "📖 See CONFIGURATION.md for detailed instructions"
    echo ""
    read -p "Have you updated the config.js file? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please update scripts/config.js and run this script again."
        exit 1
    fi
fi

echo "✅ Configuration check passed"
echo ""

# Check for web server
echo "🔍 Checking for available web servers..."
echo ""

HAS_PYTHON=false
HAS_NODE=false
HAS_PHP=false

if command -v python3 &> /dev/null; then
    HAS_PYTHON=true
    echo "✅ Python 3 found"
fi

if command -v npx &> /dev/null; then
    HAS_NODE=true
    echo "✅ Node.js (npx) found"
fi

if command -v php &> /dev/null; then
    HAS_PHP=true
    echo "✅ PHP found"
fi

echo ""

# Prompt user to start a server
echo "Select a web server to start:"
echo "  1) Python 3 HTTP Server (port 8000)"
echo "  2) Node.js http-server (port 8000)"
echo "  3) PHP built-in server (port 8000)"
echo "  4) Skip (I'll start my own server)"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        if [ "$HAS_PYTHON" = true ]; then
            echo ""
            echo "🚀 Starting Python HTTP Server on port 8000..."
            echo "📱 Open http://localhost:8000/push-demo.html in your browser"
            echo "Press Ctrl+C to stop the server"
            echo ""
            python3 -m http.server 8000
        else
            echo "❌ Python 3 not found. Please install Python or choose another option."
        fi
        ;;
    2)
        if [ "$HAS_NODE" = true ]; then
            echo ""
            echo "🚀 Starting Node.js HTTP Server on port 8000..."
            echo "📱 Open http://localhost:8000/push-demo.html in your browser"
            echo "Press Ctrl+C to stop the server"
            echo ""
            npx http-server -p 8000
        else
            echo "❌ Node.js (npx) not found. Please install Node.js or choose another option."
        fi
        ;;
    3)
        if [ "$HAS_PHP" = true ]; then
            echo ""
            echo "🚀 Starting PHP built-in server on port 8000..."
            echo "📱 Open http://localhost:8000/push-demo.html in your browser"
            echo "Press Ctrl+C to stop the server"
            echo ""
            php -S localhost:8000
        else
            echo "❌ PHP not found. Please install PHP or choose another option."
        fi
        ;;
    4)
        echo ""
        echo "✅ Setup complete!"
        echo ""
        echo "📚 Next steps:"
        echo "  1. Start your web server"
        echo "  2. Open /push-demo.html in your browser"
        echo "  3. Click 'Enable Push Notifications'"
        echo "  4. Create a journey in Adobe Journey Optimizer"
        echo ""
        echo "📖 See CONFIGURATION.md for detailed setup instructions"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
