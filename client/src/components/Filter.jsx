import React from 'react';
import { categories } from '../data/products.js';
import './Filter.css';

const Filter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="filter-container">
      <h3 className="filter-title">Categories</h3>
      <div className="filter-options">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;
