import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContentstack } from "../hooks/useContentstack";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import {
  filterProducts,
  sortProducts,
  getProductImageUrl,
  getCurrencyFromProduct,
} from "../utils/helpers";
import { FiHeart, FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import StarRating from "../components/StarRating";
import { type } from "@testing-library/user-event/dist/type";
import personalizeSdk from "../services/personalize";

const ProductsPage = () => {
  const { data: products, loading, error } = useContentstack("products");
  const { data: categories } = useContentstack("categories");
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation handler with scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("name");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Load filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQ = params.get("search");
    const catQ = params.get("category");
    if (searchQ) setQuery(searchQ);
    if (catQ) setCategory(catQ);
  }, [location.search]);

  // Filter + sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    if (query.trim()) {
      result = filterProducts(result, query.trim());
    }

    if (category) {
      result = result.filter((product) => {
        const prodCats = Array.isArray(product.category)
          ? product.category
          : product.category
          ? [product.category]
          : [];
        return prodCats.some((cat) =>
          [cat.uid, cat.title?.toLowerCase(), cat.name?.toLowerCase()].includes(
            category.toLowerCase()
          )
        );
      });
    }

    return sortProducts(result, sortOrder);
  }, [products, query, category, sortOrder]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleWishlistToggle = (product) => {
    toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl font-semibold text-red-600">
          Error loading products
        </p>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filter Bar */}
      <div className="sticky  px-10 top-0 bg-white z-30 border-b shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4">
          {/* Search */}
          <div className="relative w-full lg:w-1/3 ">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 shadow-sm text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 px-10 ">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setCategoryOpen(!categoryOpen);
                  setSortOpen(false);
                }}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 border rounded-md px-3 py-2"
              >
                {category
                  ? categories?.find((c) => c.uid === category)?.name ||
                    "Category"
                  : "Category"}
                {categoryOpen ? (
                  <FiChevronUp className="w-4 h-4" />
                ) : (
                  <FiChevronDown className="w-4 h-4" />
                )}
              </button>
              {categoryOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-40">
                  <ul className="py-2 text-sm max-h-60 overflow-auto">
                    <li>
                      <button
                        onClick={() => {
                          setCategory("");
                          setCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-indigo-50 ${
                          category === "" ? "font-semibold text-indigo-600" : ""
                        }`}
                      >
                        All Categories
                      </button>
                    </li>
                    {categories?.map((c) => (
                      <li key={c.uid}>
                        <button
                          onClick={async () => {
                            setCategory(c.uid);
                            setCategoryOpen(false);
                            
                            // Call personalize SDK when Birthday Gifts is selected
                            const categoryName = c.name || c.title;
                            if (categoryName === "Birthday Gifts") {
                              await personalizeSdk.set({
                                "category": "Birthday Gifts"
                              });
                              
                              // Log active experiences
                              const experiences = personalizeSdk.getExperiences();
                              console.log("Active Experiences:", experiences);
                            }
                            if (categoryName === "Wedding Gifts") {
                              await personalizeSdk.set({
                                "category": "Wedding Gifts"
                              });
                              
                              // Log active experiences
                              const experiences = personalizeSdk.getExperiences();
                              console.log("Active Experiences:", experiences);
                            }if (categoryName === "Holiday Gifts") {
                              await personalizeSdk.set({
                                "category": "Holiday Gifts"
                              });
                              
                              // Log active experiences
                              const experiences = personalizeSdk.getExperiences();
                              console.log("Active Experiences:", experiences);
                            }
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-indigo-50 ${
                            category === c.uid
                              ? "font-semibold text-indigo-600"
                              : ""
                          }`}
                        >
                          {c.name || c.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSortOpen(!sortOpen);
                  setCategoryOpen(false);
                }}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 border rounded-md px-3 py-2"
              >
                {sortOrder === "All" && "All "}
                {sortOrder === "price-low" && "Price: Low → High"}
                {sortOrder === "price-high" && "Price: High → Low"}
                {sortOrder === "newest" && "Newest First"}
                {sortOpen ? (
                  <FiChevronUp className="w-4 h-4" />
                ) : (
                  <FiChevronDown className="w-4 h-4" />
                )}
              </button>
              {sortOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-40">
                  <ul className="py-2 text-sm">
                    {[
                      { key: "All", label: "All " },
                      { key: "price-low", label: "Price: Low → High" },
                      { key: "price-high", label: "Price: High → Low" },
                      { key: "newest", label: "Newest First" },
                    ].map((opt) => (
                      <li key={opt.key}>
                        <button
                          onClick={() => {
                            setSortOrder(opt.key);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-indigo-50 ${
                            sortOrder === opt.key
                              ? "font-semibold text-indigo-600"
                              : ""
                          }`}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {(query || category) && (
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("");
                }}
                className="text-sm text-indigo-600 hover:underline"
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="pb-3 text-sm text-gray-600">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"} found
        </div>
      </div>

      {/* Products Grid */}
      {/* Products Grid */}
{filteredProducts.length === 0 ? (
  <div className="text-center py-20">
    <p className="text-2xl text-gray-500">No products found.</p>
    <button
      onClick={() => handleNavigation("/products")}
      className="mt-4 inline-block text-indigo-600 hover:underline cursor-pointer"
    >
      View All Products-
    </button>
  </div>
) : (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    {filteredProducts.map((product) => {
      const imageUrl = getProductImageUrl(product);
      
      // Calculate discounted price if discount_percentage exists
      const hasDiscount = product.discount_percentage && product.discount_percentage > 0;

      const discountedPrice = Math.round(product.price - (product.discount_percentage * product.price / 100))

      // Get currency information from Contentstack product entry
      const currencyInfo = getCurrencyFromProduct(product);
      const currencySymbol = currencyInfo.symbol;

      return (
        <div
          key={product.uid}
          className="bg-white rounded-2xl shadow hover:shadow-xl transition group relative overflow-hidden"
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

            

            {/* Seller Info */}
            {product.seller && (
              <div className="text-xs text-gray-500 mt-1">
                <span className="font-medium">Sold by:</span> {product.seller}
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
    })}
  </div>
)}

    </div>
  );
};

export default ProductsPage;