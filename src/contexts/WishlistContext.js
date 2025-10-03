import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Wishlist Context
const WishlistContext = createContext();

// Wishlist Actions
const WISHLIST_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST',
  LOAD_WISHLIST: 'LOAD_WISHLIST'
};

// Wishlist Reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.LOAD_WISHLIST:
      return {
        ...state,
        items: action.payload
      };

    case WISHLIST_ACTIONS.ADD_ITEM:
      // Check if item already exists
      const existingItem = state.items.find(item => item.uid === action.payload.uid);
      
      if (existingItem) {
        // Item already in wishlist, don't add duplicate
        return state;
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, dateAdded: new Date().toISOString() }]
      };

    case WISHLIST_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.uid !== action.payload)
      };

    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

// Initial Wishlist State
const initialState = {
  items: [],
  isLoading: false
};

// Wishlist Provider Component
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('giftShopWishlist');
    if (savedWishlist) {
      try {
        const wishlistData = JSON.parse(savedWishlist);
        dispatch({ type: WISHLIST_ACTIONS.LOAD_WISHLIST, payload: wishlistData });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save wishlist to localStorage whenever items change (but not during initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('giftShopWishlist', JSON.stringify(state.items));
    }
  }, [state.items, isInitialized]);

  // Wishlist Actions
  const addToWishlist = (product) => {
    dispatch({ type: WISHLIST_ACTIONS.ADD_ITEM, payload: product });
    return true;
  };

  const removeFromWishlist = (productUid) => {
    dispatch({ type: WISHLIST_ACTIONS.REMOVE_ITEM, payload: productUid });
  };

  const clearWishlist = () => {
    dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
  };

  const isInWishlist = (productUid) => {
    return state.items.some(item => item.uid === productUid);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.uid)) {
      removeFromWishlist(product.uid);
      return false; // Removed from wishlist
    } else {
      addToWishlist(product);
      return true; // Added to wishlist
    }
  };

  // Computed values
  const itemCount = state.items.length;
  const isEmpty = itemCount === 0;

  const value = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    toggleWishlist,
    itemCount,
    isEmpty
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use Wishlist Context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

