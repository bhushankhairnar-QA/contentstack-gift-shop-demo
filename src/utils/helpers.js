// Format currency values
export const formatPrice = (price) => {
  if (typeof price !== 'number') {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Format product URL slug
export const createSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};

// Truncate text to specified length
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Extract clean category name from category object
export const getCategoryDisplayName = (category) => {
  if (!category) return '';
  
  // Prefer title over name, and clean up any description text
  const displayName = category.title || category.name || '';
  
  // If the display name contains description patterns, extract just the name part
  // Common patterns: "Category Name - Description" or "Category Name: Description"
  const cleanName = displayName.split(/[-:]\s/)[0].trim();
  
  return cleanName || displayName;
};

// Get image URL from Contentstack asset
export const getImageUrl = (asset, width = null, height = null) => {
  console.log('=== getImageUrl Debug ===');
  console.log('Asset received:', asset);
  console.log('Asset type:', typeof asset);
  console.log('Asset keys:', asset && typeof asset === 'object' ? Object.keys(asset) : 'N/A');
  
  // Handle different Contentstack image data structures
  if (!asset) {
    console.log('❌ No asset provided');
    return '';
  }
  
  // If it's an array, get the first item
  if (Array.isArray(asset) && asset.length > 0) {
    console.log('📦 Processing array asset, taking first item');
    asset = asset[0];
    console.log('First item:', asset);
  }
  
  // If it has url property directly
  if (asset && asset.url) {
    console.log('✅ Found direct URL:', asset.url);
    let url = asset.url;
    const params = [];
    
    if (width) params.push(`width=${width}`);
    if (height) params.push(`height=${height}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    console.log('🌐 Final URL:', url);
    return url;
  }
  
  // If it's nested in a different structure
  if (asset && asset.file && asset.file.url) {
    console.log('✅ Found nested file URL:', asset.file.url);
    return asset.file.url;
  }
  
  // Check for other common Contentstack structures
  if (asset && asset.href) {
    console.log('✅ Found href URL:', asset.href);
    return asset.href;
  }
  
  if (asset && asset.src) {
    console.log('✅ Found src URL:', asset.src);
    return asset.src;
  }
  
  // If it's a simple URL string
  if (typeof asset === 'string') {
    if (asset.startsWith('http') || asset.startsWith('//') || asset.startsWith('/')) {
      console.log('✅ Found string URL:', asset);
      return asset;
    }
  }
  
  // Debug log for unknown structures
  console.warn('❌ Unknown image asset structure:', asset);
  if (asset && typeof asset === 'object') {
    console.log('Asset properties:', Object.keys(asset));
    console.log('Full asset object:', JSON.stringify(asset, null, 2));
  }
  return '';
};

// Enhanced function specifically for product images
export const getProductImageUrl = (product) => {
  console.log('=== getProductImageUrl Debug ===');
  console.log('Product:', product.title, product.uid);
  console.log('Product structure:', JSON.stringify(product, null, 2));
  
  // Try different possible image field structures
  const imageFields = ['images', 'image', 'featured_image', 'main_image', 'product_image', 'thumbnail'];
  
  for (const field of imageFields) {
    if (product[field]) {
      console.log(`Found ${field} field:`, product[field]);
      
      let imageData = product[field];
      
      // Handle array of images
      if (Array.isArray(imageData) && imageData.length > 0) {
        console.log(`Processing array of ${imageData.length} images from ${field}`);
        for (let i = 0; i < imageData.length; i++) {
          const imageUrl = getImageUrl(imageData[i]);
          console.log(`Image ${i} URL:`, imageUrl);
          if (imageUrl) return imageUrl;
        }
      } else {
        // Handle single image
        console.log(`Processing single image from ${field}`);
        const imageUrl = getImageUrl(imageData);
        console.log(`Single image URL:`, imageUrl);
        if (imageUrl) return imageUrl;
      }
    }
  }
  
  // Enhanced debugging for missing images
  console.warn(`❌ No images found for product "${product.title}" (${product.uid})`);
  console.log('All product fields:', Object.keys(product));
  console.log('Image-related fields:', Object.keys(product).filter(key => 
    key.toLowerCase().includes('image') || 
    key.toLowerCase().includes('img') || 
    key.toLowerCase().includes('photo') ||
    key.toLowerCase().includes('picture') ||
    key.toLowerCase().includes('pic')
  ));
  
  return '';
};

// Debounce function for search input
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Filter products by search term
export const filterProducts = (products, searchTerm) => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  
  const filtered = products.filter(product => {
    const titleMatch = product.title?.toLowerCase().includes(term);
    const descriptionMatch = product.description?.toLowerCase().includes(term);
    const categoryMatch = product.category?.name?.toLowerCase().includes(term);
    
    return titleMatch || descriptionMatch || categoryMatch;
  });
  
  console.log(`Search "${term}": ${filtered.length}/${products.length} products found`);
  return filtered;
};

// Sort products by different criteria
export const sortProducts = (products, sortBy = 'name') => {
  if (!products || products.length === 0) return [];
  
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'name':
      return sortedProducts.sort((a, b) => 
        (a.title || '').localeCompare(b.title || '')
      );
    case 'price-low':
      return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price-high':
      return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'newest':
      return sortedProducts.sort((a, b) => 
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    default:
      return sortedProducts;
  }
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Enhanced currency detection for Contentstack product entries
export const getCurrencyFromProduct = (product) => {
  if (!product) {
    console.warn('⚠️ No product provided for currency detection');
    return { symbol: '', code: '', name: '' };
  }

  // Debug logging for currency detection
  console.log('🔍 Currency Detection for:', product.title);
  console.log('📊 Product UID:', product.uid);
  console.log('💰 Raw currency field:', product.currency);

  // Try different possible currency field structures from Contentstack
  const currencyFields = [
    // Reference field with nested properties
    () => product.currency?.symbol,
    () => product.currency?.code,
    () => product.currency?.name,
    () => product.currency?.currency_symbol,
    () => product.currency?.currency_code,
    () => product.currency?.currency_name,
    
    // Direct fields
    () => product.currency_symbol,
    () => product.currency_code,
    () => product.currency_name,
    () => product.price_currency,
    
    // If currency is a string (could be symbol or code)
    () => product.currency,
    
    // Alternative field names
    () => product.currency_info?.symbol,
    () => product.currency_info?.code,
    () => product.pricing?.currency,
    () => product.pricing?.currency_symbol,
    () => product.pricing?.currency_code,
    
    // Global settings or default currency
    () => product.default_currency,
    () => product.locale_currency,
    () => product.region_currency
  ];

  let detectedSymbol = '';
  let detectedCode = '';
  let detectedName = '';

  // Try each field in order
  for (const getField of currencyFields) {
    const value = getField();
    if (value && typeof value === 'string' && value.trim()) {
      const trimmedValue = value.trim();
      
      // If it's a 3-letter currency code, try to get symbol
      if (trimmedValue.length === 3 && /^[A-Z]{3}$/i.test(trimmedValue)) {
        detectedCode = trimmedValue.toUpperCase();
        detectedSymbol = getCurrencySymbolFromCode(trimmedValue);
        console.log(`✅ Found currency code: ${detectedCode} → ${detectedSymbol}`);
        break;
      }
      // If it looks like a currency symbol
      else if (trimmedValue.length <= 3 && /[^\w\s]/.test(trimmedValue)) {
        detectedSymbol = trimmedValue;
        console.log(`✅ Found currency symbol: ${detectedSymbol}`);
        break;
      }
      // If it's a currency name or other text
      else if (trimmedValue.length > 3) {
        detectedName = trimmedValue;
        detectedSymbol = getCurrencySymbolFromName(trimmedValue);
        console.log(`✅ Found currency name: ${detectedName} → ${detectedSymbol}`);
        break;
      }
    }
  }

  // If we found a symbol but no code, try to reverse lookup
  if (detectedSymbol && !detectedCode) {
    detectedCode = getCurrencyCodeFromSymbol(detectedSymbol);
  }

  const result = {
    symbol: detectedSymbol,
    code: detectedCode,
    name: detectedName
  };

  console.log('🎯 Final currency result:', result);
  
  if (!detectedSymbol && !detectedCode && !detectedName) {
    console.warn('⚠️ No currency found for product:', {
      title: product.title,
      uid: product.uid,
      availableFields: Object.keys(product).filter(key => 
        key.toLowerCase().includes('currency') || 
        key.toLowerCase().includes('price')
      )
    });
  }

  return result;
};

// Map currency codes to symbols
const getCurrencySymbolFromCode = (currencyCode) => {
  const currencyMap = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'INR': '₹',
    'CAD': 'C$', 'AUD': 'A$', 'CHF': 'CHF', 'CNY': '¥', 'SEK': 'kr',
    'NOK': 'kr', 'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč', 'HUF': 'Ft',
    'RUB': '₽', 'BRL': 'R$', 'MXN': '$', 'KRW': '₩', 'SGD': 'S$',
    'HKD': 'HK$', 'NZD': 'NZ$', 'ZAR': 'R', 'TRY': '₺', 'AED': 'د.إ',
    'SAR': '﷼', 'QAR': '﷼', 'KWD': 'د.ك', 'BHD': 'د.ب', 'OMR': '﷼',
    'JOD': 'د.ا', 'LBP': 'ل.ل', 'EGP': '£', 'MAD': 'د.م.', 'TND': 'د.ت',
    'DZD': 'د.ج', 'LYD': 'ل.د', 'SDG': 'ج.س.', 'ETB': 'Br', 'KES': 'KSh',
    'UGX': 'USh', 'TZS': 'TSh', 'ZMW': 'ZK', 'BWP': 'P', 'SZL': 'L',
    'LSL': 'L', 'NAD': 'N$', 'MUR': '₨', 'SCR': '₨', 'MVR': 'ރ',
    'LKR': '₨', 'NPR': '₨', 'BDT': '৳', 'PKR': '₨', 'AFN': '؋',
    'IRR': '﷼', 'IQD': 'د.ع', 'SYP': '£', 'YER': '﷼', 'ILS': '₪',
    'PEN': 'S/', 'CLP': '$', 'COP': '$', 'ARS': '$', 'UYU': '$U',
    'PYG': '₲', 'BOB': 'Bs', 'VEF': 'Bs', 'VES': 'Bs', 'GYD': 'G$',
    'SRD': '$', 'TTD': 'TT$', 'JMD': 'J$', 'BBD': 'Bds$', 'BZD': 'BZ$',
    'XCD': 'EC$', 'AWG': 'ƒ', 'ANG': 'ƒ', 'KYD': 'CI$', 'BMD': 'BD$',
    'BSD': 'B$', 'DOP': 'RD$', 'HTG': 'G', 'CUP': '$', 'CUC': '$',
    'GTQ': 'Q', 'HNL': 'L', 'NIO': 'C$', 'CRC': '₡', 'PAB': 'B/.',
    'VND': '₫', 'THB': '฿', 'MYR': 'RM', 'IDR': 'Rp', 'PHP': '₱',
    'MMK': 'K', 'LAK': '₭', 'KHR': '៛', 'BND': 'B$', 'FJD': 'FJ$',
    'PGK': 'K', 'SBD': 'SI$', 'VUV': 'Vt', 'WST': 'WS$', 'TOP': 'T$'
  };
  
  return currencyMap[currencyCode.toUpperCase()] || currencyCode;
};

// Map currency names to symbols
const getCurrencySymbolFromName = (currencyName) => {
  const nameMap = {
    'dollar': '$', 'euro': '€', 'pound': '£', 'yen': '¥', 'rupee': '₹',
    'yuan': '¥', 'won': '₩', 'peso': '$', 'real': 'R$', 'rand': 'R',
    'lira': '₺', 'dirham': 'د.إ', 'riyal': '﷼', 'dinar': 'د.ك',
    'shekel': '₪', 'baht': '฿', 'ringgit': 'RM', 'rupiah': 'Rp',
    'peso': '₱', 'krona': 'kr', 'krone': 'kr', 'zloty': 'zł',
    'koruna': 'Kč', 'forint': 'Ft', 'ruble': '₽', 'lev': 'лв',
    'kuna': 'kn', 'leu': 'lei', 'denar': 'ден', 'dram': '֏'
  };
  
  const lowerName = currencyName.toLowerCase();
  for (const [name, symbol] of Object.entries(nameMap)) {
    if (lowerName.includes(name)) {
      return symbol;
    }
  }
  
  return '';
};

// Reverse lookup: get currency code from symbol
const getCurrencyCodeFromSymbol = (symbol) => {
  const symbolMap = {
    '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY', '₹': 'INR',
    'C$': 'CAD', 'A$': 'AUD', 'CHF': 'CHF', 'kr': 'SEK', 'zł': 'PLN',
    'Kč': 'CZK', 'Ft': 'HUF', '₽': 'RUB', 'R$': 'BRL', '₩': 'KRW',
    'S$': 'SGD', 'HK$': 'HKD', 'NZ$': 'NZD', 'R': 'ZAR', '₺': 'TRY',
    'د.إ': 'AED', '﷼': 'SAR', 'د.ك': 'KWD', 'د.ب': 'BHD', 'ل.ل': 'LBP',
    'د.م.': 'MAD', 'د.ت': 'TND', 'د.ج': 'DZD', 'ل.د': 'LYD', 'ج.س.': 'SDG',
    'Br': 'ETB', 'KSh': 'KES', 'USh': 'UGX', 'TSh': 'TZS', 'ZK': 'ZMW',
    'P': 'BWP', 'L': 'SZL', 'N$': 'NAD', '₨': 'MUR', 'ރ': 'MVR',
    '৳': 'BDT', '؋': 'AFN', 'د.ع': 'IQD', '₪': 'ILS', 'S/': 'PEN',
    '$U': 'UYU', '₲': 'PYG', 'Bs': 'BOB', 'G$': 'GYD', 'TT$': 'TTD',
    'J$': 'JMD', 'Bds$': 'BBD', 'BZ$': 'BZD', 'EC$': 'XCD', 'ƒ': 'AWG',
    'CI$': 'KYD', 'BD$': 'BMD', 'B$': 'BSD', 'RD$': 'DOP', 'G': 'HTG',
    'Q': 'GTQ', 'L': 'HNL', 'C$': 'NIO', '₡': 'CRC', 'B/.': 'PAB',
    '₫': 'VND', '฿': 'THB', 'RM': 'MYR', 'Rp': 'IDR', '₱': 'PHP',
    'K': 'MMK', '₭': 'LAK', '៛': 'KHR', 'FJ$': 'FJD', 'SI$': 'SBD',
    'Vt': 'VUV', 'WS$': 'WST', 'T$': 'TOP'
  };
  
  return symbolMap[symbol] || '';
};


// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
      return false;
    }
  }
};

