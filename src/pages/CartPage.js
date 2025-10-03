import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getProductImageUrl, getCurrencyFromProduct } from '../utils/helpers';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';

const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount,
    totalPrice,
  } = useCart();
  const navigate = useNavigate();

  // Navigation handler with scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleQuantityChange = (uid, newQty) => {
    if (newQty < 1) {
      removeFromCart(uid);
    } else {
      updateQuantity(uid, newQty);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Clear all items from your cart?')) {
      clearCart();
    }
  };


  if (items.length === 0) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <FiShoppingBag className="text-6xl text-gray-400 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Looks like you haven't added anything yet.</p>
        <button
          onClick={() => handleNavigation("/products")}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Continue Shopping
        </button>
      </section>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
          >
            <FiTrash2 className="text-lg" />
            Clear Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
            const imageUrl = getProductImageUrl(item) || 'https://via.placeholder.com/150?text=No+Image';
            
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
                <div className="w-full md:w-36 h-36 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description
                        ? item.description.slice(0, 100) + (item.description.length > 100 ? '...' : '')
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
                  </div>

                  {/* Quantity + Remove */}
                  <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center border rounded overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item.uid, item.quantity - 1)}
                          className="px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus />
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.uid, item.quantity + 1)}
                          className="px-2 py-1 text-gray-700 hover:bg-gray-100"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                     
                      <button
                        onClick={() => removeFromCart(item.uid)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <FiTrash2 />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="border rounded-lg p-6 shadow space-y-4">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          
          {/* Product-wise breakdown */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Product Details:</h3>
            {items.map((item) => {
              const hasDiscount = item.discount_percentage && item.discount_percentage > 0;
              const discountedPrice = hasDiscount 
                ? Math.round(item.price - (item.discount_percentage * item.price / 100))
                : item.price;
              const itemTotal = discountedPrice * item.quantity;
              const currencySymbol = getCurrencyFromProduct(item).symbol;
              
              return (
                <div key={item.uid} className="flex justify-between text-sm text-gray-600 mb-2 py-1">
                  <span className="flex-1">{item.title} x {item.quantity}</span>
                  <span className="font-medium">{currencySymbol}{itemTotal}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 mt-4 flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span>{(() => {
              const currencySymbol = items[0] ? getCurrencyFromProduct(items[0]).symbol : '';
              return currencySymbol + items.reduce((total, item) => {
                const hasDiscount = item.discount_percentage && item.discount_percentage > 0;
                const discountedPrice = hasDiscount 
                  ? Math.round(item.price - (item.discount_percentage * item.price / 100))
                  : item.price;
                return total + (discountedPrice * item.quantity);
              }, 0);
            })()}</span>
          </div>

          <button
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition"
            onClick={() => handleNavigation("/checkout")}
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => handleNavigation("/products")}
            className="block text-center mt-4 text-sm text-blue-600 hover:underline cursor-pointer w-full"
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
