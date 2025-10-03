import { useState, useEffect } from 'react';
import ContentstackService from '../services/contentstack';

// Custom hook for fetching Contentstack data
export const useContentstack = (contentType, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result;
        switch (contentType) {
          case 'products':
            result = await ContentstackService.getProducts();
            break;
          case 'categories':
            result = await ContentstackService.getCategories();
            break;
          case 'homepage':
            result = await ContentstackService.getHomepageContent();
            break;
          case 'contact':
            result = await ContentstackService.getContactContent();
            break;
          case 'about':
            result = await ContentstackService.getAboutContent();
            break;
          case 'customer_info':
            result = await ContentstackService.getCustomerInfo();
            break;
          default:
            throw new Error(`Unknown content type: ${contentType}`);
        }
        
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error(`Error fetching ${contentType}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType, ...dependencies]);

  return { data, loading, error };
};

// Hook for fetching a single product
export const useProduct = (uid) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await ContentstackService.getProduct(uid);
        setProduct(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [uid]);

  return { product, loading, error };
};

// Hook for fetching products by category
export const useProductsByCategory = (categoryId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await ContentstackService.getProductsByCategory(categoryId);
        setProducts(result);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products by category:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
};



