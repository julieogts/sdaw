# Hostinger Deployment Guide - Quick Setup

## Step 1: Upload Files to Hostinger
1. Login to your Hostinger control panel
2. Go to File Manager
3. Navigate to `public_html` folder
4. Upload ALL files from your project (except node_modules)

## Step 2: Install Dependencies
1. In Hostinger File Manager, open Terminal
2. Run: `npm install`

## Step 3: Set Environment Variables
1. Create `.env` file in your project root
2. Copy contents from `env-production.txt`
3. **IMPORTANT**: Change the JWT_SECRET to a secure random string

## Step 4: Start the Server
1. In Terminal, run: `npm start`
2. Your site should be live at your domain

## MongoDB Atlas Setup (Already Done)
✅ Your MongoDB Atlas is already configured
✅ Connection string: `mongodb+srv://24uglyandrew:weaklings162@sanricosite.vgnc0qj.mongodb.net/`
✅ Database: `MyProductsDb`

## Quick Checklist:
- [ ] Upload all files to public_html
- [ ] Run `npm install` in terminal
- [ ] Create `.env` file with production settings
- [ ] Change JWT_SECRET to secure random string
- [ ] Run `npm start`
- [ ] Test your website

## Troubleshooting:
- If port 3000 doesn't work, try port 80 or 8080
- Check Hostinger's Node.js version (should be 16+)
- Make sure all dependencies are installed

