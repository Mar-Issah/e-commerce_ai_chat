import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import Navbar from '../components/Navbar.jsx';
import Filter from '../components/Filter.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ChatAssistant from '../components/ChatAssistant.jsx';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      filterProductsByCategory(selectedCategory);
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getAllProducts();
      if (response) {
        //console.log(response)
        setProducts(response);
        setFilteredProducts(response);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // When the user clicks on the category
  const filterProductsByCategory = async (category, productsToSearch = products) => {
    try {
      const response = await api.filterByCategory(category, productsToSearch);
      if (response.success) {
        setFilteredProducts(response.data);
      }
    } catch (err) {
      console.error('Error filtering products:', err);
    }
  };
  // When the user enters the query
  const handleSearch = async (query, productsToSearch = products) => {
    try {
      const response = await api.searchProducts(query, productsToSearch);
      if (response.success) {
        setFilteredProducts(response.data);
        setSelectedCategory('All'); // Reset category filter when searching
      }
    } catch (err) {
      console.error('Error searching products:', err);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-container'>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchProducts} className='retry-btn'>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='home'>
      <Navbar onSearch={handleSearch} />

      <main className='main-content'>
        <div className='content-wrapper'>
          {/* Sidebar with filters */}
          <aside className='sidebar'>
            <Filter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} products={products} />
          </aside>

          {/* Main product grid */}
          <section className='products-section'>
            <div className='products-header'>
              <h2>
                {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} (${filteredProducts.length})`}
              </h2>
              <p>{filteredProducts.length} products found</p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className='no-products'>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className='products-grid'>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.item_id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Chat Assistant */}
      <ChatAssistant products={products} />
    </div>
  );
};

export default Home;
