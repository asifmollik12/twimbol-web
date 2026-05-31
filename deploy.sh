#!/bin/bash
# Auto commit, push to GitHub, and deploy to Vercel production
cd "$(dirname "$0")"

echo "📦 Staging changes..."
git add -A

echo "💬 Committing..."
git commit -m "${1:-Auto deploy update}" || { echo "Nothing to commit"; exit 0; }

echo "🚀 Pushing to GitHub..."
git push origin main

echo "🌐 Deploying to Vercel production..."
vercel --prod --yes

echo "✅ Done! Live at https://twimbol.com"
