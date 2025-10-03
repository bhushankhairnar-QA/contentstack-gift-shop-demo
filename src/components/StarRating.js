import React from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ 
  rating = 0, 
  totalReviews = 0, 
  showCount = true, 
  size = "sm",
  className = "" 
}) => {
  // Ensure rating is between 0 and 5
  const normalizedRating = Math.max(0, Math.min(5, Number(rating) || 0));
  
  // Create array of 5 stars
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starNumber = index + 1;
    const isFilled = starNumber <= Math.floor(normalizedRating);
    const isHalfFilled = starNumber === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;
    
    return { isFilled, isHalfFilled, starNumber };
  });

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm", 
    md: "text-base",
    lg: "text-lg"
  };

  const starSizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]} ${className}`}>
      {/* Rating Badge - Flipkart Style */}
      <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
        <span>{normalizedRating.toFixed(1)}</span>
        <FiStar className={`${starSizeClasses.xs} fill-current`} />
      </div>

      {/* Review Count - Flipkart Style */}
      {showCount && totalReviews > 0 && (
        <span className="text-gray-500 text-xs font-medium">
          ({totalReviews.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;
