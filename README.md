# 💬 QuickChat – Real‑Time 1:1 Chat App

QuickChat is a **real-time one-to-one chat application** built with **React, Node.js, Express, MongoDB, and Socket.IO**.  
It includes **Google OAuth login**, **seen/unseen message indicators**, user profiles, and a clean responsive UI.

---

## ✨ Features
- 🔐 **Login / Signup with Google (OAuth2)**
- 💬 **Real-time 1:1 chat** via Socket.IO
- 👀 **Seen / Unseen indicators** for messages
- 🟢 **Online / Offline presence**
- 🧑‍💻 **Profile editing** (name, bio, avatar)
- ⚡ **Monorepo dev** using `concurrently`
- 🚀 **Deploy-ready** for Render (backend) & Vercel (frontend)

---

## 🖼️ Screenshots

### Chat List & Empty State
![Chat List](./screenshots/chat-list.png)

### Edit Profile
![Edit Profile](./screenshots/edit-profile.png)

### Real-time Conversation
![Chat Window](./screenshots/chat-window.png)

### Signup / Login (Google OAuth)
![Login](./screenshots/login.png)

> Place these images in `./screenshots/` (already included).

---

## 🧱 Tech Stack
**Frontend:** React, Tailwind CSS, Redux Toolkit, React Router  
**Backend:** Node.js, Express, Mongoose (MongoDB)  
**Realtime:** Socket.IO  
**Auth:** JWT + Google OAuth2  
**Hosting:** Vercel (frontend) & Render (backend)

---

## 📦 Project Structure
```
ChatApp/
│── server/              # Express + MongoDB + Socket.IO
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env.example
│
│── client/             # React + Redux + Tailwind
│   ├── src/
│   ├── public/
│   └── .env.example
│
│── package.json          # root (concurrently)
│── README.md
│── .gitignore
└── screenshots/          # images for README
```

---

## ⚙️ Local Setup

### 1) Clone
```bash
git clone https://github.com/rituranjankumar/ChattApp.git
cd ChattApp
```

### 2) Install
If your root uses `concurrently` with per-app installs:
```bash
npm install --prefix server
npm install --prefix client
```
_or_ inside each folder:
```bash
cd servver && npm install
cd ../client && npm install
```

### 3) Environment Variables
Create `.env` files from the provided `.env.example` in **server** and **client**.

**server/.env**
```
PORT=7000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:7000/auth/google/callback
```

**client/.env**
```
REACT_APP_BACKEND_URL=http://localhost:7000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

> Never commit real `.env` files. Keep `.env.example` in repo and add `.env` to `.gitignore`.

### 4) Run in Dev
Using root scripts (recommended):
```bash
# package.json (root)
# "dev": "concurrently \"npm:dev:server\" \"npm:dev:client\"",
# "dev:server": "npm run dev --prefix server",
# "dev:client": "npm start --prefix client"

npm run dev
```

Or run separately:
```bash
cd server && npm run dev
cd ../client && npm start
```

 

## 🚀 Deployment

### Backend → Render
- **Root:** `backend/`
- **Build Command:** `npm install`
- **Start Command:** `npm start` (or `node server.js`)
- **Env Vars:** `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

Render sets `PORT` automatically; read it via `process.env.PORT`.

### client → Vercel
- **Root:** `frontend/`
- **Build Command:** `npm run build`
- **Output Dir:** `build`
- **Env Vars:** `REACT_APP_BACKEND_URL`, `REACT_APP_GOOGLE_CLIENT_ID`

Update frontend API base URL to your Render backend, e.g.  
`REACT_APP_BACKEND_URL=https://your-backend.onrender.com`

---

## 🧹 .gitignore (recommended)
```
# dependencies
node_modules
frontend/node_modules
backend/node_modules

# env
.env
frontend/.env
backend/.env

# builds
frontend/build
backend/dist
```

---

## 🤝 Contributing
1. Fork the repo
2. Create a branch: `git checkout -b feature/awesome`
3. Commit: `git commit -m "feat: add awesome thing"`
4. Push: `git push origin feature/awesome`
5. Open a PR 🎉

---

## 📜 License
MIT
