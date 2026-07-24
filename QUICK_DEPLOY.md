# 🚀 Quick Deploy to Public Internet (5 minutes)

## Prerequisites
- GitHub account (free)
- Vercel account (free)
- Render account (free)

---

## Step 1: Push Code to GitHub

```bash
# Initialize git repo
cd "E:\TopUp project"
git init
git config user.name "Your Name"
git config user.email "your@email.com"

# Add all files
git add .

# Commit
git commit -m "Initial DIM-S Store commit"

# Create repo on github.com first, then:
git remote add origin https://github.com/yourusername/dims-store.git
git push -u origin main
```

> **No git?** Download from: https://git-scm.com

---

## Step 2: Deploy Backend to Render (2 min)

1. Go to **https://render.com** → Sign up → Sign in
2. Click **"New +"** → Select **"Web Service"**
3. **Connect GitHub repo** → Select your `dims-store` repo
4. Fill form:
   - **Name**: `dims-store-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Click **"Advanced"** → Add these env vars:
   ```
   DB_HOST = your-database-url-from-render
   DB_PORT = 5432
   DB_NAME = dims_store
   DB_USER = postgres
   DB_PASSWORD = your-password
   JWT_SECRET = (generate random: openssl rand -base64 32)
   NODE_ENV = production
   PORT = 10000
   MANDIRI_ACCOUNT = 1420020873427
   MANDIRI_ACCOUNT_NAME = DIMAS ARU SAMUDRA
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USER = your-gmail@gmail.com
   EMAIL_PASSWORD = your-app-password
   EMAIL_FROM = DIM-S Store <noreply@dims-store.com>
   STORE_URL = https://dims-store.vercel.app (UPDATE LATER)
   ```
6. **Create PostgreSQL Database** (in Render dashboard):
   - Click **"PostgreSQL"** → Create free instance
   - Copy connection string to `DB_HOST`, etc.
7. **Deploy** → Wait 2-3 minutes
8. **Copy URL** (e.g., `https://dims-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel (1 min)

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"Add New"** → **"Project"**
3. **Import your `dims-store` repo**
4. **Select Frontend** as root directory
5. Add env variables:
   ```
   NEXT_PUBLIC_API_URL = https://dims-backend.onrender.com
   NEXT_PUBLIC_APP_NAME = DIM-S Store
   NEXT_PUBLIC_APP_DESC = toko top up game paling murah se-Indonesia
   ```
6. **Deploy** → Wait 1-2 minutes
7. **Copy URL** (e.g., `https://dims-store.vercel.app`)

---

## Step 4: Update Backend Environment

1. Go back to **Render dashboard**
2. Find your backend service
3. Go to **"Environment"**
4. Update `STORE_URL` = your Vercel URL
5. **Restart** service

---

## Step 5: Initialize Database

Once backend is deployed, SSH into Render PostgreSQL and run:

```bash
# Connect to Render database
psql postgresql://user:password@your-render-db:5432/dims_store

# Run schema
\i database/schema.sql

# Run seed (creates admin user + products)
\i database/seed.sql

# Check if worked
SELECT * FROM users;
```

---

## ✅ Done! 

Open on any device:
```
https://dims-store.vercel.app
```

**Test Account:**
- Email: `admin@dims-store.com`
- Password: `password123`

---

## 🔧 If Something Breaks

### Backend won't start?
- Check Render logs: click service → "Logs"
- Verify all env variables are set
- Run `npm start` locally to test

### Database connection error?
- Verify PostgreSQL is created in Render
- Check connection string format
- Ensure schema.sql was imported

### Frontend can't connect to backend?
- Check browser console (F12)
- Verify `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is running

### Email not working?
- Verify Gmail app-specific password (not regular password)
- Check spam folder
- Enable 2FA on Gmail first

---

## 📱 Access on Android

1. Open Chrome on your phone
2. Go to: `https://dims-store.vercel.app`
3. Login with admin account
4. Done! 🎉

---

## Useful Commands

```bash
# Test API is working
curl https://dims-backend.onrender.com/api/health

# Check logs locally
npm run dev

# Database backup
pg_dump postgresql://user:password@host:5432/db > backup.sql
```

---

## Next Steps

- [ ] Push code to GitHub
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Setup PostgreSQL on Render
- [ ] Initialize database
- [ ] Test on Android
- [ ] Add custom domain (optional)
- [ ] Setup email notifications
- [ ] Monitor analytics

Good luck! 🚀
