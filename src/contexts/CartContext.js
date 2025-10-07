import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SHOW_TOAST: 'SHOW_TOAST',
  HIDE_TOAST: 'HIDE_TOAST'
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload
      };

    case CART_ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.uid === action.payload.uid);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.uid === action.payload.uid
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.uid !== action.payload)
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.uid !== action.payload.uid)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.uid === action.payload.uid
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };

    case CART_ACTIONS.SHOW_TOAST:
      return {
        ...state,
        toast: {
          show: true,
          message: action.payload.message,
          productName: action.payload.productName
        }
      };

    case CART_ACTIONS.HIDE_TOAST:
      return {
        ...state,
        toast: {
          show: false,
          message: '',
          productName: ''
        }
      };

    default:
      return state;
  }
};

// Initial Cart State
const initialState = {
  items: [],
  isLoading: false,
  toast: {
    show: false,
    message: '',
    productName: ''
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('giftShopCart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever items change (but not during initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('giftShopCart', JSON.stringify(state.items));
    }
  }, [state.items, isInitialized]);

  // Cart Actions
  const addToCart = (product) => {
    const existingItem = state.items.find(item => item.uid === product.uid);
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
    
    // Show toast notification with appropriate message
    const message = existingItem 
      ? 'Quantity updated in your cart' 
      : 'Product added to your cart';
    
    dispatch({ 
      type: CART_ACTIONS.SHOW_TOAST, 
      payload: { 
        message: message,
        productName: product.title || 'Product'
      } 
    });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      dispatch({ type: CART_ACTIONS.HIDE_TOAST });
    }, 3000);
  };

  const removeFromCart = (productUid) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productUid });
  };

  const updateQuantity = (productUid, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { uid: productUid, quantity } 
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const hideToast = () => {
    dispatch({ type: CART_ACTIONS.HIDE_TOAST });
  };

  // Computed values
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce((total, item) => {
    // Calculate discounted price if discount_percentage exists (same logic as HomePage/ProductsPage)
    const hasDiscount = item.discount_percentage && item.discount_percentage > 0;
    const discountedPrice = hasDiscount 
      ? Math.round(item.price - (item.discount_percentage * item.price / 100))
      : item.price;
    return total + (discountedPrice * item.quantity);
  }, 0);

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    hideToast,
    itemCount,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      
      {/* Toast Notification */}
      {state.toast.show && (
        <div 
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp"
          style={{
            animation: 'slideUp 0.3s ease-out'
          }}
        >
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[320px] max-w-md">
            {/* Success Icon */}
            <div className="flex-shrink-0">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            
            {/* Message */}
            <div className="flex-1">
              <p className="font-semibold text-sm">{state.toast.message}</p>
              <p className="text-xs text-green-100 mt-0.5">"{state.toast.productName}"</p>
            </div>
            
            {/* Close Button */}
            <button
              onClick={hideToast}
              className="flex-shrink-0 text-white hover:text-green-200 transition-colors"
              aria-label="Close notification"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Toast Animation Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </CartContext.Provider>
  );
};

// Custom hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};


