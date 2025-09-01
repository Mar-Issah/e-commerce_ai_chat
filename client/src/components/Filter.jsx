import React from 'react';
import { categories } from '../data/products.js';
import './Filter.css';

const Filter = ({ selectedCategory, onCategoryChange, products }) => {
  const allCategories = products
  .flatMap((product) => product.categories) // combine all categories into one array
  .filter(Boolean); // remove any undefined/null if present

// Remove duplicates using Set
//const uniqueCategories = ["All",...new Set(allCategories)];


  return (
    <div className='filter-container'>
      <h3 className='filter-title'>Categories</h3>
      <div className='filter-options'>
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
