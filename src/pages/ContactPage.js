/**
 * ContactPage Component
 * 
 * Fetches all data from Contentstack CMS:
 * - Content Type: "contact"
 * - Entry Name: "contact us"
 * 
 * All fields are dynamically populated from Contentstack:
 * 
 * HERO SECTION:
 * - hero_title (String) - Main page title
 * - hero_description (String) - Hero description text
 * - hero_image (File/Reference) - Hero background image
 * 
 * CONTACT INFORMATION:
 * - phone_number (String) - Business phone number
 * - email_address (String) - Business email
 * - business_address (String) - Physical address
 * - business_hours (String) - Operating hours
 * - contact_info_title (String) - Section title
 * 
 * CONTACT FORM (Primary Method - Individual Fields):
 * - form_title (String) - Form section title
 * - first_name_label (String) - First name field label
 * - first_name_placeholder (String) - First name field placeholder
 * - last_name_label (String) - Last name field label
 * - last_name_placeholder (String) - Last name field placeholder
 * - email_label (String) - Email field label
 * - email_placeholder (String) - Email field placeholder
 * - subject_label (String) - Subject field label
 * - subject_placeholder (String) - Subject field placeholder
 * - message_label (String) - Message field label
 * - message_placeholder (String) - Message field placeholder
 * - submit_button_text (String) - Submit button text
 * - submitting_button_text (String) - Loading state text
 * - success_message (String) - Success message after submission
 * 
 * CONTACT FORM (Fallback Method - Array):
 * - form_fields (Multiple/Array) - Array of form field objects (used if individual fields not present):
 *   - field_name (String) - Field identifier
 *   - field_label (String) - Field label text
 *   - field_placeholder (String) - Placeholder text
 *   - field_type (String) - Input type (text, email, tel, textarea, select)
 *   - is_required (Boolean) - Required field flag
 *   - grid_column (String) - Layout width (full/half)
 *   - field_description (String) - Help text
 *   - field_options (Array) - Options for select fields
 *   - rows (Number) - Rows for textarea
 * 
 * SOCIAL LINKS:
 * - social_section_title (String) - Social media section title
 * - social_links (Multiple/Array) - Array of social link objects:
 *   - platform (String) - Platform name (facebook, twitter, instagram)
 *   - social_url (String) - Link URL
 * 
 * FEATURE CARDS:
 * - features_section_title (String) - Features section title (primary)
 * - feature_section_title (String) - Features section title (fallback)
 * - features_section_description (String) - Features description (primary)
 * - feature_section_description (String) - Features description (fallback)
 * - feature_cards (Multiple/Array) - Array of feature card objects:
 *   - feature_icon (String) - Icon name
 *   - feature_title (String) - Card title
 *   - feature_description (String) - Card description
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContentstack } from "../hooks/useContentstack";
import { getImageUrl } from "../utils/helpers";
import { 
  FiPhone, 
  FiMail, 
  FiMapPin, 
  FiClock, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram,
  FiLoader,
  FiX,
  FiCheckCircle,
  FiHeart,
  FiStar,
  FiShield,
  FiUsers,
  FiGift,
  FiAward,
  FiTarget,
  FiTrendingUp
} from "react-icons/fi";

const ContactPage = () => {
  const navigate = useNavigate();
  const { data: contactData, loading, error } = useContentstack("contact");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  // Debug: Log the fetched contact data from Contentstack
  React.useEffect(() => {
    if (contactData) {
      console.log('=== Contact Page Data from Contentstack ===');
      console.log('📋 Content Type: contact');
      console.log('📝 Entry Name: contact us');
      console.log('📦 Full Contact Data:', contactData);
      console.log('🔑 Available Fields:', Object.keys(contactData));
      
      // Hero Section Fields
      console.log('\n🎯 Hero Section:');
      console.log('  - hero_title:', contactData.hero_title || '(not set)');
      console.log('  - hero_description:', contactData.hero_description || '(not set)');
      console.log('  - hero_image:', contactData.hero_image ? '✓ Set' : '(not set)');
      
      // Contact Information Fields
      console.log('\n📞 Contact Information:');
      console.log('  - phone_number:', contactData.phone_number || '(not set)');
      console.log('  - email_address:', contactData.email_address || '(not set)');
      console.log('  - business_address:', contactData.business_address || '(not set)');
      console.log('  - business_hours:', contactData.business_hours || '(not set)');
      
      // Form Fields - Individual Fields (Primary Method)
      console.log('\n📝 Form Configuration (Individual Fields):');
      console.log('  - form_title:', contactData.form_title || '(not set)');
      console.log('  - first_name_label:', contactData.first_name_label || '(not set)');
      console.log('  - first_name_placeholder:', contactData.first_name_placeholder || '(not set)');
      console.log('  - last_name_label:', contactData.last_name_label || '(not set)');
      console.log('  - last_name_placeholder:', contactData.last_name_placeholder || '(not set)');
      console.log('  - email_label:', contactData.email_label || '(not set)');
      console.log('  - email_placeholder:', contactData.email_placeholder || '(not set)');
      console.log('  - subject_label:', contactData.subject_label || '(not set)');
      console.log('  - subject_placeholder:', contactData.subject_placeholder || '(not set)');
      console.log('  - message_label:', contactData.message_label || '(not set)');
      console.log('  - message_placeholder:', contactData.message_placeholder || '(not set)');
      console.log('  - submit_button_text:', contactData.submit_button_text || '(not set)');
      console.log('  - submitting_button_text:', contactData.submitting_button_text || '(not set)');
      console.log('  - success_message:', contactData.success_message || '(not set)');
      
      // Form Fields - Array (Fallback Method)
      console.log('\n📝 Form Configuration (Array - Fallback):');
      console.log('  - form_fields:', contactData.form_fields ? `✓ ${contactData.form_fields.length} fields` : '(not set)');
      if (contactData.form_fields) {
        contactData.form_fields.forEach((field, idx) => {
          console.log(`    ${idx + 1}. ${field.field_name || 'unnamed'} (${field.field_type || 'text'}) - ${field.field_label || 'No label'}`);
        });
      }
      
      // Social Links
      console.log('\n🌐 Social Links:');
      console.log('  - social_section_title:', contactData.social_section_title || '(not set)');
      console.log('  - social_links:', contactData.social_links ? `✓ ${contactData.social_links.length} links` : '(not set)');
      
      // Feature Cards
      console.log('\n✨ Feature Cards:');
      console.log('  - features_section_title:', contactData.features_section_title || '(not set)');
      console.log('  - feature_section_title (fallback):', contactData.feature_section_title || '(not set)');
      console.log('  - features_section_description:', contactData.features_section_description || '(not set)');
      console.log('  - feature_section_description (fallback):', contactData.feature_section_description || '(not set)');
      console.log('  - feature_cards:', contactData.feature_cards ? `✓ ${contactData.feature_cards.length} cards` : '(not set)');
      
      console.log('\n===========================================');
    }
  }, [contactData]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('Form submitted with data:', formData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form dynamically
    if (contactData?.form_fields) {
      const resetFormData = {};
      contactData.form_fields.forEach(field => {
        const fieldName = field.field_name || field.name || field.id || 'field';
        resetFormData[fieldName] = '';
      });
      setFormData(resetFormData);
    }
  };

  const closeSuccessPopup = () => {
    setIsSubmitted(false);
  };

  const continueToHome = () => {
    setIsSubmitted(false);
    navigate("/");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Icon mapping for social links and feature cards
  const iconMap = {
    'phone': FiPhone,
    'mail': FiMail,
    'email': FiMail,
    'map-pin': FiMapPin,
    'location': FiMapPin,
    'clock': FiClock,
    'time': FiClock,
    'heart': FiHeart,
    'star': FiStar,
    'shield': FiShield,
    'security': FiShield,
    'users': FiUsers,
    'team': FiUsers,
    'gift': FiGift,
    'present': FiGift,
    'award': FiAward,
    'trophy': FiAward,
    'target': FiTarget,
    'goal': FiTarget,
    'trending-up': FiTrendingUp,
    'growth': FiTrendingUp,
    'facebook': FiFacebook,
    'twitter': FiTwitter,
    'instagram': FiInstagram
  };

  const getIconComponent = (iconName) => {
    const normalizedIcon = (iconName || 'star').toLowerCase().replace(/[\s_-]/g, '-');
    return iconMap[normalizedIcon] || FiStar;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">Loading contact page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600 mb-4">Error loading contact page</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!contactData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-600">No contact data found</p>
          <p className="text-gray-500 mt-2">Please configure the contact page in Contentstack</p>
        </div>
      </div>
    );
  }

  // Helper to get hero image
  const heroImage = contactData.hero_image 
    ? getImageUrl(contactData.hero_image)
    : contactData.background_image 
    ? getImageUrl(contactData.background_image)
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 text-white py-24 md:py-32 overflow-hidden">
        {heroImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
          </div>
        )}
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            {contactData.hero_title || contactData.title || "Contact Us"}
          </h1>
          {contactData.hero_description && (
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              {contactData.hero_description}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  {contactData.contact_info_title || "Get in Touch"}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-8"></div>
              </div>
              
              <div className="space-y-8">
                {contactData.phone_number && (
                  <div className="group flex items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiPhone className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <dt className="text-lg leading-6 font-bold text-gray-900 mb-2">Phone</dt>
                      <dd className="text-base text-gray-600 font-medium">{contactData.phone_number}</dd>
                    </div>
                  </div>
                )}

                {contactData.email_address && (
                  <div className="group flex items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiMail className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <dt className="text-lg leading-6 font-bold text-gray-900 mb-2">Email</dt>
                      <dd className="text-base text-gray-600 font-medium">{contactData.email_address}</dd>
                    </div>
                  </div>
                )}

                {contactData.business_address && (
                  <div className="group flex items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiMapPin className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <dt className="text-lg leading-6 font-bold text-gray-900 mb-2">Address</dt>
                      <dd className="text-base text-gray-600 font-medium leading-relaxed">{contactData.business_address}</dd>
                    </div>
                  </div>
                )}

                {contactData.business_hours && (
                  <div className="group flex items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiClock className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <dt className="text-lg leading-6 font-bold text-gray-900 mb-2">Business Hours</dt>
                      <dd className="text-base text-gray-600 whitespace-pre-line font-medium leading-relaxed">{contactData.business_hours}</dd>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {contactData.social_links && contactData.social_links.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    {contactData.social_section_title || "Follow Us"}
                  </h3>
                  <div className="flex justify-center space-x-6">
                    {contactData.social_links.map((social, index) => {
                      const IconComponent = getIconComponent(social.platform || social.name);
                      return (
                        <a
                          key={index}
                          href={social.social_url || social.url || social.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 border border-gray-100 hover:border-blue-200"
                        >
                          <IconComponent className="h-6 w-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-3xl -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="mb-10">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    {contactData.form_title || "Send us a Message"}
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>

                {/* Check if individual field labels exist, or use form_fields array */}
                {(contactData.first_name_label || contactData.form_fields) ? (
                  <form onSubmit={handleFormSubmit} className="space-y-8">
                    {/* If individual fields exist in Contentstack, use them */}
                    {contactData.first_name_label ? (
                      <>
                        {/* First Name and Last Name - Side by Side */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* First Name */}
                          <div className="space-y-2">
                            <label htmlFor="firstName" className="block text-sm font-bold text-gray-900">
                              {contactData.first_name_label || 'First Name'}
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName || ''}
                              onChange={handleInputChange}
                              required
                              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                              placeholder={contactData.first_name_placeholder || 'Enter your first name'}
                            />
                          </div>

                          {/* Last Name */}
                          <div className="space-y-2">
                            <label htmlFor="lastName" className="block text-sm font-bold text-gray-900">
                              {contactData.last_name_label || 'Last Name'}
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName || ''}
                              onChange={handleInputChange}
                              required
                              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                              placeholder={contactData.last_name_placeholder || 'Enter your last name'}
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-bold text-gray-900">
                            {contactData.email_label || 'Email Address'}
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                            placeholder={contactData.email_placeholder || 'Enter your email address'}
                          />
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                          <label htmlFor="subject" className="block text-sm font-bold text-gray-900">
                            {contactData.subject_label || 'Subject'}
                          </label>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject || ''}
                            onChange={handleInputChange}
                            required
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                            placeholder={contactData.subject_placeholder || "What's this about?"}
                          />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <label htmlFor="message" className="block text-sm font-bold text-gray-900">
                            {contactData.message_label || 'Message'}
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message || ''}
                            onChange={handleInputChange}
                            required
                            rows={6}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white resize-none"
                            placeholder={contactData.message_placeholder || 'Tell us how we can help you...'}
                          ></textarea>
                        </div>
                      </>
                    ) : contactData.form_fields && contactData.form_fields.length > 0 ? (
                      /* Fallback to form_fields array if individual fields not present */
                      contactData.form_fields.map((field, index) => {
                      const fieldName = field.field_name || field.name || field.id || `field_${index}`;
                      const fieldLabel = field.field_label || field.label || field.title || 'Field';
                      const fieldPlaceholder = field.field_placeholder || field.placeholder || '';
                      const fieldType = field.field_type || field.type || 'text';
                      const isRequired = field.is_required !== undefined ? field.is_required : field.required !== undefined ? field.required : true;
                      const gridColumn = field.grid_column || field.column || field.width || 'full';
                      const rows = field.rows || 4;
                      const fieldDescription = field.field_description || field.description || field.help_text || '';
                      const fieldOptions = field.field_options || field.options || [];

                      const isHalfWidth = gridColumn === 'half' || gridColumn === '1/2' || gridColumn === 'col-6';
                      const nextField = contactData.form_fields[index + 1];
                      const nextIsHalfWidth = nextField && (
                        (nextField.grid_column || nextField.column || nextField.width || 'full') === 'half' || 
                        (nextField.grid_column || nextField.column || nextField.width || 'full') === '1/2' ||
                        (nextField.grid_column || nextField.column || nextField.width || 'full') === 'col-6'
                      );

                      const prevField = index > 0 ? contactData.form_fields[index - 1] : null;
                      const prevIsHalfWidth = prevField && (
                        (prevField.grid_column || prevField.column || prevField.width || 'full') === 'half' || 
                        (prevField.grid_column || prevField.column || prevField.width || 'full') === '1/2' ||
                        (prevField.grid_column || prevField.column || prevField.width || 'full') === 'col-6'
                      );
                      
                      if (isHalfWidth && prevIsHalfWidth) {
                        return null;
                      }

                      if (isHalfWidth && nextIsHalfWidth) {
                        const secondField = nextField;
                        const secondFieldName = secondField.field_name || secondField.name || secondField.id || `field_${index + 1}`;
                        const secondFieldLabel = secondField.field_label || secondField.label || secondField.title || 'Field';
                        const secondFieldPlaceholder = secondField.field_placeholder || secondField.placeholder || '';
                        const secondFieldType = secondField.field_type || secondField.type || 'text';
                        const secondIsRequired = secondField.is_required !== undefined ? secondField.is_required : secondField.required !== undefined ? secondField.required : true;
                        const secondFieldDescription = secondField.field_description || secondField.description || secondField.help_text || '';

                        return (
                          <div key={fieldName} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label htmlFor={fieldName} className="block text-sm font-bold text-gray-900">
                                {fieldLabel}
                                {!isRequired && <span className="ml-2 text-xs font-normal text-gray-500">(Optional)</span>}
                              </label>
                              {fieldDescription && <p className="text-xs text-gray-500 -mt-1 mb-2">{fieldDescription}</p>}
                              <input
                                type={fieldType}
                                id={fieldName}
                                name={fieldName}
                                value={formData[fieldName] || ''}
                                onChange={handleInputChange}
                                required={isRequired}
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                                placeholder={fieldPlaceholder}
                              />
                            </div>

                            <div className="space-y-2">
                              <label htmlFor={secondFieldName} className="block text-sm font-bold text-gray-900">
                                {secondFieldLabel}
                                {!secondIsRequired && <span className="ml-2 text-xs font-normal text-gray-500">(Optional)</span>}
                              </label>
                              {secondFieldDescription && <p className="text-xs text-gray-500 -mt-1 mb-2">{secondFieldDescription}</p>}
                              <input
                                type={secondFieldType}
                                id={secondFieldName}
                                name={secondFieldName}
                                value={formData[secondFieldName] || ''}
                                onChange={handleInputChange}
                                required={secondIsRequired}
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                                placeholder={secondFieldPlaceholder}
                              />
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={fieldName} className="space-y-2">
                          <label htmlFor={fieldName} className="block text-sm font-bold text-gray-900">
                            {fieldLabel}
                            {!isRequired && <span className="ml-2 text-xs font-normal text-gray-500">(Optional)</span>}
                          </label>
                          {fieldDescription && <p className="text-xs text-gray-500 -mt-1 mb-2">{fieldDescription}</p>}
                          {fieldType === 'textarea' ? (
                            <textarea
                              id={fieldName}
                              name={fieldName}
                              value={formData[fieldName] || ''}
                              onChange={handleInputChange}
                              required={isRequired}
                              rows={rows}
                              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white resize-none"
                              placeholder={fieldPlaceholder}
                            ></textarea>
                          ) : fieldType === 'select' || fieldType === 'dropdown' ? (
                            <select
                              id={fieldName}
                              name={fieldName}
                              value={formData[fieldName] || ''}
                              onChange={handleInputChange}
                              required={isRequired}
                              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                            >
                              <option value="">{fieldPlaceholder || 'Select an option...'}</option>
                              {fieldOptions.map((option, optIdx) => (
                                <option 
                                  key={optIdx} 
                                  value={typeof option === 'string' ? option : (option.value || option.label)}
                                >
                                  {typeof option === 'string' ? option : (option.label || option.value)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={fieldType}
                              id={fieldName}
                              name={fieldName}
                              value={formData[fieldName] || ''}
                              onChange={handleInputChange}
                              required={isRequired}
                              className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                              placeholder={fieldPlaceholder}
                            />
                        )}
                      </div>
                    );
                  })
                    ) : null}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <FiLoader className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" />
                            {contactData.submitting_button_text || 'Sending...'}
                          </>
                        ) : (
                          <>
                            {contactData.submit_button_text || 'Send Message'}
                            <FiMail className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </div>
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No form fields configured. Please add form fields in Contentstack.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      {contactData.feature_cards && contactData.feature_cards.length > 0 ? (
        <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                {contactData.features_section_title || contactData.feature_section_title || "Why Choose Us?"}
              </h2>
              {(contactData.features_section_description || contactData.feature_section_description) && (
                <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                  {contactData.features_section_description || contactData.feature_section_description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {contactData.feature_cards.map((feature, index) => {
                const IconComponent = getIconComponent(
                  feature.feature_icon || feature.icon || feature.icon_name
                );

                return (
                  <div key={index} className="group text-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="w-10 h-10 text-blue-600 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                      {feature.feature_title || feature.title || feature.name || `Feature ${index + 1}`}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.feature_description || feature.description || feature.content || "Feature description"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        // Debug: Log why feature cards section is not displayed
        contactData && console.log('⚠️ Feature Cards section not displayed. Reason:', 
          !contactData.feature_cards ? 'feature_cards field not found in Contentstack' :
          contactData.feature_cards.length === 0 ? 'feature_cards array is empty' :
          'Unknown reason'
        )
      )}

      {/* Success Popup Modal */}
      {isSubmitted && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeSuccessPopup}
        >
          <div 
            className="bg-white rounded-3xl p-10 max-w-lg w-full mx-4 text-center shadow-3xl border border-gray-100 relative overflow-hidden animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-100 to-transparent rounded-3xl -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

            <button
              onClick={closeSuccessPopup}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
            
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-pulse">
                <FiCheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Message Sent Successfully! 🎉
              </h3>
              
              <p className="text-gray-600 mb-10 leading-relaxed">
                {contactData.success_message || "Thank you for reaching out! We'll get back to you soon."}
              </p>
              
              <button
                onClick={continueToHome}
                className="group relative w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl focus:ring-4 focus:ring-blue-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  Continue Browsing
                  <span className="ml-2 text-lg">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;

