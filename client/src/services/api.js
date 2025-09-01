
// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const apiUrl = import.meta.env.VITE_SERVER_URL;

// Simulate MongoDB collection operations
export const api = {
  // Get all products (simulates MongoDB find operation)
  async getAllProducts() {
     const response = await fetch(`${apiUrl}/items`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  },

  // Search products by name or category
  async searchProducts(query, products) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    const filteredProducts = products.filter(
      (product) =>
        product.item_name.toLowerCase().includes(searchTerm) ||
        product.categories.some((category) => category.toLowerCase().includes(searchTerm)) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
    return { success: true, data: filteredProducts };
  },

  // Filter products by category
  async filterByCategory(category, products) {
    if (category === 'All') {
      return products
    }
    const filteredProducts = products.filter((product) => product.categories.includes(category));
    return { success: true, data: filteredProducts };
  },

};

// Chat API for product-related queries
export const chatApi = {
  async processMessage(message, products) {
    await delay(500); // Simulate AI processing time

    const lowerMessage = message.toLowerCase();

    // Product search responses
    if (lowerMessage.includes('t-shirt') || lowerMessage.includes('tshirt')) {
      const tshirts = products.filter((p) => p.categories.includes('T-Shirts'));
      return {
        type: 'product_suggestion',
        message: `I found ${tshirts.length} t-shirt options for you!`,
        products: tshirts,
      };
    }

    if (lowerMessage.includes('jean')) {
      const jeans = products.filter((p) => p.categories.includes('Jeans'));
      return {
        type: 'product_suggestion',
        message: `I found ${jeans.length} jeans options for you!`,
        products: jeans,
      };
    }

    if (lowerMessage.includes('sweater') || lowerMessage.includes('wool')) {
      const sweaters = products.filter((p) => p.categories.includes('Sweaters'));
      return {
        type: 'product_suggestion',
        message: `I found ${sweaters.length} sweater options for you!`,
        products: sweaters,
      };
    }

    if (lowerMessage.includes('hoodie')) {
      const hoodies = products.filter((p) => p.categories.includes('Hoodies'));
      return {
        type: 'product_suggestion',
        message: `I found ${hoodies.length} hoodie options for you!`,
        products: hoodies,
      };
    }

    if (lowerMessage.includes('dress')) {
      const dresses = products.filter((p) => p.categories.includes('Dresses'));
      return {
        type: 'product_suggestion',
        message: `I found ${dresses.length} dress options for you!`,
        products: dresses,
      };
    }

    if (lowerMessage.includes('formal') || lowerMessage.includes('office')) {
      const formal = products.filter((p) => p.categories.includes('Formal') || p.categories.includes('Office'));
      return {
        type: 'product_suggestion',
        message: `I found ${formal.length} formal/office wear options for you!`,
        products: formal,
      };
    }

    if (lowerMessage.includes('casual')) {
      const casual = products.filter((p) => p.categories.includes('Casual'));
      return {
        type: 'product_suggestion',
        message: `I found ${casual.length} casual wear options for you!`,
        products: casual,
      };
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      const affordable = products.filter((p) => p.prices.sale_price <= 50);
      return {
        type: 'product_suggestion',
        message: `I found ${affordable.length} affordable options under $50!`,
        products: affordable,
      };
    }

    if (
      lowerMessage.includes('brand') ||
      lowerMessage.includes('nike') ||
      lowerMessage.includes('adidas') ||
      lowerMessage.includes('levi')
    ) {
      const brands = [...new Set(products.map((p) => p.brand))];
      return {
        type: 'text',
        message: `We carry brands like ${brands.join(', ')}. What specific brand are you looking for?`,
      };
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return {
        type: 'text',
        message: `I can help you find products by category (t-shirts, jeans, sweaters, etc.), brand, price range, or answer questions about our inventory. Just ask me what you're looking for!`,
      };
    }

    // Default response
    return {
      type: 'text',
      message: `I'm here to help you find the perfect clothing! You can ask me about specific items like t-shirts, jeans, sweaters, or ask about brands, prices, or categories. What are you looking for today?`,
    };
  },
};
