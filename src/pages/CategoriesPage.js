import React from "react";
import { useNavigate } from "react-router-dom";
import { useContentstack } from "../hooks/useContentstack";
import { useProductsByCategory } from "../hooks/useContentstack";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { getProductImageUrl, getCurrencyFromProduct } from "../utils/helpers";
import { FiHeart } from "react-icons/fi";
import StarRating from "../components/StarRating";

const CategoryCard = ({ category }) => {
  const { products, loading } = useProductsByCategory(category.uid);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  // Navigation handler with scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const categoryIcons = {
    birthday_gifts: "🎂",
    wedding_gifts: "💍",
    holiday_gifts: "🎄",
  };

  const getIcon = (categoryName) => {
    const name = categoryName.toLowerCase().replace(/\s+/g, "_");
    return categoryIcons[name] || "🎁";
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      console.log(`✅ Added "${product.title}" to cart`);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const handleWishlistToggle = (product) => {
    toggleWishlist(product);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-12">
      {/* Category Header */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <div className="text-4xl">{getIcon(category.name)}</div>
        <div>
          <h2 className="text-xl font-semibold">
            {category.title || category.name}
          </h2>
          <p className="text-gray-500 text-sm">{category.description}</p>
          <span className="text-sm text-gray-400">
            {loading ? "Loading..." : products?.length || 0} Products
          </span>
        </div>
      </div>

      {/* Products Showcase */}
      <h3 className="text-lg font-medium mb-4">
        {category.title || category.name}
      </h3>

      {loading ? (
        <div className="flex justify-center py-10">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : products?.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => {
            const imageUrl = getProductImageUrl(product);
            
            // Calculate discounted price if discount_percentage exists
            const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
            const discountedPrice = hasDiscount && product.original_price 
              ? Math.round(product.original_price - (product.original_price * product.discount_percentage / 100))
              : product.price;
            
            // Get currency information from Contentstack product entry
            const currencyInfo = getCurrencyFromProduct(product);
            const currencySymbol = currencyInfo.symbol;
            
            return (
              <div
                key={product.uid}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 group relative overflow-hidden border border-gray-200"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={
                      imageUrl ||
                      "https://via.placeholder.com/300x300/f8f9fa/666666?text=No+Image"
                    }
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x300/f8f9fa/666666?text=No+Image";
                    }}
                  />
                  {/* Wishlist */}
                  <button
                    className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform ${
                      isInWishlist(product.uid)
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                    onClick={() => handleWishlistToggle(product)}
                    aria-label="Toggle Wishlist"
                  >
                    <FiHeart className={`text-lg ${isInWishlist(product.uid) ? 'fill-current' : ''}`} />
                  </button>

                </div>

                {/* Product Info - Flipkart Style */}
                <div className="p-3 space-y-2">
                  {/* Product Title */}
                  <h4 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
                    {product.title}
                  </h4>

                  {/* Rating - Flipkart Style */}
                  {(product.average_rating > 0 || product.total_reviews > 0) && (
                    <div className="flex items-center gap-2">
                      <StarRating 
                        rating={product.average_rating || 0}
                        totalReviews={product.total_reviews || 0}
                        size="sm"
                      />
                    </div>
                  )}

                  {/* Price Section - Flipkart Style */}
                  <div className="mt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Current Price (Discounted) */}
                      <span className="text-lg font-bold text-gray-900">
                        {currencySymbol}{discountedPrice}
                      </span>
                      
                      {/* Original Price & Discount (if discount exists) */}
                      {hasDiscount && product.original_price && (
                        <>
                          <span className="text-xs text-gray-500 line-through">
                            {currencySymbol}{product.original_price}
                          </span>
                          <span className="text-xs text-green-600 font-semibold bg-green-50 px-1 py-0.5 rounded">
                            {product.discount_percentage}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Discount Amount Saved */}
                    {hasDiscount && product.original_price && (
                      <div className="mt-1">
                        <span className="text-xs text-green-600 font-medium">
                          Save {currencySymbol}{product.original_price - discountedPrice}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stock Status - Flipkart Style */}
                  {product.stock_status && (
                    <div className="text-xs mt-1">
                      <span className={`font-semibold ${product.stock_status === 'in_stock' ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock_status === 'in_stock' ? '✓ In Stock' : '✗ Out of Stock'}
                      </span>
                    </div>
                  )}

                  {/* Brand - Flipkart Style */}
                  {product.brand && (
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Brand:</span> {product.brand}
                    </div>
                  )}

                  {/* Delivery Info */}
                  {product.delivery_info && (
                    <div className="text-xs text-green-600 mt-1">
                      {product.delivery_info}
                    </div>
                  )}


                  {/* Action Buttons - Flipkart Style */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleNavigation(`/products/${product.uid}`)}
                      className="flex-1 px-3 py-2 text-center border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      className="flex-1 px-3 py-2 bg-blue-400 text-white rounded text-xs font-medium hover:bg-blue-500 transition-colors"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No products available in this category.</p>
      )}

      {/* View All */}
      {products && products.length > 4 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => handleNavigation("/products")}
            className="inline-block bg-blue-400 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-500 transition cursor-pointer shadow-md"
          >
            View All {category.title || category.name} ({products.length})
          </button>
        </div>
      )}
    </div>
  );
};

const CategoriesPage = () => {
  const { data: categories, loading, error } = useContentstack("categories");
  const navigate = useNavigate();

  // Navigation handler with scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Product Categories</h1>
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Product Categories</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-600">
            Error loading categories
          </h2>
          <p className="text-red-500 mt-2">{error}</p>
          <ul className="list-disc list-inside text-sm text-gray-600 mt-3">
            <li>Check your Contentstack credentials in .env file</li>
            <li>Make sure categories are published in Contentstack</li>
            <li>Verify your API key and delivery token</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Product Categories</h1>
        <p className="text-gray-600 mt-2">
          Explore our curated collection of gifts organized by occasion
        </p>
      </div>

      {/* Categories */}
      {categories && categories.length > 0 ? (
        categories.map((category) => (
          <CategoryCard key={category.uid} category={category} />
        ))
      ) : (
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-medium">No categories found</h3>
          <p className="text-sm mt-2">
            Please set up categories in Contentstack and refresh this page.
          </p>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 bg-blue-50 rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Can’t find what you’re looking for?
        </h2>
        <p className="text-gray-600 mb-6">
          Browse all our products or use our search feature.
        </p>
        <button
          onClick={() => handleNavigation("/products")}
          className="inline-block bg-blue-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500 transition cursor-pointer shadow-md"
        >
          View All Products
        </button>
      </div>
    </div>
  );
};

export default CategoriesPage;
