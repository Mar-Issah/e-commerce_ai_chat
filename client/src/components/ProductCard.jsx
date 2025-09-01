import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const averageRating =
    product.user_reviews.length > 0
      ? product.user_reviews.reduce((sum, review) => sum + review.rating, 0) / product.user_reviews.length
      : 0;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill='#fbbf24' color='#fbbf24' />);
    }

    if (hasHalfStar) {
      stars.push(<Star key='half' size={16} fill='#fbbf24' color='#fbbf24' style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color='#d1d5db' />);
    }

    return stars;
  };

  return (
    <div className='product-card'>
      <div className='product-image-container'>
        <img
          src={product.image}
          alt={product.item_name}
          className='product-image'
        />
        <div className='product-overlay'>
          <button className='add-to-cart-btn'>
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>

      <div className='product-info'>
        <h3 className='product-name'>{product.item_name}</h3>
        <p className='product-brand'>{product.brand}</p>

        <div className='product-rating'>
          <div className='stars'>{renderStars(averageRating)}</div>
          <span className='rating-text'>
            {averageRating.toFixed(1)} ({product.user_reviews.length} reviews)
          </span>
        </div>

        <div className='product-price'>
          <span className='sale-price'>${product.prices.sale_price}</span>
          {product.prices.sale_price < product.prices.full_price && (
            <span className='original-price'>${product.prices.full_price}</span>
          )}
        </div>

        <div className='product-categories'>
          {product.categories.slice(0, 3).map((category, index) => (
            <span key={index} className='category-tag'>
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
