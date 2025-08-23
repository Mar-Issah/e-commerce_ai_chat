# E-commerce Chat Backend

A modular Node.js TypeScript backend for an AI-driven e-commerce chat assistant that can handle customer queries and take autonomous, multi-step actions in real time.

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files (database, environment)
├── controllers/     # HTTP request handlers
├── middleware/      # Express middleware
├── models/          # Data models and schemas
├── routes/          # API route definitions
├── services/        # Business logic and external service integrations
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## 🚀 Features

- **Modular Architecture**: Clean separation of concerns
- **TypeScript**: Full type safety and modern JavaScript features
- **MongoDB Integration**: Persistent storage for conversations and threads
- **RESTful API**: Well-structured endpoints for chat functionality
- **AI Agent Ready**: Placeholder for LangGraph agent integration
- **Environment Configuration**: Flexible configuration management
- **Development Tools**: Hot reload with nodemon and TypeScript compilation

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mar-Issah/e-commerce_chat_be.git
   cd e-commerce_chat_be
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce_chat
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Chat Endpoints

- `POST /api/chat` - Start new conversation
- `POST /api/chat/:threadId` - Continue existing conversation
- `GET /api/chat/:threadId` - Get conversation history

### Thread Management

- `GET /api/threads` - Get all threads
- `PATCH /api/threads/:threadId/close` - Close thread

### Search

- `GET /api/search?query=text&threadId=123` - Search messages

## 🗄️ Database Schema

### Message Collection

```typescript
interface IMessage {
  threadId: string;
  message: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

### Thread Collection

```typescript
interface IThread {
  threadId: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  status: 'active' | 'closed' | 'archived';
  metadata?: Record<string, any>;
}
```

## 🔧 Configuration

### TypeScript Configuration

The project uses a comprehensive `tsconfig.json` with:

- ES2022 target
- Strict type checking
- Path mapping for clean imports
- Source maps for debugging

### Nodemon Configuration

Hot reload configuration in `nodemon.json` for development.

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run build:watch` - Watch mode for TypeScript compilation
- `npm run clean` - Clean build directory
- `npm start` - Start production server

### Adding New Features

1. **Models**: Add new schemas in `src/models/`
2. **Services**: Add business logic in `src/services/`
3. **Controllers**: Add HTTP handlers in `src/controllers/`
4. **Routes**: Add new endpoints in `src/routes/`

## 🤖 AI Agent Integration

The project includes a placeholder `AgentService` in `src/services/AgentService.ts`. To integrate your LangGraph agent:

1. Replace the placeholder `callAgent` method
2. Add your AI framework dependencies
3. Implement conversation context handling
4. Add your API keys to `.env`

## 📝 Environment Variables

| Variable      | Description               | Default     |
| ------------- | ------------------------- | ----------- |
| `PORT`        | Server port               | 5000        |
| `MONGODB_URI` | MongoDB connection string | -           |
| `NODE_ENV`    | Environment mode          | development |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue on GitHub.
