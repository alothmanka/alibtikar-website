# Deployment Guide: Render.com

This guide explains how to deploy the Alibtikar website to Render.com (free tier available).

## Prerequisites

1. **GitHub Account** - Required to connect your repository
2. **Render Account** - Sign up at https://render.com (free tier available)
3. **Database** - Render provides free PostgreSQL databases

## Step 1: Prepare Your GitHub Repository

1. Create a new GitHub repository or use an existing one
2. Push your project code to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/alibtikar-website.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Create a Render Account & Connect GitHub

1. Go to https://render.com and sign up (free)
2. Click "New +" → "Web Service"
3. Select "Connect a repository" and authorize GitHub
4. Select your `alibtikar-website` repository

## Step 3: Configure the Web Service

**Basic Settings:**
- **Name:** `alibtikar-website`
- **Environment:** `Node`
- **Build Command:** `pnpm install && pnpm build`
- **Start Command:** `node dist/index.js`
- **Plan:** `Free` (or Starter for better performance)

## Step 4: Set Environment Variables

In Render dashboard, add these environment variables:

```
DATABASE_URL=postgresql://user:password@your-db-host/database_name
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
VITE_APP_TITLE=Alibtikar Agriculture Co.
VITE_APP_LOGO=https://your-cdn-url/logo.png
NODE_ENV=production
```

## Step 5: Create a PostgreSQL Database

1. In Render dashboard, click "New +" → "PostgreSQL"
2. Choose **Free** plan
3. Set database name: `alibtikar_db`
4. Copy the connection string and add it to `DATABASE_URL` above

## Step 6: Deploy

1. Click "Create Web Service"
2. Render will automatically deploy when you push to GitHub
3. Your site will be available at: `https://your-service-name.onrender.com`

## Step 7: Connect Custom Domain (Optional)

1. In Render dashboard, go to your Web Service
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `ibtikar-agri.sa`)
4. Update DNS records as instructed by Render

## Important Notes

### Database Migrations
After deployment, run migrations:
```bash
# Via Render shell
pnpm db:push
```

### Free Tier Limitations
- Web service spins down after 15 minutes of inactivity (cold start ~30 seconds)
- PostgreSQL free tier has limited storage (256MB)
- For production, upgrade to Starter plan ($7/month)

### Troubleshooting

**Deployment fails:**
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

**Database connection errors:**
- Verify `DATABASE_URL` format
- Check PostgreSQL database is running
- Ensure firewall allows connections

**Port issues:**
- Render automatically assigns a port via `process.env.PORT`
- Your app should listen on this port (already configured)

## Cost Comparison

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| **Render** | Yes (limited) | $7/month | Good for small projects |
| **Railway** | No | $5/month | Generous free credits |
| **Vercel** | Yes | $20/month | Frontend only (not suitable) |
| **Manus** | Included | N/A | Already hosting your site |

## Recommended: Stay on Manus

Your website is already deployed on Manus hosting with:
- ✅ Free custom domain support
- ✅ Automatic SSL
- ✅ Database included
- ✅ No cold starts
- ✅ Better performance

Only migrate if you have specific requirements.

## Support

For Render support: https://render.com/docs
For your app issues: Check server logs in Render dashboard
