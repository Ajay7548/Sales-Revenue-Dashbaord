# 🚀 Deployment Guide

This guide will help you deploy your **Sales Revenue Dashboard** to the web.

Since you are using **React (Vite)**, **Node.js (Express)**, and **PostgreSQL (Neon)**, here is the recommended free/low-cost stack:

- **Database:** Neon (You already have this!)
- **Backend:** Render (Free tier available for Node.js services)
- **Frontend:** Vercel (Best for React/Vite apps)

---

## 1. Database Setup (Neon) 🗄️

You are already using Neon! Ensure your `DATABASE_URL` is ready.

1. Go to your [Neon Dashboard](https://console.neon.tech/).
2. Copy your connection string (Pooled connection is recommended).
   - It looks like: `postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require`

---

## 2. Backend Deployment (Render) ⚙️

We will deploy the `backend` folder to Render.

### Steps:

1. **Push your code to GitHub**: Make sure your project is in a GitHub repository.
2. **Sign up/Login to [Render](https://render.com/)**.
3. Click **"New +"** -> **"Web Service"**.
4. Connect your GitHub repository.
5. **Configure the Service**:
   - **Name**: `sales-dashboard-backend` (or similar)
   - **Root Directory**: `backend` (Important! This tells Render where your server code is)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. **Environment Variables**:
   - Scroll down to "Environment Variables" and click "Add Environment Variable".
   - Key: `DATABASE_URL`
   - Value: `your_neon_connection_string_here`
   - Key: `PORT`
   - Value: `10000` (Render creates a port automatically, but good to set just in case)
7. Click **"Create Web Service"**.

Render will now build and deploy your backend. Once done, it will give you a URL (e.g., `https://sales-dashboard-backend.onrender.com`). **Copy this URL.**

---

## 3. Frontend Deployment (Vercel) 🎨

We will deploy the `frontend` folder to Vercel.

### Steps:

1. **Sign up/Login to [Vercel](https://vercel.com/)**.
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository.
4. **Configure Project**:
   - **Framework Preset**: Vite (should be detected automatically).
   - **Root Directory**: Click "Edit" and select `frontend`.
5. **Environment Variables**:
   - Expand "Environment Variables".
   - You need to tell your frontend where the backend is.
   - Note: In your frontend code (`analyticsApi.js` or similar), make sure you are using an environment variable for the base URL.
   - Key: `VITE_API_URL` (or whatever variable name you use in your React code)
   - Value: `https://sales-dashboard-backend.onrender.com` (The Render URL from Step 2).
6. Click **"Deploy"**.

Vercel will build and deploy your frontend. It will give you a live domain (e.g., `https://sales-dashboard-frontend.vercel.app`).

---

## 4. Final Connection Check 🔗

1. Open your Vercel URL.
2. Try to upload a file or view charts.
3. If it fails, check the **Network Tab** in browser developer tools (F12).
   - Ensure requests are going to `https://sales-dashboard-backend.onrender.com/...` and not `localhost`.
4. **CORS API Error?**:
   - If you get a CORS error, you might need to update your Backend `server.js` to allow the Vercel domain.
   - In `backend/server.js`:
     ```javascript
     const cors = require("cors");
     app.use(
       cors({
         origin: [
           "https://your-vercel-frontend.vercel.app",
           "http://localhost:5173",
         ],
       }),
     );
     ```

## 🚀 Requirement Recap

- [x] **Database**: Active on Neon.
- [x] **Backend**: Running on Render (handles API & Uploads).
- [x] **Frontend**: Serving UI from Vercel.

Enjoy your live Sales Revenue Dashboard!
