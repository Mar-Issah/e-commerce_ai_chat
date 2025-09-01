# E-Commerce Chat Application

![Repo size](https://img.shields.io/github/repo-size/Mar-Issah/e-commerce_ai_chat)
![Repo License](https://img.shields.io/github/license/Mar-Issah/e-commerce_ai_chat.svg)
![Latest commit](https://img.shields.io/github/last-commit/Mar-Issah/e-commerce_ai_chat/master?style=round-square)

A **full-stack eCommerce application** featuring a React SPA frontend and a Node.js/TypeScript backend. Includes an **AI-powered chat assistant** for personalized product recommendations and multi-step customer interaction.

---

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── seed/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
```

---

## 🚀 Features

### Backend (Node.js + TypeScript)

- Modular architecture with **clean separation of concerns**
- **MongoDB Integration** for persistent storage of threads and messages
- RESTful API endpoints for:

  - Chat interactions
  - Thread management
  - Product search

- AI Agent ready (placeholder for LangGraph integration)
- Hot reload for development using `nodemon`
- Full type safety with TypeScript

### Frontend (React SPA)

- **Product Catalog**: Browse products with images, prices, ratings
- **Search & Filters**: Smart search and category filters (T-Shirts, Jeans, Sweaters, etc.)
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **AI Chat Assistant**:

  - Collapsible window
  - Real-time responses
  - Product integration for recommendations

- Modern UI with reusable components

---

## 📋 Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB (local or Atlas)

---

## 🛠️ Installation

### Backend

```bash
cd backend
npm install
cp env.example .env
# Edit .env for MongoDB URI and port
npm run build   # compile TypeScript
npm run dev     # start dev server
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
```

---

## 📡 API Endpoints

### Chat

- `POST /api/chat` - Start a new conversation
- `POST /api/chat/:threadId` - Continue a conversation
- `GET /api/chat/:threadId` - Retrieve conversation history

---

## 🔧 Development

- Backend: `npm run dev` (hot reload)
- Frontend: `npm run dev` (Vite server)
- Build for production: `npm run build`

**Adding features:**

1. Backend: Add models in `src/models/`, services in `src/services/`, routes in `src/routes/`
2. Frontend: Add new components or pages in `src/components/` and `src/pages/`

---

## 🌐 Deployment

1. Build both backend and frontend
2. Deploy backend (Node/Express) and frontend (`dist` folder) on your hosting service

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

---

## 📄 License

MIT License
