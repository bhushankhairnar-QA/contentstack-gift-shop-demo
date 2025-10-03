import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
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

    default:
      return state;
  }
};

// Initial Cart State
const initialState = {
  items: [],
  isLoading: false
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
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
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
    itemCount,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
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


