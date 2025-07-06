#!/bin/bash

# OWC Library Setup Script
# This script sets up the development environment for the OWC Library project

set -e

echo "🚀 Setting up OWC Library development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm 8+ first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build shared package first
echo "🔨 Building shared package..."
cd packages/shared
npm run build
cd ../..

# Build login component
echo "🔨 Building login component..."
cd packages/login-component
npm run build
cd ../..

# Create demo directory if it doesn't exist
mkdir -p demo

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Start development server: npm run dev"
echo "2. Start Storybook: npm run storybook"
echo "3. Open demo page: open demo/index.html"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview and usage"
echo "- Storybook - Component documentation and testing"
echo "- Demo page - Interactive examples"
echo ""
echo "🔧 Development commands:"
echo "- npm run dev - Start development server"
echo "- npm run build - Build all packages"
echo "- npm test - Run tests"
echo "- npm run lint - Run linting"
echo "- npm run format - Format code"
echo ""
echo "🎨 Figma Integration:"
echo "- Install Figma Tokens plugin"
export tokens from Figma
run npm run tokens:transform
echo ""
echo "Happy coding! 🚀" 