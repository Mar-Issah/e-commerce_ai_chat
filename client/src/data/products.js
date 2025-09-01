export const products = [
  {
    item_id: 'CL001',
    item_name: 'Classic Cotton T-Shirt',
    item_description:
      'Premium 100% cotton crew neck t-shirt with a comfortable fit and durable construction. Perfect for everyday wear.',
    brand: 'Nike',
    manufacturer_address: {
      street: '123 Fashion Ave',
      city: 'New York',
      state: 'NY',
      postal_code: '10001',
      country: 'USA',
    },
    prices: {
      full_price: 29.99,
      sale_price: 19.99,
    },
    categories: ['T-Shirts', 'Casual', 'Cotton'],
    user_reviews: [
      {
        review_date: '2024-01-15',
        rating: 4.5,
        comment: 'Great quality fabric, fits perfectly!',
      },
      {
        review_date: '2024-01-20',
        rating: 4.0,
        comment: 'Good value for money, washes well',
      },
    ],
    notes: 'Available in sizes S-XXL, multiple colors',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  },
  {
    item_id: 'CL002',
    item_name: 'Slim Fit Jeans',
    item_description:
      'Modern slim fit jeans with stretch denim for maximum comfort and style. Perfect for casual and semi-formal occasions.',
    brand: "Levi's",
    manufacturer_address: {
      street: '456 Denim St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94102',
      country: 'USA',
    },
    prices: {
      full_price: 89.99,
      sale_price: 69.99,
    },
    categories: ['Jeans', 'Denim', 'Casual'],
    user_reviews: [
      {
        review_date: '2024-01-10',
        rating: 4.8,
        comment: 'Perfect fit and great quality denim!',
      },
      {
        review_date: '2024-01-25',
        rating: 4.2,
        comment: 'Comfortable and stylish, highly recommend',
      },
    ],
    notes: 'Available in sizes 28-36, multiple washes',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
  },
  {
    item_id: 'CL003',
    item_name: 'Wool Sweater',
    item_description:
      'Premium merino wool sweater with a classic crew neck design. Warm, soft, and perfect for cold weather.',
    brand: 'Patagonia',
    manufacturer_address: {
      street: '789 Outdoor Way',
      city: 'Ventura',
      state: 'CA',
      postal_code: '93001',
      country: 'USA',
    },
    prices: {
      full_price: 129.99,
      sale_price: 99.99,
    },
    categories: ['Sweaters', 'Wool', 'Winter'],
    user_reviews: [
      {
        review_date: '2024-01-05',
        rating: 4.9,
        comment: 'Incredibly warm and soft, worth every penny!',
      },
      {
        review_date: '2024-01-18',
        rating: 4.7,
        comment: 'Perfect for winter, great quality wool',
      },
    ],
    notes: 'Available in sizes S-XL, multiple colors',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
  },
  {
    item_id: 'CL004',
    item_name: 'Casual Hoodie',
    item_description:
      'Comfortable cotton blend hoodie with a modern fit. Features a kangaroo pocket and adjustable drawstring hood.',
    brand: 'Adidas',
    manufacturer_address: {
      street: '321 Sport Blvd',
      city: 'Portland',
      state: 'OR',
      postal_code: '97201',
      country: 'USA',
    },
    prices: {
      full_price: 59.99,
      sale_price: 44.99,
    },
    categories: ['Hoodies', 'Casual', 'Athletic'],
    user_reviews: [
      {
        review_date: '2024-01-12',
        rating: 4.3,
        comment: 'Great for workouts and casual wear',
      },
      {
        review_date: '2024-01-22',
        rating: 4.1,
        comment: 'Comfortable and durable, good value',
      },
    ],
    notes: 'Available in sizes S-XXL, multiple colors',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
  },
  {
    item_id: 'CL005',
    item_name: 'Formal Dress Shirt',
    item_description:
      'Professional cotton dress shirt with a classic fit. Perfect for office wear and formal occasions.',
    brand: 'Calvin Klein',
    manufacturer_address: {
      street: '654 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      postal_code: '90001',
      country: 'USA',
    },
    prices: {
      full_price: 79.99,
      sale_price: 59.99,
    },
    categories: ['Dress Shirts', 'Formal', 'Office'],
    user_reviews: [
      {
        review_date: '2024-01-08',
        rating: 4.6,
        comment: 'Perfect fit for office wear, great quality',
      },
      {
        review_date: '2024-01-16',
        rating: 4.4,
        comment: 'Professional look, comfortable fabric',
      },
    ],
    notes: 'Available in sizes S-XXL, multiple colors',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
  },
  {
    item_id: 'CL006',
    item_name: 'Summer Dress',
    item_description:
      'Lightweight floral summer dress with a flattering A-line silhouette. Perfect for warm weather and outdoor events.',
    brand: 'Zara',
    manufacturer_address: {
      street: '987 Fashion St',
      city: 'Miami',
      state: 'FL',
      postal_code: '33101',
      country: 'USA',
    },
    prices: {
      full_price: 89.99,
      sale_price: 69.99,
    },
    categories: ['Dresses', 'Summer', 'Floral'],
    user_reviews: [
      {
        review_date: '2024-01-14',
        rating: 4.7,
        comment: 'Beautiful design, perfect for summer!',
      },
      {
        review_date: '2024-01-28',
        rating: 4.5,
        comment: 'Great fit and comfortable fabric',
      },
    ],
    notes: 'Available in sizes XS-L, multiple patterns',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
  },
];

export const categories = [
  'All',
  'T-Shirts',
  'Jeans',
  'Sweaters',
  'Hoodies',
  'Dress Shirts',
  'Dresses',
  'Casual',
  'Formal',
  'Summer',
  'Winter',
  'Cotton',
  'Denim',
  'Wool',
  'Athletic',
  'Office',
  'Floral',
];
