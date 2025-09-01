import React, { useState } from 'react';
import { Search, User, ShoppingCart, Bell } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <h1>StyleHub</h1>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Right side icons */}
        <div className="navbar-icons">
          <button className="icon-button" title="User Account">
            <User size={24} />
          </button>
          <button className="icon-button" title="Shopping Cart">
            <ShoppingCart size={24} />
          </button>
          <button className="icon-button" title="Notifications">
            <Bell size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
