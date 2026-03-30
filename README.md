# mine CRM - Restaurant Lead Management System
**Track:** Full Stack Web Development (FS)  
**Task:** 02 
**Repository:** FUTURE_FS_02
# 📌 Project Overview
A full-stack CRM application for restaurants to manage leads and customer events.
# 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
# ✨ Features
- User Signup & Login with JWT Authentication
- Add, View, Update and Delete Leads
- Filter leads by Status (New / Contacted / Converted)
- Add notes to leads
- Dashboard with lead statistics
# 📁 Project Structure
```
dine-crm-main/
├── dine-crm-backend/     # Node.js + Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── index.js          # Server entry point
└── dine-crm-main/        # React frontend
    └── src/
        ├── pages/        # Login, Signup, Dashboard
        ├── components/   # UI components
        └── lib/          # API helper
```
# 🚀 How to Run
# Backend
```bash
cd dine-crm-backend
npm install
node index.js
```
# Frontend
```bash
cd dine-crm-main
npm install
npm run dev
```
# 🔑 Environment Variables (Backend)
Create a `.env` file in `dine-crm-backend/`:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=365d
```
# API Endpoints
# Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
# Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `PATCH /api/leads/:id/status` - Update lead status
- `POST /api/leads/:id/notes` - Add note to lead
- `DELETE /api/leads/:id` - Delete lead
# Features
- JWT authentication
- MongoDB with Mongoose ODM
- RESTful API design
- CORS enabled
- Protected routes for authenticated users
