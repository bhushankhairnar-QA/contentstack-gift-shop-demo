import Contentstack from 'contentstack';

// Initialize Contentstack
const Stack = Contentstack.Stack({
  api_key: process.env.REACT_APP_CONTENTSTACK_API_KEY,
  delivery_token: process.env.REACT_APP_CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.REACT_APP_CONTENTSTACK_ENVIRONMENT || 'dev'
});

// Service class for Contentstack operations
class ContentstackService {
  // Fetch all products
  async getProducts() {
    try {
      const Query = Stack.ContentType('product').Query();
      
      // Include all possible image field references
      const imageFields = ['images', 'image', 'featured_image', 'main_image', 'product_image', 'thumbnail'];
      imageFields.forEach(field => {
        try {
          Query.includeReference(field);
        } catch (e) {
          // Field may not exist, continue
        }
      });
      
      Query.includeReference('category');
      Query.includeReference('currency');
      // Include additional currency-related references that might exist
      try { Query.includeReference('currency_info'); } catch (e) {}
      try { Query.includeReference('pricing'); } catch (e) {}
      const result = await Query.toJSON().find();
      
      // Debug logging
      console.log('=== Contentstack Products Debug ===');
      console.log('Products result structure:', {
        resultLength: result.length,
        firstArrayLength: result[0]?.length,
        isArray: Array.isArray(result),
        firstElementIsArray: Array.isArray(result[0])
      });
      
      if (result[0] && result[0].length > 0) {
        console.log('Sample product full structure:', JSON.stringify(result[0][0], null, 2));
        console.log('Sample product category detailed:', {
          category: result[0][0].category,
          categoryType: typeof result[0][0].category,
          categoryIsArray: Array.isArray(result[0][0].category),
          categoryKeys: result[0][0].category ? Object.keys(result[0][0].category) : null
        });
        
        // Enhanced currency field debugging
        console.log('🎯 Enhanced Currency Debug for Sample Product:');
        console.log('🎯 Currency field:', result[0][0].currency);
        console.log('🎯 Currency type:', typeof result[0][0].currency);
        console.log('🎯 Currency symbol:', result[0][0].currency?.symbol);
        console.log('🎯 Currency code:', result[0][0].currency?.code);
        console.log('🎯 Currency name:', result[0][0].currency?.name);
        console.log('🎯 Currency_info field:', result[0][0].currency_info);
        console.log('🎯 Pricing field:', result[0][0].pricing);
        console.log('🎯 All currency-related fields:', Object.keys(result[0][0]).filter(key => 
          key.toLowerCase().includes('currency') || 
          key.toLowerCase().includes('price')
        ));
        
        console.log('All products with categories and currency:', result[0].map(p => ({
          title: p.title,
          uid: p.uid,
          category: p.category,
          currency: p.currency,
          currencySymbol: p.currency?.symbol,
          categoryType: typeof p.category,
          categoryIsArray: Array.isArray(p.category)
        })));
      }
      
      return result[0] || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Fetch single product by UID
  async getProduct(uid) {
    try {
      const Query = Stack.ContentType('product').Entry(uid);
      
      // Include all possible image field references
      const imageFields = ['images', 'image', 'featured_image', 'main_image', 'product_image', 'thumbnail'];
      imageFields.forEach(field => {
        try {
          Query.includeReference(field);
        } catch (e) {
          // Field may not exist, continue
        }
      });
      
      Query.includeReference('category');
      Query.includeReference('currency');
      // Include additional currency-related references that might exist
      try { Query.includeReference('currency_info'); } catch (e) {}
      try { Query.includeReference('pricing'); } catch (e) {}
      const result = await Query.toJSON().fetch();
      return result;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Fetch all categories
  async getCategories() {
    try {
      const Query = Stack.ContentType('category').Query();
      Query.includeReference('image');
      const result = await Query.toJSON().find();
      
      // Debug logging
      console.log('=== Contentstack Categories Debug ===');
      console.log('Categories result:', result);
      if (result[0] && result[0].length > 0) {
        console.log('All categories:', result[0].map(cat => ({
          uid: cat.uid,
          name: cat.name,
          title: cat.title
        })));
      }
      
      return result[0] || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Fetch products by category
  async getProductsByCategory(categoryId) {
    try {
      const Query = Stack.ContentType('product').Query();
      Query.where('category', categoryId);
      
      // Include all possible image field references
      const imageFields = ['images', 'image', 'featured_image', 'main_image', 'product_image', 'thumbnail'];
      imageFields.forEach(field => {
        try {
          Query.includeReference(field);
        } catch (e) {
          // Field may not exist, continue
        }
      });
      
      Query.includeReference('category');
      Query.includeReference('currency');
      // Include additional currency-related references that might exist
      try { Query.includeReference('currency_info'); } catch (e) {}
      try { Query.includeReference('pricing'); } catch (e) {}
      const result = await Query.toJSON().find();
      return result[0] || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  // Fetch homepage content
  async getHomepageContent() {
    try {
      const Query = Stack.ContentType('homepage').Query();
      
      // Include all possible image field references for homepage
      const imageFields = [
        'hero_image', 'hero_background', 'background_image', 'banner_image',
        'main_image', 'featured_image', 'cover_image', 'image', 'images'
      ];
      imageFields.forEach(field => {
        try {
          Query.includeReference(field);
        } catch (e) {
          // Field may not exist, continue
        }
      });
      
      Query.includeReference('featured_products');
      const result = await Query.toJSON().find();
      
      // Debug logging for homepage content
      console.log('=== Contentstack Homepage Debug ===');
      if (result[0] && result[0].length > 0) {
        const homepageData = result[0][0];
        console.log('Homepage data structure:', JSON.stringify(homepageData, null, 2));
        console.log('Available homepage fields:', Object.keys(homepageData));
        console.log('Image-related fields found:', Object.keys(homepageData).filter(key => 
          key.toLowerCase().includes('image') || 
          key.toLowerCase().includes('img') || 
          key.toLowerCase().includes('photo') ||
          key.toLowerCase().includes('hero') ||
          key.toLowerCase().includes('banner') ||
          key.toLowerCase().includes('background')
        ));
      }
      
      return result[0] && result[0].length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      throw error;
    }
  }

  // Fetch contact content
  async getContactContent() {
    try {
      const Query = Stack.ContentType('contact').Query();
      
      // Include any possible image/file references for contact
      const contactFields = [
        'contact_hero_image', 'hero_image', 'background_image', 'image'
      ];
      contactFields.forEach(field => {
        try {
          Query.includeReference(field);
        } catch (e) {
          // Field may not exist, continue
        }
      });
      
      const result = await Query.toJSON().find();
      
      // Debug logging for contact content
      console.log('=== Contentstack Contact Debug ===');
      if (result[0] && result[0].length > 0) {
        const contactData = result[0][0];
        console.log('Contact data structure:', JSON.stringify(contactData, null, 2));
        console.log('Available contact fields:', Object.keys(contactData));
      }
      
      return result[0] && result[0].length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error('Error fetching contact content:', error);
      throw error;
    }
  }


  // Fetch about page content
  async getAboutContent() {
    try {
      const Query = Stack.ContentType('about').Query();
      
      // Include all possible image and reference fields for about page
      const includeFields = [
        'hero_image', 'background_image', 'image', 'about_image', 'journey_image',
        'featured_image', 'main_image', 'cover_image',
        'stats_section', 'statistics', 'stats', 'values', 'core_values'
      ];
      includeFields.forEach(field => {
        try {
          Query.includeReference(field);
        } catch (e) {
          // Field may not exist, continue
        }
      });
      
      const result = await Query.toJSON().find();
      
      // Enhanced debug logging for about page
      if (result[0]?.[0]) {
        const aboutData = result[0][0];
        console.log('=== About Page CMS Data Debug ===');
        console.log('About data loaded successfully');
        console.log('All available fields:', Object.keys(aboutData));
        console.log('Full about data:', JSON.stringify(aboutData, null, 2));
        
        // Specifically check for description fields
        const descriptionFields = Object.keys(aboutData).filter(key => 
          key.toLowerCase().includes('description') || 
          key.toLowerCase().includes('about') ||
          key.toLowerCase().includes('journey') ||
          key.toLowerCase().includes('text') ||
          key.toLowerCase().includes('content')
        );
        console.log('Description-related fields found:', descriptionFields);
        
        // Check specific fields we're looking for - USER REQUESTED FIELDS
        console.log('🎯 Field values for Our Journey section:');
        console.log('🎯 USER REQUESTED - journey_badge_text:', aboutData.journey_badge_text || 'NOT FOUND ❌');
        console.log('🎯 USER REQUESTED - about_descriptions:', aboutData.about_descriptions || 'NOT FOUND ❌');
        console.log('- about_description (singular):', aboutData.about_description || 'NOT FOUND');
        console.log('- description:', aboutData.description || 'NOT FOUND');
        console.log('- journey_description:', aboutData.journey_description || 'NOT FOUND');
        console.log('- about_title:', aboutData.about_title || 'NOT FOUND');
        console.log('- title:', aboutData.title || 'NOT FOUND');
        console.log('- mission_statement:', aboutData.mission_statement || 'NOT FOUND');
        
        // Check for user-requested specific fields
        if (aboutData.journey_badge_text) {
          console.log('✅ SUCCESS: journey_badge_text field found:', aboutData.journey_badge_text);
        } else {
          console.log('⚠️ WARNING: journey_badge_text field is missing from CMS entry');
        }
        
        if (aboutData.about_descriptions) {
          console.log('✅ SUCCESS: about_descriptions field found and will be used for Our Journey');
          console.log('✅ Content preview:', aboutData.about_descriptions.substring(0, 100) + '...');
        } else if (aboutData.about_description) {
          console.log('✅ FALLBACK: about_description (singular) field found');
          console.log('✅ Content preview:', aboutData.about_description.substring(0, 100) + '...');
        } else {
          console.log('⚠️ WARNING: Neither about_descriptions nor about_description field found');
          console.log('💡 TIP: Add "about_descriptions" or "about_description" field to your Contentstack About content type');
        }
        
      } else {
        console.log('About page content loaded: No data found');
        console.log('Full result:', result);
      }
      
      return result[0] && result[0].length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error('Error fetching about content:', error);
      throw error;
    }
  }

  // Fetch customer info content for checkout form
  async getCustomerInfo() {
    try {
      const Query = Stack.ContentType('customer_info').Query();
      const result = await Query.toJSON().find();
      
      // Debug logging for customer info
      console.log('=== Contentstack Customer Info Debug ===');
      if (result[0] && result[0].length > 0) {
        const customerData = result[0][0];
        console.log('Customer info data structure:', JSON.stringify(customerData, null, 2));
        console.log('Available customer info fields:', Object.keys(customerData));
        console.log('First name field:', customerData.first_name || 'NOT FOUND');
      } else {
        console.log('Customer info content loaded: No data found');
      }
      
      return result[0] && result[0].length > 0 ? result[0][0] : null;
    } catch (error) {
      console.error('Error fetching customer info content:', error);
      throw error;
    }
  }


}

// Create and export a single instance
const contentstackService = new ContentstackService();
export default contentstackService;