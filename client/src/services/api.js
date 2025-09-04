const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

// Simulate MongoDB collection operations
export const api = {
  // Get all products (simulates MongoDB find operation)
  async getAllProducts() {
    const response = await fetch(`${apiUrl}/items`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  },

  // Search products by name or category
  async searchProducts(query, products) {
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
      return products;
    }
    const filteredProducts = products.filter((product) => product.categories.includes(category));
    return { success: true, data: filteredProducts };
  },
};

// Chat API for product-related queries
export const chatApi = {
  async processMessage(message, threadId = null) {
    try {
      const url = threadId ? `${apiUrl}/chat/${threadId}` : `${apiUrl}/chat`;

      if (import.meta.env.DEV) {
        console.log('📤 Sending message to:', url);
        console.log('📤 Message:', message);
        console.log('📤 Thread ID:', threadId);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (import.meta.env.DEV) {
        console.log('📥 Response received:', result);
      }

      return result;
    } catch (error) {
      console.error('❌ Chat API Error:', error);

      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }

      throw error;
    }
  },
};
