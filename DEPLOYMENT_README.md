# Alibtikar Website - Deployment Guide

## Quick Overview

This is a full-stack web application built with:
- **Frontend:** React 19 + Tailwind CSS 4 + Vite
- **Backend:** Express.js + tRPC
- **Database:** MySQL/PostgreSQL
- **Authentication:** Admin session-based

## Deployment Options

### Option 1: Render.com (Recommended for Free Tier)

**Pros:**
- Free tier available (with limitations)
- Easy GitHub integration
- PostgreSQL database included
- Good documentation

**Cons:**
- Free tier has 15-minute inactivity timeout
- Limited storage (256MB)
- Slower cold starts

**Cost:** Free (with limitations) → $7/month for Starter

**Steps:**
1. See `RENDER_DEPLOYMENT.md` for detailed instructions
2. Push code to GitHub
3. Connect to Render
4. Set environment variables
5. Deploy

### Option 2: Railway.app

**Pros:**
- $5/month starter plan
- Generous free credits ($5/month)
- Good performance
- Easy deployment

**Cons:**
- Paid after free credits
- Less generous than Render free tier

**Cost:** Free credits ($5/month) → $5-50/month

**Quick start:**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Option 3: Keep Manus Hosting (Recommended)

**Pros:**
- Already deployed and working
- Free custom domain support
- No cold starts
- Better performance
- Included database
- No additional setup needed

**Cons:**
- Locked to Manus platform
- Less control over infrastructure

**Cost:** Included in your Manus subscription

## Deployment Checklist

Before deploying anywhere:

- [ ] All environment variables configured
- [ ] Database migrations run (`pnpm db:push`)
- [ ] Build succeeds locally (`pnpm build`)
- [ ] Admin login works
- [ ] No hardcoded secrets in code
- [ ] `.env` files not committed to Git
- [ ] `node_modules` in `.gitignore`

## Environment Variables Required

```
NODE_ENV=production
DATABASE_URL=your-database-connection-string
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_ANALYTICS_ENDPOINT=your-endpoint
VITE_ANALYTICS_WEBSITE_ID=your-website-id
VITE_APP_TITLE=Alibtikar Agriculture Co.
VITE_APP_LOGO=https://your-cdn-url/logo.png
```

## Build & Start Commands

**Build:**
```bash
pnpm install
pnpm build
```

**Start:**
```bash
node dist/index.js
```

**Port:** The app listens on `process.env.PORT` (default: 3000)

## Database Setup

1. Create a PostgreSQL or MySQL database
2. Set `DATABASE_URL` environment variable
3. Run migrations:
   ```bash
   pnpm db:push
   ```

## Admin Login

**Default credentials:**
- Username: `Admin`
- Password: `@7654321`

⚠️ **Change these credentials in production!**

## Post-Deployment

1. Test admin login at `/admin-login`
2. Verify website loads at your domain
3. Check that all pages render correctly
4. Test contact form (if implemented)
5. Monitor logs for errors

## Troubleshooting

### Build fails
- Check Node version (should be 18+)
- Ensure all dependencies are listed in `package.json`
- Run `pnpm install` locally first

### Database connection error
- Verify `DATABASE_URL` format
- Check database is running and accessible
- Ensure firewall allows connections

### Admin login not working
- Check cookies are enabled
- Verify environment variables are set
- Check server logs for errors

### Performance issues
- Upgrade from free tier to paid
- Optimize database queries
- Enable caching headers
- Use CDN for static assets

## File Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── lib/           # Utilities (tRPC client)
│   └── public/            # Static files
├── server/                # Express backend
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database queries
│   └── _core/             # Core infrastructure
├── drizzle/               # Database schema & migrations
├── dist/                  # Built output
├── package.json
└── vite.config.ts
```

## Important Notes

### Security
- Never commit `.env` files
- Use strong JWT_SECRET (minimum 32 characters)
- Change default admin credentials
- Enable HTTPS (automatic on most platforms)

### Performance
- Database is the bottleneck - optimize queries
- Use caching for frequently accessed data
- Implement pagination for large lists
- Consider CDN for images

### Scaling
- Start on free tier
- Monitor usage and upgrade as needed
- Consider database read replicas for high traffic
- Implement rate limiting for APIs

## Support

- **Render:** https://render.com/docs
- **Railway:** https://docs.railway.app
- **Manus:** https://help.manus.im

## Next Steps

1. Choose your deployment platform
2. Follow the platform-specific guide
3. Test thoroughly before going live
4. Monitor logs and performance
5. Plan for scaling as needed

---

**Recommendation:** Unless you have specific requirements, keep using Manus hosting. It's already working perfectly with your custom domain and requires no additional setup.
