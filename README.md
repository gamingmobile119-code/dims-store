# DIM-S Store 🎮

Toko top up game paling murah se-Indonesia

## Features

- ✅ User Authentication (Register/Login)
- ✅ Product Management (Admin CRUD)
- ✅ Order Management
- ✅ Mandiri QR Code Payment
- ✅ DIM-S Cash Wallet
- ✅ Email Notifications
- ✅ Sales Analytics Dashboard
- ✅ Admin Panel

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL Database
- JWT Authentication
- NodeMailer (Email)
- QRCode Generation

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts (Analytics)
- Zustand (State Management)

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Gmail account for email setup

### Backend Setup

1. **Navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create PostgreSQL database**
   ```bash
   createdb dims_store
   ```

4. **Initialize database schema**
   ```bash
   psql -U postgres -d dims_store -f ../database/schema.sql
   ```

5. **Seed initial data**
   ```bash
   psql -U postgres -d dims_store -f ../database/seed.sql
   ```

6. **Configure environment** (`.env.local`)
   - DB credentials
   - JWT_SECRET
   - Email configuration (Gmail SMTP)
   - Mandiri account details (already set)

7. **Start backend**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (`.env.local`)
   - NEXT_PUBLIC_API_URL (already configured)

4. **Start frontend**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## Default Admin Credentials

- **Email**: admin@dims-store.com
- **Password**: password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:gameName` - Get products by game
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:productId` - Update product (Admin)
- `DELETE /api/products/:productId` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:orderId` - Get order details

### Payments
- `POST /api/payments/mandiri-qr` - Generate Mandiri QR
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/status/:orderId` - Check payment status

### Admin
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:orderId` - Update order status
- `GET /api/admin/stats` - Get statistics

### Analytics
- `GET /api/analytics/overview` - Analytics overview
- `GET /api/analytics/daily-sales` - Daily sales
- `GET /api/analytics/sales-by-game` - Sales by game
- `GET /api/analytics/order-status` - Order status distribution
- `GET /api/analytics/payment-methods` - Payment methods
- `GET /api/analytics/top-products` - Top products

## Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.local
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store/
│   │   ├── lib/
│   │   └── styles/
│   ├── .env.local
│   └── package.json
│
└── database/
    ├── schema.sql
    └── seed.sql
```

## Database Schema

8 Tables:
- `users` - User accounts
- `products` - Game products
- `orders` - Customer orders
- `order_items` - Order line items
- `payments` - Payment records
- `wallets` - User wallets
- `wallet_transactions` - Wallet activity

## Email Setup

1. Enable 2FA on your Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env.local`:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

## Features Status

- [x] Authentication
- [x] Product CRUD
- [x] Order Management
- [x] Payment (Mandiri QR)
- [x] Wallet System
- [x] Email Notifications
- [x] Analytics Dashboard
- [x] Admin Panel
- [ ] User Settings
- [ ] Payment History
- [ ] Customer Support Chat

## License

MIT

## Support

For support, contact: support@dims-store.com

---

**DIM-S Store** - Toko top up game paling murah se-Indonesia 🇮🇩
