import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useContentstack } from '../hooks/useContentstack';
import { getCurrencyFromProduct } from '../utils/helpers';
import { FiArrowLeft, FiMail, FiPhone, FiX, FiCheckCircle } from 'react-icons/fi';

/**
 * System fields to filter out from Contentstack data
 * These are internal Contentstack fields that should not be displayed as form fields
 */
const SYSTEM_FIELDS = [
  'uid', 'created_at', 'updated_at', 'created_by', 'updated_by', 
  '_version', 'ACL', 'locale', 'locales', 'publish_details', 
  'in_progress', 'tags', 'title', 'in_progress_status', 'status', 
  'workflow', 'workflow_status', 'place_order', 'order_date', 'date', 'placeordermessage'
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, itemCount, totalPrice, clearCart } = useCart();
  const { data: customerInfo, loading, error } = useContentstack('customer_info');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderedFields, setOrderedFields] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize form data with fields from Contentstack in the correct order
  useEffect(() => {
    if (customerInfo) {
      const initialFormData = {};
      const orderedFields = [];
      
      // Define a standard field order for common form fields
      const FIELD_ORDER = [
        'first_name', 'last_name', 'full_name', 'name',
        'email', 'phone', 'mobile', 'contact_number',
        'address', 'street_address', 'city', 'state', 'country', 'zip_code', 'postal_code',
        'company', 'organization',
        'payment_method', 'payment_type',
        'notes', 'comments', 'message',
        'date_of_birth', 'birth_date',
        'gender', 'age'
      ];
      
      // First, add fields in the predefined order if they exist
      FIELD_ORDER.forEach(fieldName => {
        if (customerInfo.hasOwnProperty(fieldName)) {
          const isSystemField = SYSTEM_FIELDS.includes(fieldName) || 
                               fieldName.toLowerCase().includes('progress') || 
                               fieldName.toLowerCase().includes('workflow') ||
                               fieldName.toLowerCase().includes('order_date') ||
                               fieldName.toLowerCase().includes('created_at') ||
                               fieldName.toLowerCase().includes('updated_at') ||
                               fieldName.toLowerCase().includes('date');
          
          if (!isSystemField) {
            initialFormData[fieldName] = customerInfo[fieldName] || '';
            orderedFields.push(fieldName);
          }
        }
      });
      
      // Then add any remaining fields that weren't in the predefined order
      Object.keys(customerInfo).forEach(key => {
        if (!orderedFields.includes(key)) {
          const isSystemField = SYSTEM_FIELDS.includes(key) || 
                               key.toLowerCase().includes('progress') || 
                               key.toLowerCase().includes('workflow') ||
                               key.toLowerCase().includes('order_date') ||
                               key.toLowerCase().includes('created_at') ||
                               key.toLowerCase().includes('updated_at') ||
                               key.toLowerCase().includes('date');
          
          if (!isSystemField) {
            initialFormData[key] = customerInfo[key] || '';
            orderedFields.push(key);
          }
        }
      });
      
      console.log('=== CheckoutPage Field Order Debug ===');
      console.log('Ordered fields:', orderedFields);
      console.log('Form data keys:', Object.keys(initialFormData));
      
      setFormData(initialFormData);
      setOrderedFields(orderedFields);
    }
  }, [customerInfo]);

  // Redirect if cart is empty (but not if form was just submitteds)
  useEffect(() => {
    if (items.length === 0 && !isSubmitted) {
      navigate('/cart');
    }
  }, [items, navigate, isSubmitted]);

  /**
   * Handle form input changes and clear validation errors
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate form data and return validation status
   * @returns {boolean} - True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    
    console.log('=== VALIDATION STARTED ===');
    console.log('Form data to validate:', formData);
    console.log('Form data keys:', Object.keys(formData));
    
    Object.keys(formData).forEach(fieldName => {
      const fieldValue = formData[fieldName];
      console.log(`Validating field: ${fieldName}, value: "${fieldValue}"`);
      
      if (!fieldValue || !fieldValue.toString().trim()) {
        newErrors[fieldName] = `${fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
        console.log(`Field ${fieldName} is empty, adding error`);
      }
      
      // Email validation
      if (fieldName.toLowerCase().includes('email') && 
          fieldValue && 
          !/\S+@\S+\.\S+/.test(fieldValue)) {
        newErrors[fieldName] = 'Email is invalid';
        console.log(`Field ${fieldName} has invalid email format`);
      }
    });
    
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form is valid:', isValid);
    return isValid;
  };

  /**
   * Creates HTML email template for order confirmation
   */
  const createOrderEmailTemplate = () => {
    const itemsList = items.map(item => {
      const hasDiscount = item.discount_percentage && item.discount_percentage > 0;
      const discountedPrice = hasDiscount 
        ? Math.round(item.price - (item.discount_percentage * item.price / 100))
        : item.price;
      const itemTotal = discountedPrice * item.quantity;
      
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${currencySymbol}${discountedPrice}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${currencySymbol}${itemTotal}</td>
        </tr>
      `;
    }).join('');

    const customerFields = orderedFields.map(field => {
      const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return `<p><strong>${fieldLabel}:</strong> ${formData[field]}</p>`;
    }).join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2563eb; text-align: center; margin-bottom: 30px;">🎉 Order Confirmation</h2>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #1e40af; margin-top: 0;">Thank you for your order!</h3>
            <p style="color: #475569;">Your order has been successfully placed and is being processed.</p>
            <p style="color: #64748b; font-size: 12px;">Order Date: ${new Date().toLocaleString()}</p>
          </div>

          <h3 style="color: #333; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="padding: 10px; text-align: left; color: #000000;">Product</th>
                <th style="padding: 10px; text-align: center; color: #000000;">Qty</th>
                <th style="padding: 10px; text-align: right; color: #000000;">Price</th>
                <th style="padding: 10px; text-align: right; color: #000000;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr style="background-color: #f1f5f9;">
                <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #000000;">Total Amount:</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #000000;">${currencySymbol}${totalPrice}</td>
              </tr>
            </tfoot>
          </table>

          <h3 style="color: #333; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 30px;">Customer Information</h3>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
            ${customerFields}
          </div>

         
        </div>
        
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
          This is an automated confirmation email. Please keep this for your records.
        </p>
      </div>
    `;
  };

  /**
   * Handle form submission and order processing
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('Form data:', formData);
    console.log('Ordered fields:', orderedFields);
    
    const isValid = validateForm();
    console.log('Form validation result:', isValid);
    
    if (!isValid) {
      console.log('Form validation failed, stopping submission');
      return;
    }
    
    console.log('Form validation passed, starting submission...');
    setIsSubmitting(true);
    
    try {
      const webhookUrl = process.env.REACT_APP_EMAIL_WEBHOOK_URL;
      
      console.log('🔍 DEBUG - Environment variable check:');
      console.log('  - webhookUrl:', webhookUrl);
      console.log('  - All env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
      
      if (!webhookUrl) {
        console.error('❌ Email webhook URL not configured in environment variables');
        console.error('❌ Make sure .env file has: REACT_APP_EMAIL_WEBHOOK_URL=...');
        console.error('❌ And restart the dev server with: npm start');
      } else {
        console.log('✅ Webhook URL found:', webhookUrl);
        
        // Get customer email - search for any field containing "email"
        let customerEmail = '';
        const emailFieldKey = Object.keys(formData).find(key => 
          key.toLowerCase().includes('email')
        );
        
        if (emailFieldKey) {
          customerEmail = formData[emailFieldKey];
        }
        
        // Get customer name - search for any field containing "name"
        let customerName = 'Customer';
        const nameFieldKey = Object.keys(formData).find(key => 
          key.toLowerCase().includes('name') && !key.toLowerCase().includes('email')
        );
        
        if (nameFieldKey) {
          customerName = formData[nameFieldKey];
        }
        
        console.log('🔍 DEBUG - Email field check:');
        console.log('  - All form fields:', Object.keys(formData));
        console.log('  - Email field found:', emailFieldKey);
        console.log('  - Email value:', customerEmail);
        console.log('  - Name field found:', nameFieldKey);
        console.log('  - Name value:', customerName);
        
        if (!customerEmail) {
          console.warn('⚠️ No email field found in form data!');
          console.warn('Available form fields:', Object.keys(formData));
        } else {
          console.log('✅ Customer email found:', customerEmail);
          
          try {
            // Create HTML email template
            const emailHTML = createOrderEmailTemplate();
            console.log('📧 Email HTML length:', emailHTML.length, 'characters');
            
            // Create query parameters - matching Contentstack automation API structure
            const params = new URLSearchParams({
              to: customerEmail,
              subject: `Order Confirmation - ${itemCount} Item(s) - ${currencySymbol}${totalPrice}`,
              body: emailHTML
            });
            
            // Build URL with query parameters
            const url = `${webhookUrl}?${params.toString()}`;
            
            console.log('📤 Sending email...');
            console.log('  - To:', customerEmail);
            console.log('  - Subject:', `Order Confirmation - ${itemCount} Item(s) - ${currencySymbol}${totalPrice}`);
            console.log('  - URL (first 150 chars):', url.substring(0, 150) + '...');
            
            // Send POST request to Contentstack automation API with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(url, {
              method: 'POST',
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log('📥 Response received:');
            console.log('  - Status:', response.status);
            console.log('  - Status Text:', response.statusText);
            console.log('  - OK:', response.ok);
            
            if (response.ok) {
              const responseData = await response.json();
              console.log('✅ ✅ ✅ EMAIL SENT SUCCESSFULLY! ✅ ✅ ✅');
              console.log('Response data:', responseData);
              console.log('  - Trigger ID:', responseData.trigger_id);
              console.log('  - Payload ID:', responseData.payload_id);
              console.log('  - Execution IDs:', responseData.execution_ids);
            } else {
              console.error('❌ Email webhook responded with error:', response.status);
              const errorText = await response.text();
              console.error('Error response:', errorText);
            }
          } catch (fetchError) {
            console.error('❌ Email fetch error (non-critical):', fetchError);
            if (fetchError.name === 'AbortError') {
              console.error('Email request timed out after 10 seconds');
            }
            // Don't throw - allow order completion to continue
          }
        }
      }
      
      // Always complete the order and show popup (regardless of email status)
      console.log('Order processing completed, showing popup first...');
      setIsSubmitting(false);
      setIsSubmitted(true);
      console.log('Popup state set to true, should be visible now');
      
      // Clear cart after a short delay to ensure popup renders first
      setTimeout(() => {
        console.log('Clearing cart now...');
        clearCart();
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error processing order:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      setIsSubmitting(false);
      alert(customerInfo?.error_message || 'There was an error processing your order. Please try again.');
    }
  };

  const handleBackToCart = () => navigate('/cart');

  const closeSuccessPopup = () => {
    setIsSubmitted(false);
  };

  const continueToHome = () => {
    setIsSubmitted(false);
    navigate(customerInfo?.redirect_url || '/');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Handle escape key and prevent body scroll when modal is open
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSubmitted) {
        closeSuccessPopup();
      }
    };

    if (isSubmitted) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isSubmitted]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{customerInfo?.loading_text || 'Loading checkout form...'}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">
            {customerInfo?.error_title || 'Error loading checkout form'}
          </p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Empty cart redirect
  if (items.length === 0) return null;

  const currencySymbol = items[0] ? getCurrencyFromProduct(items[0]).symbol : '';

  /**
   * Render individual form field based on field type and Contentstack configuration
   * @param {string} fieldName - Name of the field to render
   * @returns {JSX.Element} - Form field component
   */
  const renderFormField = (fieldName) => {
    const fieldValue = formData[fieldName];
    const fieldLabel = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Enhanced field type detection
    const isEmailField = fieldName.toLowerCase().includes('email');
    const isPhoneField = fieldName.toLowerCase().includes('phone') || 
                        fieldName.toLowerCase().includes('mobile') || 
                        fieldName.toLowerCase().includes('contact');
    const isAddressField = fieldName.toLowerCase().includes('address') || 
                          fieldName.toLowerCase().includes('street');
    const isTextareaField = fieldName.toLowerCase().includes('notes') || 
                           fieldName.toLowerCase().includes('comments') || 
                           fieldName.toLowerCase().includes('message') ||
                           fieldName.toLowerCase().includes('description');
    const isDropdownField = fieldName.toLowerCase().includes('payment_method') ||
                           fieldName.toLowerCase().includes('payment_type') ||
                           fieldName.toLowerCase().includes('country') ||
                           fieldName.toLowerCase().includes('state') ||
                           fieldName.toLowerCase().includes('gender');
    
    // Get dropdown options from Contentstack
    const dropdownOptions = customerInfo?.[`${fieldName}_options`] || 
                           customerInfo?.[`${fieldName}_values`] || 
                           customerInfo?.[`${fieldName}_choices`] ||
                           customerInfo?.[`${fieldName}_options_list`];
    
    return (
      <div key={fieldName} className="space-y-2">
        <label htmlFor={fieldName} className="block text-sm font-semibold text-gray-700">
          <div className="flex items-center gap-2">
            {isEmailField && <FiMail className="text-blue-500" />}
            {isPhoneField && <FiPhone className="text-blue-500" />}
            <span>{fieldLabel}</span>
            <span className="text-red-500">*</span>
          </div>
        </label>
        
        {isDropdownField && dropdownOptions ? (
          <select
            id={fieldName}
            name={fieldName}
            value={fieldValue}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              errors[fieldName] 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <option value="">Select {fieldLabel.toLowerCase()}</option>
            {Array.isArray(dropdownOptions) ? (
              dropdownOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))
            ) : (
              Object.entries(dropdownOptions).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))
            )}
          </select>
        ) : isTextareaField ? (
          <textarea
            id={fieldName}
            name={fieldName}
            value={fieldValue}
            onChange={handleInputChange}
            rows={4}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical ${
              errors[fieldName] 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder={customerInfo?.[`${fieldName}_placeholder`] || `Enter your ${fieldLabel.toLowerCase()}`}
          />
        ) : (
          <input
            type={isEmailField ? 'email' : isPhoneField ? 'tel' : 'text'}
            id={fieldName}
            name={fieldName}
            value={fieldValue}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              errors[fieldName] 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder={customerInfo?.[`${fieldName}_placeholder`] || `Enter your ${fieldLabel.toLowerCase()}`}
          />
        )}
        
        {errors[fieldName] && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errors[fieldName]}</span>
          </div>
        )}
      </div>
    );
  };

  const renderOrderItem = (item) => {
    const hasDiscount = item.discount_percentage && item.discount_percentage > 0;
    const discountedPrice = hasDiscount 
      ? Math.round(item.price - (item.discount_percentage * item.price / 100))
      : item.price;
    
    return (
      <div key={item.uid} className="flex justify-between text-sm">
        <span className="flex-1">{item.title} x {item.quantity}</span>
        <span className="font-medium">{currencySymbol}{discountedPrice * item.quantity}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToCart}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors group"
          >
            <FiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{customerInfo?.back_button_text || 'Back to Cart'}</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {customerInfo?.page_title || 'Checkout Details'}
            </h1>
            <p className="text-gray-600 text-lg">Complete your order details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Dynamic Form Fields */}
              {customerInfo && orderedFields.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                    <h2 className="text-2xl font-bold text-white">
                      {customerInfo?.form_section_title || 'Customer Information'}
                    </h2>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {orderedFields.map(renderFormField)}
                    </div>
                    
                    {/* Place Order Button */}
                    <div className="mt-8 flex justify-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          'Place Order'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* No Fields Message */}
              {customerInfo && orderedFields.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 shadow-lg">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.35 17.5C2.58 18.333 3.54 20 5.08 20z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-yellow-800">
                      {customerInfo?.no_fields_title || 'No Form Fields Found'}
                    </h2>
                    <p className="text-yellow-700 mb-6 text-lg">
                      {customerInfo?.no_fields_message || 'No user-defined fields found in your Contentstack customer_info content type. Please add fields to your content type to display the checkout form.'}
                    </p>
                    <div className="bg-yellow-100 rounded-xl p-6 text-left">
                      <p className="text-sm text-yellow-800 font-semibold mb-3">
                        Available fields from Contentstack:
                      </p>
                      <pre className="text-xs text-yellow-700 bg-white p-4 rounded-lg border overflow-auto max-h-40 shadow-inner">
                        {JSON.stringify(customerInfo, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">
                  {customerInfo?.order_summary_title || 'Order Summary'}
                </h2>
              </div>
              
              <div className="p-6">
                {/* Product-wise breakdown */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2z" />
                    </svg>
                    Product Details
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => {
                      const hasDiscount = item.discount_percentage && item.discount_percentage > 0;
                      const discountedPrice = hasDiscount 
                        ? Math.round(item.price - (item.discount_percentage * item.price / 100))
                        : item.price;
                      const itemTotal = discountedPrice * item.quantity;
                      
                      return (
                        <div key={item.uid} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.title}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-bold text-black-600">{currencySymbol}{itemTotal}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Summary totals */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>{customerInfo?.items_label || 'Subtotal'} ({itemCount} items)</span>
                    <span className="font-medium">{currencySymbol}{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{customerInfo?.shipping_label || 'Shipping'}</span>
                    <span className="font-medium text-black-600">{customerInfo?.shipping_value || 'Free'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{customerInfo?.tax_label || 'Tax'}</span>
                    <span className="font-medium">{currencySymbol}{customerInfo?.tax_value || 0}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-xl">
                      <span className="text-gray-800">{customerInfo?.total_label || 'Total Amount'}</span>
                      <span className="text-black-600">{currencySymbol}{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup Modal */}
      {console.log('=== POPUP RENDERING CHECK ===', 'isSubmitted:', isSubmitted)}
      {isSubmitted && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={closeSuccessPopup}
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl border border-gray-100 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'slideInUp 0.4s ease-out'
            }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-50 to-transparent rounded-3xl -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-50 to-transparent rounded-full translate-y-10 -translate-x-10"></div>

            {/* Close button */}
            <button
              onClick={closeSuccessPopup}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 group"
            >
              <FiX className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
            
            <div className="relative">
              {/* Success icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {customerInfo?.popup_title || customerInfo?.success_title || 'Order Placed Successfully!'}
              </h3>
              
              {/* Message */}
              <div className="text-gray-600 mb-8 text-sm leading-relaxed">
                {customerInfo?.placeordermessage || customerInfo?.success_message || 'Thank you for your order! We will process it shortly and send you a confirmation email.'}
              </div>
              
              {/* Continue button */}
              <button
                onClick={continueToHome}
                className="group relative w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl font-semibold text-base shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <span>{customerInfo?.popup_button_text || customerInfo?.continue_button_text || 'Continue Browsing'}</span>
                  <svg 
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;