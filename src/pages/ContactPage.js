import React, { useState, useEffect } from "react";
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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  // Utility function to get dynamic field value with multiple possible field names
  const getDynamicField = (fieldNames, defaultValue = "") => {
    if (!contactData) return defaultValue;
    
    for (const fieldName of fieldNames) {
      if (contactData[fieldName] && typeof contactData[fieldName] === 'string' && contactData[fieldName].trim()) {
        return contactData[fieldName].trim();
      }
    }
    return defaultValue;
  };

  // Utility function to get array field
  const getDynamicArrayField = (fieldNames, defaultValue = []) => {
    if (!contactData) return defaultValue;
    
    for (const fieldName of fieldNames) {
      if (contactData[fieldName] && Array.isArray(contactData[fieldName]) && contactData[fieldName].length > 0) {
        return contactData[fieldName];
      }
    }
    return defaultValue;
  };

  // Utility function to get rich text content
  const getDynamicRichText = (fieldNames, defaultValue = "") => {
    if (!contactData) return defaultValue;
    
    for (const fieldName of fieldNames) {
      const content = contactData[fieldName];
      if (!content) continue;
      
      // Handle Contentstack Rich Text Editor JSON format
      if (typeof content === 'object' && content.children) {
        try {
          let textContent = '';
          const extractText = (node) => {
            if (node.type === 'text') {
              return node.text || '';
            }
            if (node.children && Array.isArray(node.children)) {
              return node.children.map(extractText).join('');
            }
            return '';
          };
          
          if (Array.isArray(content.children)) {
            content.children.forEach(child => {
              const text = extractText(child);
              if (text.trim()) {
                textContent += `<p>${text.trim()}</p>`;
              }
            });
          }
          
          if (textContent.trim()) {
            return textContent;
          }
        } catch (e) {
          console.log(`Error parsing rich text for ${fieldName}:`, e);
        }
      }
      
      // Handle string content (HTML or plain text)
      if (typeof content === 'string' && content.trim()) {
        return content.trim();
      }
    }
    
    return defaultValue;
  };

  // Utility function to get image URL
  const getDynamicImage = (fieldNames, defaultValue = "") => {
    if (!contactData) return defaultValue;
    
    for (const fieldName of fieldNames) {
      const imageField = contactData[fieldName];
      if (imageField) {
        const imageUrl = getImageUrl(imageField);
        if (imageUrl) return imageUrl;
      }
    }
    return defaultValue;
  };

  // Dynamic content getters
  const getHeroImage = () => getDynamicImage(['hero_image', 'background_image', 'contact_hero_image', 'image', 'main_image']);
  
  const getHeroTitle = () => getDynamicField(['hero_title', 'title', 'page_title', 'main_title', 'heading', 'contact_title']);
  
  const getHeroDescription = () => getDynamicRichText(['hero_description', 'description', 'hero_subtitle', 'subtitle', 'short_description']);

  // Contact Information
  const getContactPhone = () => getDynamicField(['phone_number', 'phone', 'contact_phone', 'business_phone']);
  
  const getContactEmail = () => getDynamicField(['email_address', 'email', 'contact_email', 'business_email']);
  
  const getBusinessAddress = () => getDynamicField(['business_address', 'address', 'contact_address', 'office_address', 'location']);
  
  const getBusinessHours = () => getDynamicField(['business_hours', 'hours', 'operating_hours', 'office_hours', 'working_hours']);

  // Section Titles
  const getContactInfoTitle = () => getDynamicField(['contact_info_title', 'info_title', 'contact_section_title']);
  
  const getFormTitle = () => getDynamicField(['form_title', 'contact_form_title', 'message_title']);

  // Social Links
  const getSocialSectionTitle = () => getDynamicField(['social_section_title', 'social_title', 'follow_title']);
  
  const getSocialLinks = () => getDynamicArrayField(['social_links', 'social_media', 'social_accounts']);

  // Feature Cards
  const getFeatureCards = () => getDynamicArrayField(['feature_cards', 'features', 'highlights', 'why_choose_us', 'benefits', 'advantages']);
  
  const getFeatureSectionTitle = () => getDynamicField(['feature_section_title', 'why_choose_us_title', 'features_title', 'benefits_title']);
  
  const getFeatureSectionDescription = () => getDynamicRichText(['feature_section_description', 'why_choose_us_description', 'features_description', 'benefits_description']);

  // Success Message
  const getSuccessMessage = () => getDynamicRichText(['success_message', 'form_success_message', 'thank_you_message']);

  // Company Information
  const getCompanyName = () => getDynamicField(['company_name', 'business_name', 'organization_name']);
  
  const getContactPersonName = () => getDynamicField(['contact_person_name', 'contact_person', 'representative_name']);

  // Form Labels
  const getFormLabels = () => {
    if (!contactData) return {};
    const labelsFields = ['form_labels', 'field_labels', 'form_fields'];
    for (const field of labelsFields) {
      if (contactData[field] && typeof contactData[field] === 'object') {
        return contactData[field];
      }
    }
    return {};
  };

  // Icon mapping for feature cards and social links
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading contact page content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading contact content: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 text-white py-24 md:py-32 overflow-hidden">
        {getHeroImage() && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${getHeroImage()})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
          </div>
        )}
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 animate-fade-in-up">
              {getHeroTitle() || "Contact Us"}
            </h1>
            {getHeroDescription() && (
              <div 
                className="text-xl md:text-2xl lg:text-3xl text-blue-100 max-w-4xl mx-auto font-light leading-relaxed prose prose-xl prose-blue max-w-none animate-fade-in-up animation-delay-300"
                dangerouslySetInnerHTML={{ __html: getHeroDescription() }}
              />
            )}
          </div>
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
                  {getContactInfoTitle() || "Get in Touch"}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-8"></div>
              </div>
              
              <div className="space-y-8">
                {getContactPhone() && (
                  <div className="group flex items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiPhone className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <dt className="text-lg leading-6 font-bold text-gray-900 mb-2">
                        Phone
                      </dt>
                      <dd className="text-base text-gray-600 font-medium">
                        {getContactPhone()}
                      </dd>
                    </div>
                  </div>
                )}

                {getContactEmail() && (
                  <div className="group flex items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiMail className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <dt className="text-lg leading-6 font-bold text-gray-900 mb-2">
                        Email
                      </dt>
                      <dd className="text-base text-gray-600 font-medium">
                        {getContactEmail()}
                      </dd>
                    </div>
                  </div>
                )}

                {getBusinessAddress() && (
                  <div className="group flex items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiMapPin className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <dt className="text-lg leading-6 font-bold text-gray-900 mb-2">
                        Address
                      </dt>
                      <dd className="text-base text-gray-600 font-medium leading-relaxed">
                        {getBusinessAddress()}
                      </dd>
                    </div>
                  </div>
                )}

                {getBusinessHours() && (
                  <div className="group flex items-start p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiClock className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <dt className="text-lg leading-6 font-bold text-gray-900 mb-2">
                        Business Hours
                      </dt>
                      <dd className="text-base text-gray-600 whitespace-pre-line font-medium leading-relaxed">
                        {getBusinessHours()}
                      </dd>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {getSocialLinks().length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    {getSocialSectionTitle() || "Follow Us"}
                  </h3>
                  <div className="flex justify-center space-x-6">
                    {getSocialLinks().map((social, index) => {
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
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-3xl -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative">
                <div className="mb-10">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    {getFormTitle() || "Send us a Message"}
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-bold text-gray-900">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-bold text-gray-900">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-900">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-bold text-gray-900">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-bold text-gray-900">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

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
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <FiMail className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      {getFeatureCards().length > 0 && (
        <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                {getFeatureSectionTitle() || "Why Choose Us?"}
              </h2>
              
              {getFeatureSectionDescription() && (
                <div 
                  className="text-gray-600 max-w-3xl mx-auto text-lg prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: getFeatureSectionDescription() }}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {getFeatureCards().map((feature, index) => {
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
                      {feature.feature_description || feature.description || feature.content || "Feature description coming soon..."}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
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
            {/* Background decoration */}
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
              
              <div 
                className="text-gray-600 mb-10 prose prose-lg max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: getSuccessMessage() || "Thank you for reaching out! We'll get back to you soon." 
                }}
              />
              
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
