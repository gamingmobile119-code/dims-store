# Deployment Guide - Public Internet

## Step 1: Deploy Backend to Render

### Prerequisites
- Render account (free at render.com)

### Deploy Backend:

1. **Go to render.com** and sign up
2. **Create new Web Service**:
   - Connect GitHub repository (or paste code)
   - Choose Node environment
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`

3. **Set Environment Variables** in Render dashboard:
   ```
   DB_HOST=<your-postgresql-url>
   DB_PORT=5432
   DB_NAME=dims_store
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-password>
   JWT_SECRET=<generate-random-string>
   PORT=10000
   NODE_ENV=production
   
   MANDIRI_ACCOUNT=1420020873427
   MANDIRI_ACCOUNT_NAME=DIMAS ARU SAMUDRA
   
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your-gmail>
   EMAIL_PASSWORD=<app-password>
   EMAIL_FROM=DIM-S Store <noreply@dims-store.com>
   STORE_NAME=DIM-S Store
   STORE_URL=https://your-frontend-url.vercel.app
   ```

4. **Add PostgreSQL Database**:
   - In Render, create PostgreSQL database
   - Copy connection string to `.env` variables above

5. **Deploy** - Render will build automatically
   - Copy your backend URL (e.g., https://dims-backend.onrender.com)

---

## Step 2: Deploy Frontend to Vercel

### Prerequisites
- Vercel account (free at vercel.com)
- Frontend code ready

### Deploy Frontend:

1. **Go to vercel.com** and sign up with GitHub

2. **Import Project**:
   - Select your GitHub repository
   - Select "frontend" folder as root
   - Vercel auto-detects Next.js

3. **Set Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://dims-backend.onrender.com
   NEXT_PUBLIC_APP_NAME=DIM-S Store
   NEXT_PUBLIC_APP_DESC=toko top up game paling murah se-Indonesia
   ```

4. **Deploy** - Click Deploy button
   - Vercel builds automatically
   - Copy your frontend URL (e.g., https://dims-store.vercel.app)

---

## Step 3: Update Backend URL

1. **Go back to Render dashboard**
2. **Update STORE_URL** environment variable:
   ```
   STORE_URL=https://your-vercel-url.vercel.app
   ```

---

## Step 4: Initialize Database

Once backend is deployed:

1. **Connect to PostgreSQL on Render**:
   ```bash
   psql postgresql://user:password@hostname:5432/dims_store
   ```

2. **Run schema**:
   ```bash
   psql postgresql://user:password@hostname/dims_store -f database/schema.sql
   ```

3. **Run seed data**:
   ```bash
   psql postgresql://user:password@hostname/dims_store -f database/seed.sql
   ```

---

## Step 5: Test on Android

Open your phone browser and go to:
```
https://dims-store.vercel.app
```

Done! 🎉 Your app is now public and accessible from anywhere!

---

## Troubleshooting

### Backend not connecting?
- Check CORS in `/backend/src/server.js`
- Verify all env variables are set
- Check Render logs for errors

### Database errors?
- Ensure PostgreSQL is created in Render
- Run schema and seed scripts
- Check connection string format

### Email not working?
- Use Gmail app-specific password (not regular password)
- Enable 2FA on Gmail
- Check spam folder

### Frontend not loading?
- Clear cache: Ctrl+Shift+Delete
- Check browser console for errors
- Verify API URL in `.env.local`

---

## Alternative: Deploy Everything to One Service

If Render free tier expires, try:
- **Railway**: https://railway.app (easier UI)
- **Heroku**: https://heroku.com (older but reliable)
- **AWS**: https://aws.amazon.com (most powerful)

---

## Useful Links

- Render: https://render.com
- Vercel: https://vercel.com
- PostgreSQL Render: https://render.com/docs/databases
- Node.js Production: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

Need help with any step? Let me know! 🚀
