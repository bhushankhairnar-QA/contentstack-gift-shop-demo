import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useContentstack";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { getProductImageUrl, getCurrencyFromProduct } from "../utils/helpers";
import { FiHeart, FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import StarRating from "../components/StarRating";

const ProductDetailPage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(uid);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600 mb-4">Error loading product</p>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-600 mb-4">Product not found</p>
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = getProductImageUrl(product);
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
  const discountedPrice = hasDiscount 
    ? Math.round(product.price - (product.discount_percentage * product.price / 100))
    : product.price;
  const currencyInfo = getCurrencyFromProduct(product);
  const currencySymbol = currencyInfo.symbol;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation*/}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <button
              onClick={handleGoBack}
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Products</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Product Image */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <div className="relative mb-4">
                <img
                  src={imageUrl || "https://via.placeholder.com/500x500/f8f9fa/666666?text=No+Image"}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/500x500/f8f9fa/666666?text=No+Image";
                  }}
                />
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${
                    isInWishlist(product.uid)
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                  aria-label="Toggle Wishlist"
                >
                  <FiHeart className={`text-lg ${isInWishlist(product.uid) ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              {/* Action Buttons*/}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
                  disabled={product.stock_status === 'out_of_stock'}
                >
                  <FiShoppingCart />
                  {product.stock_status === 'out_of_stock' ? 'OUT OF STOCK' : 'Add to Cart'}
                </button>
                
                <button
                  onClick={() => {
                    if (product) {
                      addToCart(product);
                      navigate('/checkout');
                    }
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-semibold transition-colors shadow-md"
                  disabled={product.stock_status === 'out_of_stock'}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details*/}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              
              {/* Product Title */}
              <h1 className="text-xl font-medium text-gray-800 mb-3 leading-tight">
                {product.title}
              </h1>

              {/* Price Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl font-bold text-gray-900">
                    {currencySymbol}{discountedPrice}
                  </span>
                  
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        {currencySymbol}{product.price}
                      </span>
                      <span className="text-sm text-green-600 font-semibold">
                        {product.discount_percentage}% off
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Rating & Reviews - Below Price Section */}
              {(product.average_rating > 0 || product.total_reviews > 0) && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-sm">
                    <span>{product.average_rating || 0}</span>
                    <span>★</span>
                  </div>
                  <span className="text-gray-600 text-sm">
                    ({product.total_reviews || 0}) Reviews
                  </span>
                </div>
              )}
        
              {/* Product Specifications */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 underline">Product Details :-</h3>
                <div className="space-y-3">
                  
                  {product.brand && (
                    <div className="flex py-2 border-b border-gray-100">
                      <span className="w-32 text-sm text-gray-600 font-medium">Brand</span>
                      <span className="text-sm text-gray-900">{product.brand}</span>
                    </div>
                  )}
                  
                  {product.packaging && (
                    <div className="flex py-2 border-b border-gray-100">
                      <span className="w-32 text-sm text-gray-600 font-medium">Packaging</span>
                      <span className="text-sm text-gray-900">{product.packaging}</span>
                    </div>
                  )}
                  
                  {product.dimensions && (
                    <div className="flex py-2 border-b border-gray-100">
                      <span className="w-32 text-sm text-gray-600 font-medium">Dimensions</span>
                      <span className="text-sm text-gray-900">{product.dimensions}</span>
                    </div>
                  )}
                  
                  {product.weight && (
                    <div className="flex py-2 border-b border-gray-100">
                      <span className="w-32 text-sm text-gray-600 font-medium">Weight</span>
                      <span className="text-sm text-gray-900">{product.weight}</span>
                    </div>
                  )}
                  
                  {product.warranty_info && (
                    <div className="flex py-2 border-b border-gray-100">
                      <span className="w-32 text-sm text-gray-600 font-medium">Warranty</span>
                      <span className="text-sm text-gray-900">{product.warranty_info}</span>
                    </div>
                  )}
                  
                  {product.video_url && (
                    <div className="flex py-2 border-b border-gray-100">
                      <span className="w-32 text-sm text-gray-600 font-medium">Product Video</span>
                      <a 
                        href={product.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
                      >
                        Watch Demo
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Description */}
              {product.detailed_description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 underline">Product Description :-</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div 
                      className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.detailed_description }}
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;