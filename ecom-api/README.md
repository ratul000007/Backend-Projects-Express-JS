# 🛍️ E-commerce API

A simple RESTful API for a basic e-commerce backend built with Node.js, Express, and MongoDB. Supports user registration/login, product browsing, cart management, and order checkout.

---

## 🚀 Features

- ✅ User authentication with JWT
- 🛒 Product CRUD operations (admin-only)
- 🧺 Cart management (add/remove items)
- 📦 Order creation from cart
- 🔐 Protected routes for authenticated users
- 🌐 CORS-enabled for frontend integration

---

## 🧱 Project Structure

ecommerce-api/
│
├── controllers/ # Route handlers
├── models/ # Mongoose schemas
├── routes/ # Express routers
├── middleware/ # Auth middleware
├── config/ # DB connection logic
├── .env # Environment variables (not committed)
├── server.js # Entry point
└── package.json # Project metadata

---

## 🔧 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- dotenv
- CORS

---

## 📦 Installation & Setup

```bash
git clone https://github.com/your-username/ecommerce-api.git
cd ecommerce-api
npm install
🧪 Setup .env file
Create a .env file in the root directory:


PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
▶️ Running the Server

npm run dev
Or


node server.js
Server will start at: http://localhost:5000

🧪 API Endpoints
Auth
POST /api/auth/register

POST /api/auth/login

Products
GET /api/products

GET /api/products/:id

POST /api/products (admin)

PUT /api/products/:id (admin)

DELETE /api/products/:id (admin)

Cart
GET /api/cart

POST /api/cart/add

POST /api/cart/remove

Orders
POST /api/orders

GET /api/orders (user's orders)

🔐 Auth Middleware
Protect routes using JWT tokens in the Authorization header:


Authorization: Bearer <your_token>
🌐 Frontend Integration
You can connect this API with any frontend — like React or Vanilla JS — by calling the endpoints with fetch() or axios.

Example base URL for frontend:


const API_BASE = "https://api.yourdomain.com/api"; // In production
📁 Deployment Notes
Use .env to store all secrets

Make sure .env is listed in .gitignore

Deploy backend to Render, Railway, or Vercel (for frontend)

Connect to cloud MongoDB via MongoDB Atlas

👨‍💻 Author
Ratul
Backend Developer
🌐 Portfolio: [add your link here]
📧 Email: ratul.xc23@gmail.com