# E-Commerce Chat Frontend

![Repo size](https://img.shields.io/github/repo-size/Mar-Issah/langChain_apps)
![Repo License](https://img.shields.io/github/license/Mar-Issah/langChain_apps.svg)
![Latest commit](https://img.shields.io/github/last-commit/Mar-Issah/langChain_apps/master?style=round-square)

A fully functional React.js eCommerce Single Page Application (SPA) with an intelligent chat assistant that helps users find products and provides personalized recommendations.

## 🚀 Features

### Core Functionality

- **Product Catalog**: Browse products with images, prices, ratings, and detailed information
- **Smart Search**: Search products by name, category, or brand
- **Category Filtering**: Filter products by categories (T-Shirts, Jeans, Sweaters, etc.)
- **Responsive Design**: Fully mobile-friendly and responsive layout

### Chat Assistant

- **Intelligent Product Recommendations**: AI-powered chat that understands product queries
- **Real-time Interaction**: Instant responses with product suggestions
- **Minimizable Interface**: Collapsible chat window for better UX
- **Product Integration**: Chat assistant can access and recommend products from the catalog

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1 with Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: CSS3 with modern features
- **Data Management**: Simulated MongoDB API with Axios
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd E-commerce_Chat_FE
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Example Conversations

```
User: "I'm looking for casual wear"
Bot: "I found 3 casual wear options for you!"
[Shows product cards]

User: "What t-shirts do you have?"
Bot: "I found 1 t-shirt options for you!"
[Shows Nike Classic Cotton T-Shirt]

User: "Show me affordable options"
Bot: "I found 4 affordable options under $50!"
[Shows products under $50]
```

## 📱 Responsive Design

The application is fully responsive with breakpoints for:

- **Desktop**: Full layout with sidebar filters
- **Tablet**: Adjusted grid and filter layout
- **Mobile**: Single column layout with optimized spacing

## 🚀 Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
