const apiUrl = import.meta.env.VITE_SERVER_URL;

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
    let response = {};
    try {
      const url = threadId ? `${apiUrl}/chat/${threadId}` : `${apiUrl}/chat`;
      response = await fetch(url, {
        method: 'POST', // Specify the method as POST
        headers: {
          'Content-Type': 'application/json', // Indicate that the body is JSON
        },
        body: JSON.stringify({ message }), // Convert the data object to a JSON string
      });

      const result = await response.json(); // Parse the response body as JSON
      return result;
    } catch (error) {
      console.error('Error during fetch:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  },
};
