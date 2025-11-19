# Quick Setup Guide

This guide will help you get the blog application running locally in just a few minutes.

## Prerequisites

Make sure you have these installed:
- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

Check your versions:
```bash
node --version
npm --version
```

## Step-by-Step Setup

### 1. Install Dependencies

Open two terminal windows (one for backend, one for frontend).

**Terminal 1 - Backend:**
```bash
cd server
npm install
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
```

This will download all required packages. It may take 1-2 minutes.

### 2. Verify Environment Variables

The `.env` files are already configured with working credentials:

- `server/.env` - Backend configuration
- `client/.env` - Frontend configuration

**You don't need to change anything!** The database is already set up and ready to use.

### 3. Start the Servers

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```

You should see:
```
Server is running on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

You should see something like:
```
  VITE v7.2.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### 4. Open the Application

Open your browser and go to:
```
http://localhost:5173
```

You should see the blog homepage!

## First Steps in the App

### Create Your Account

1. Click **"Register"** in the top navigation
2. Fill in:
   - Username (3+ characters)
   - Email (valid email format)
   - Password (6+ characters)
3. Click **"Register"**

You'll be automatically logged in and redirected to the home page.

### Create Your First Blog Post

1. Click **"Create Post"** in the navigation
2. Fill in:
   - **Title**: 5-120 characters (e.g., "My First Blog Post")
   - **Image URL**: Optional (e.g., `https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg`)
   - **Content**: Minimum 50 characters (write at least a paragraph)
3. Click **"Create Post"**

### Explore the Application

- **Home**: Browse all posts with search and pagination
- **My Posts**: View, edit, and delete your posts
- **Post Detail**: Click any post to read the full content

## Common Issues & Solutions

### Port Already in Use

**Problem**: "Port 5000 is already in use"

**Solution**:
```bash
# Option 1: Kill the process using the port (Mac/Linux)
lsof -ti:5000 | xargs kill -9

# Option 2: Use a different port
# Edit server/.env and change PORT=5000 to PORT=5001
```

### Cannot Connect to Backend

**Problem**: Frontend shows network errors

**Solution**:
1. Make sure backend is running (`npm start` in server folder)
2. Check that backend shows "Server is running on http://localhost:5000"
3. Verify `client/.env` has `VITE_API_URL=http://localhost:5000/api`

### Module Not Found Error

**Problem**: "Cannot find module 'express'" or similar

**Solution**:
```bash
# Re-install dependencies
cd server
rm -rf node_modules package-lock.json
npm install

# Or for frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error

**Problem**: "Failed to fetch posts" or authentication errors

**Solution**:
The Supabase database is already configured. If you still see errors:
1. Check that `server/.env` has the correct Supabase credentials
2. Make sure you have an internet connection (Supabase is cloud-hosted)

## Development Tips

### Auto-Reload Backend

For automatic server restart on file changes:
```bash
cd server
npm run dev
```

### View Backend Logs

The backend terminal shows all API requests and errors. Keep an eye on it while testing.

### Clear Browser Storage

If you need to log out completely:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Delete `token` and `user` entries

## Testing Your Setup

Here's a quick checklist to verify everything works:

- [ ] Backend server starts without errors
- [ ] Frontend opens in browser
- [ ] Can register a new user
- [ ] Can log in with credentials
- [ ] Can create a blog post
- [ ] Can see posts on home page
- [ ] Can search for posts
- [ ] Can edit own posts
- [ ] Can delete own posts

## Need More Help?

- Check the main `README.md` for detailed API documentation
- Look at the browser console (F12) for frontend errors
- Check the terminal running the backend for server errors

## Production Deployment

For deploying to production, see the "Production Build" section in `README.md`.

---

**That's it! You're ready to start blogging.**

If you followed all steps and everything worked, congratulations! You now have a fully functional full-stack blog application running locally.
