# MoodTunes Deployment Guide

## Quick Deploy Setup

### Option 1: Vercel (Frontend) + Railway (Backend) [RECOMMENDED]

#### Step 1: Prepare for Deployment

1. **Create GitHub Repository** (if not already done)

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Update API URL for Production**
   - Frontend will need to point to your deployed backend URL

#### Step 2: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your moodtunes repository
5. Choose the `backend` folder as root
6. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://dor:foo123@cluster0.g8ryhay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=5bc451e20ec358e295ec369e3588cc11dcbeabb0e5d3259a4c052e548b164cee
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   BCRYPT_ROUNDS=12
   SPOTIFY_CLIENT_ID=843ee24361934198b12fc5cafbbd8854
   SPOTIFY_CLIENT_SECRET=d788d425fd6d48f4933c46cb8fdad16d
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=*
   ```
7. Railway will provide a URL like `https://your-app.railway.app`

#### Step 3: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project" → Import your repository
4. Set **Root Directory** to `/` (main folder)
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api
   ```
6. Deploy!

#### Step 4: Update CORS Settings

Update your backend to allow your Vercel domain in CORS settings.

### Option 2: Render (All-in-One)

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Create **Web Service** for backend:
   - Repository: your-repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add all environment variables
4. Create **Static Site** for frontend:
   - Repository: your-repo
   - Root Directory: `/`
   - Build Command: `npm run build`
   - Publish Directory: `build`
   - Add environment variable pointing to backend URL

### Option 3: Netlify + Railway

1. **Backend on Railway** (same as Option 1)
2. **Frontend on Netlify**:
   - Go to [Netlify.com](https://netlify.com)
   - Drag & drop your `build` folder OR connect GitHub
   - Add environment variables

## Pre-Deployment Checklist

### Frontend Changes Needed:

1. **Build the React app**:

   ```bash
   cd /path/to/moodtunes
   npm run build
   ```

2. **Update API URL**:

   - Create `.env.production` file in frontend root
   - Add: `REACT_APP_API_URL=https://your-backend-url.com/api`

3. **Test production build locally**:
   ```bash
   npm run build
   npx serve -s build
   ```

### Backend Changes Needed:

1. **Add Railway/Render configuration** (if using Railway):

   - Create `railway.toml` or use Render's auto-detection

2. **Update CORS for production**:

   - Allow your frontend domain
   - Set proper environment variables

3. **Ensure all dependencies are in package.json**

## Environment Variables Needed

### Backend:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `JWT_REFRESH_EXPIRE`
- `BCRYPT_ROUNDS`
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `NODE_ENV=production`
- `PORT=5000`
- `CORS_ORIGIN` (your frontend URL)

### Frontend:

- `REACT_APP_API_URL` (your backend URL + /api)

## Portfolio Presentation Tips

1. **Custom Domain** (optional but professional):

   - Use Vercel/Netlify custom domain features
   - Or use a free domain from Freenom

2. **Demo Account**:

   - Create a demo user account
   - Add sample data for demonstrations

3. **Features to Highlight**:

   - User authentication
   - Real-time mood-based music recommendations
   - Responsive design
   - Modern tech stack (React, Node.js, MongoDB)

4. **GitHub README**:
   - Add live demo links
   - Screenshots/GIFs of the app
   - Tech stack badges
   - Installation instructions

## Expected URLs:

- **Frontend**: `https://moodtunes.vercel.app`
- **Backend**: `https://moodtunes-backend.railway.app`
- **API**: `https://moodtunes-backend.railway.app/api`

## Troubleshooting:

- Check environment variables are set correctly
- Verify API endpoints are accessible
- Check CORS settings
- Monitor deployment logs
