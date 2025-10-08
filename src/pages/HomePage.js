import React from "react";
import { useNavigate } from "react-router-dom";
import { useContentstack } from "../hooks/useContentstack";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { getProductImageUrl, getImageUrl, getCurrencyFromProduct } from "../utils/helpers";
import { FiHeart } from "react-icons/fi";
import { FiLoader } from "react-icons/fi";
import StarRating from "../components/StarRating";

const HomePage = () => {
  const { data: homepageData, loading, error } = useContentstack("homepage");
  const { data: products } = useContentstack("products");
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


  const getHomepageImageUrl = (homepageData) => {
    if (!homepageData) return "";
    const imageFields = [
      "hero_image",
      "hero_background",
      "background_image",
      "banner_image",
      "main_image",
      "featured_image",
      "cover_image",
      "image",
      "images",
    ];
    for (const field of imageFields) {
      if (homepageData[field]) {
        const imageUrl = getImageUrl(homepageData[field]);
        if (imageUrl) return imageUrl;
      }
    }
    return "";
  };

  // Helper function to get personalized hero title - uses "name" field
  const getHeroTitle = (homepageData) => {
    if (!homepageData) return 'Welcome to Our Gift Shop';
    
    // Use "name" field from Contentstack
    if (homepageData.name && typeof homepageData.name === 'string' && homepageData.name.trim()) {
      return homepageData.name;
    }
    
    return 'Welcome to Our Gift Shop';
  };

  // Helper function to get personalized hero subtitle
  const getHeroSubtitle = (homepageData) => {
    if (!homepageData) return 'Find the perfect gift for every occasion';
    
    // Try different possible subtitle field names
    const subtitleFields = [
      'hero_subtitle', 'subtitle', 'description', 'tagline', 
      'sub_heading', 'banner_subtitle', 'welcome_message',
      'slogan', 'motto', 'catchphrase'
    ];
    
    for (const field of subtitleFields) {
      if (homepageData[field] && typeof homepageData[field] === 'string' && homepageData[field].trim()) {
        return homepageData[field];
      }
    }
    
    return 'Find the perfect gift for every occasion';
  };



  const handleAddToCart = (product) => {
    try {
      addToCart(product);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleWishlistToggle = (product) => {
    toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <FiLoader className="animate-spin text-4xl text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50 text-center">
        <div>
          <h2 className="text-2xl font-semibold text-red-600">
            Error loading homepage
          </h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const heroImage = getHomepageImageUrl(homepageData);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section
        className="relative h-[55vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {heroImage && (
          <div className="absolute inset-0 bg-black/50 "></div>
        )}
        <div className="relative z-10 px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-md">
            {getHeroTitle(homepageData)}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200">
            {getHeroSubtitle(homepageData)}
          </p>
          <button
            onClick={() => handleNavigation("/products")}
            className="inline-block mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-lg transition cursor-pointer"
          >
            Shop Now
          </button>
          
        </div>
      </section>

      {/* Featured Products - Flipkart Style */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Featured Products
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products?.slice(0, 12).map((product) => {
              // Calculate discounted price if discount_percentage exists (same logic as ProductsPage)
              const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
              const discountedPrice = Math.round(product.price - (product.discount_percentage * product.price / 100));
              
              // Get currency information from Contentstack product entry
              const currencyInfo = getCurrencyFromProduct(product);
              const currencySymbol = currencyInfo.symbol;
              
              // Enhanced debug logging for first product
              if (product === products[0]) {
                console.log('🎯 Enhanced Currency Debug for:', product.title);
                console.log('🎯 Full currency info:', currencyInfo);
                console.log('🎯 Currency symbol to display:', currencySymbol);
                console.log('🎯 All product fields:', Object.keys(product));
              }
              
              return (
              <div
                key={product.uid}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 group relative overflow-hidden border border-gray-200"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={
                      getProductImageUrl(product) ||
                      "https://via.placeholder.com/300x300/f8f9fa/666666?text=No+Image"
                    }
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
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
                <div className="p-4 space-y-2">
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
                      <span className="text-xl font-bold text-gray-900">
                        {currencySymbol}{discountedPrice}
                      </span>
                      
                      {/* Original Price & Discount (always show if different from current price) */}
                      {hasDiscount && (
                        <>
                          <span className="text-sm text-gray-500 line-through">
                            {currencySymbol}{product.price}
                          </span>
                          <span className="text-sm text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded">
                            {product.discount_percentage}% off
                          </span>
                        </>
                      )}
                    </div>
                  </div>


                  {/* Product Features - Flipkart Style */}
                  {product.features && (
                    <div className="text-xs text-gray-600 mt-2">
                      <span className="font-medium">Features:</span> {product.features}
                    </div>
                  )}

                  {/* Stock Status - Flipkart Style */}
                  {product.stock_status && (
                    <div className="text-xs mt-1">
                      <span className={`font-semibold ${product.stock_status === 'in_stock' ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock_status === 'in_stock' ? '✓ In Stock' : '✗ Out of Stock'}
                      </span>
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
                      className="flex-1 px-3 py-2 text-center border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      className="flex-1 px-3 py-2 bg-blue-400 text-white rounded text-sm font-medium hover:bg-blue-500 transition-colors"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
            }) || (
              <p className="text-center col-span-full text-gray-500">
                No products available
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
