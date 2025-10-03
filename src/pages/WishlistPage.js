import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { getProductImageUrl, getCurrencyFromProduct } from '../utils/helpers';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';

const WishlistPage = () => {
  const {
    items,
    removeFromWishlist,
    clearWishlist,
    itemCount,
    isEmpty,
  } = useWishlist();

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Navigation handler with scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleRemoveItem = (uid) => {
    removeFromWishlist(uid);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Clear all items from your wishlist?')) {
      clearWishlist();
    }
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      console.log(`✅ "${product.title}" added to cart from wishlist`);
      // Use a toast instead of alert in production
    } catch (err) {
      console.error('❌ Add to cart failed:', err);
    }
  };

  if (isEmpty) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <FiHeart className="text-6xl text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Your wishlist is empty</h1>
        <p className="text-gray-600 mb-6">Save items you love by clicking the heart icon on any product.</p>
        <button
          onClick={() => handleNavigation("/products")}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Browse Products
        </button>
      </section>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          <button
            onClick={handleClearWishlist}
            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
          >
            <FiTrash2 className="text-lg" />
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((item) => {
          const imageUrl =
            getProductImageUrl(item) ||
            'https://via.placeholder.com/200?text=No+Image';

          // Calculate discounted price if discount_percentage exists
          const hasDiscount = item.discount_percentage && item.discount_percentage > 0;
          const discountedPrice = hasDiscount 
            ? Math.round(item.price - (item.discount_percentage * item.price / 100))
            : item.price;

          // Get currency information from Contentstack product entry
          const currencyInfo = getCurrencyFromProduct(item);
          const currencySymbol = currencyInfo.symbol;

          return (
            <div
              key={item.uid}
              className="flex flex-col md:flex-row gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              {/* Image */}
              <div className="w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={imageUrl}
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description
                      ? item.description.slice(0, 100) +
                        (item.description.length > 100 ? '...' : '')
                      : 'Beautiful gift for special occasions'}
                  </p>
                  
                  {/* Price Section - Flipkart Style */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-lg font-semibold text-gray-900">
                      {currencySymbol}{discountedPrice}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          {currencySymbol}{item.price}
                        </span>
                        <span className="text-sm text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
                          {item.discount_percentage}% off
                        </span>
                      </>
                    )}
                  </div>
                  
                  {item.dateAdded && (
                    <p className="text-xs text-gray-400 mt-1">
                      Added on {new Date(item.dateAdded).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-2 justify-center sm:justify-start px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    <FiShoppingCart />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.uid)}
                    className="flex items-center gap-2 justify-center sm:justify-start text-red-600 hover:text-red-800 px-4 py-2 border border-red-600 rounded hover:bg-red-50 transition"
                  >
                    <FiTrash2 />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Actions */}
      <div className="mt-10 text-center">
        <button
          onClick={() => handleNavigation("/products")}
          className="inline-block text-blue-600 hover:underline text-lg cursor-pointer"
        >
          ← Continue Browsing Products
        </button>
      </div>
    </div>
  );
};

export default WishlistPage;
