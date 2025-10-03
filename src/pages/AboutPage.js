import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useContentstack } from "../hooks/useContentstack";
import { getImageUrl } from "../utils/helpers";
import {
  FiArrowRight,
  FiMail,
  FiTarget,
  FiHeart,
  FiEye,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";

const AboutPage = () => {
  const { data: aboutData, loading, error } = useContentstack("about");
  const navigate = useNavigate();

  // Navigation handler with scroll to top (similar to ProductsPage)
  const handleNavigation = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Process data from Contentstack (with debugging)
  const processedData = useMemo(() => {
    if (!aboutData) return {};

    // Debug: Log available fields from CMS
    console.log('=== AboutPage Data Debug ===');
    console.log('Raw aboutData from CMS:', aboutData);
    console.log('Available fields:', Object.keys(aboutData));
    
    // Check specific fields we're looking for
    console.log('🎯 Specific field values:');
    console.log('- journey_badge_text:', aboutData.journey_badge_text || 'NOT FOUND');
    console.log('- journey_title:', aboutData.journey_title || 'NOT FOUND');
    console.log('- about_descriptions:', aboutData.about_descriptions || 'NOT FOUND'); 
    console.log('- about_description:', aboutData.about_description || 'NOT FOUND');
    console.log('- about_title:', aboutData.about_title || 'NOT FOUND');
    console.log('- description:', aboutData.description || 'NOT FOUND');

    return {
      // Hero section
      heroTitle: aboutData.hero_title || aboutData.title || '',
      heroSubtitle: aboutData.hero_subtitle || aboutData.subtitle || '',
      heroImage: aboutData.hero_image || aboutData.background_image || null,
      
      // Journey section - PRIORITIZE journey_badge_text and about_descriptions
      journeyBadgeText: aboutData.journey_badge_text || aboutData.journey_badge || '',
      journeyTitle: aboutData.journey_title || aboutData.about_title || '',
      journeyDescription: aboutData.about_descriptions || aboutData.about_description || aboutData.journey_description || aboutData.description || '',
      journeyImage: aboutData.journey_image || aboutData.about_image || null,
      
      // Mission section
      missionTitle: aboutData.mission_title || 'Our Mission',
      missionDescription: aboutData.mission_statement || aboutData.mission || '',
      
      // Vision section
      visionTitle: aboutData.vision_title || 'Our Vision',
      visionDescription: aboutData.vision || '',
      
      // Stats
      stats: aboutData.stats_section || aboutData.statistics || aboutData.stats || [],
      
      // Values
      values: aboutData.values || aboutData.core_values || [],
      
      // CTA section
      ctaTitle: aboutData.cta_title || '',
      ctaDescription: aboutData.cta_description || '',
      ctaPrimaryButton: aboutData.cta_primary_button_text || '',
      ctaSecondaryButton: aboutData.cta_secondary_button_text || '',
    };
  }, [aboutData]);

  // Helper function to render images (similar to ProductsPage)
  const renderImage = (imageData, alt = "", className = "") => {
    if (!imageData) return null;
    const imageUrl = getImageUrl(imageData);
    if (!imageUrl) return null;

    return (
      <img
        src={imageUrl}
        alt={alt || imageData.alt_text || "Image"}
        className={className}
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/600x400/f8f9fa/666666?text=Image+Not+Found';
        }}
      />
    );
  };

  // Icon mapping for stats
  const getStatIcon = (iconName, title) => {
    const iconMap = {
      'users': FiUsers,
      'customers': FiUsers,
      'growth': FiTrendingUp,
      'award': FiAward,
      'star': FiStar,
      'check': FiCheckCircle,
    };

    if (iconName && iconMap[iconName.toLowerCase()]) {
      return iconMap[iconName.toLowerCase()];
    }

    if (title) {
      const lower = title.toLowerCase();
      if (lower.includes('customer') || lower.includes('user')) return FiUsers;
      if (lower.includes('growth') || lower.includes('trend')) return FiTrendingUp;
      if (lower.includes('award') || lower.includes('achievement')) return FiAward;
      if (lower.includes('rating') || lower.includes('star')) return FiStar;
    }

    return FiTrendingUp;
  };

  // Loading state (same pattern as ProductsPage)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Loading about us...
        </p>
      </div>
    );
  }

  // Error state (same pattern as ProductsPage)
  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl font-semibold text-red-600">
          Error loading about page
        </p>
        <p className="mt-2 text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      {(processedData.heroTitle || processedData.heroSubtitle || processedData.heroImage) && (
        <div className="bg-white rounded-2xl shadow hover:shadow-xl transition mb-8 overflow-hidden">
          <div className="relative">
            {processedData.heroImage && (
              <div className="h-80 relative">
                {renderImage(processedData.heroImage, processedData.heroTitle, "w-full h-full object-cover")}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
              </div>
            )}
            
            <div className={processedData.heroImage ? 'absolute inset-0 flex items-center justify-center' : 'py-16'}>
              <div className="text-center px-6">
                {processedData.heroTitle && (
                  <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
                    processedData.heroImage ? 'text-white drop-shadow-lg' : 'text-gray-900'
                  }`}>
                    {processedData.heroTitle}
                  </h1>
                )}
                
                {processedData.heroSubtitle && (
                  <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto ${
                    processedData.heroImage ? 'text-gray-100 drop-shadow' : 'text-gray-600'
                  }`}>
                    {processedData.heroSubtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Split Layout: Journey & Our Mission */}
      {(processedData.journeyDescription || processedData.journeyBadgeText || processedData.journeyTitle || processedData.missionDescription) && (
        <div className="bg-white rounded-2xl shadow hover:shadow-xl transition mb-8 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Left Side - Journey Section */}
            {(processedData.journeyDescription || processedData.journeyBadgeText || processedData.journeyTitle) && (
              <div className="bg-gradient-to-br from-indigo-50 to-white p-8 border-r border-gray-100">
                {/* Journey Badge */}
                {processedData.journeyBadgeText && (
                  <div className="mb-4">
                    <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-200 hover:bg-indigo-200 transition-colors">
                      {processedData.journeyBadgeText}
                    </span>
                  </div>
                )}
                
                {processedData.journeyTitle && (
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                      <FiTarget className="text-indigo-600" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {processedData.journeyTitle}
                    </h2>
                  </div>
                )}
                
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {processedData.journeyDescription}
                </p>

                {processedData.journeyImage && (
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    {renderImage(processedData.journeyImage, processedData.journeyTitle || "Journey Image", "w-full h-48 object-cover")}
                  </div>
                )}

                {/* Show placeholder if we have badge but no description */}
                {!processedData.journeyDescription && processedData.journeyBadgeText && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Journey badge found!</strong> Add "about_descriptions" or "about_description" field to your Contentstack entry to display the journey content.
                    </p>
                  </div>
                )}

                {/* Show placeholder if we have title but no description */}
                {!processedData.journeyDescription && processedData.journeyTitle && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Journey title found!</strong> Add "about_descriptions" or "about_description" field to display the journey content.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Right Side - Our Mission */}
            {processedData.missionDescription && (
              <div className={`bg-gradient-to-br from-purple-50 to-white p-8 ${!processedData.journeyDescription ? 'col-span-2' : ''}`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <FiHeart className="text-purple-600" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {processedData.missionTitle}
                  </h2>
                </div>
                
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {processedData.missionDescription}
                </p>

                {/* Mission highlights */}
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiCheckCircle className="text-purple-600 mt-1 mr-3 flex-shrink-0" size={18} />
                    <p className="text-gray-600">Transform gift-giving into joyful experiences</p>
                  </div>
                  <div className="flex items-start">
                    <FiCheckCircle className="text-purple-600 mt-1 mr-3 flex-shrink-0" size={18} />
                    <p className="text-gray-600">Carefully curated, high-quality products</p>
                  </div>
                  <div className="flex items-start">
                    <FiCheckCircle className="text-purple-600 mt-1 mr-3 flex-shrink-0" size={18} />
                    <p className="text-gray-600">Create meaningful connections</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vision Section */}
      {processedData.visionDescription && (
        <div className="bg-white rounded-2xl shadow hover:shadow-xl transition mb-8 p-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <FiEye className="text-green-600" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">{processedData.visionTitle}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg max-w-3xl mx-auto">
              {processedData.visionDescription}
            </p>
          </div>
        </div>
      )}

      {/* Statistics Grid - Similar to ProductsPage grid */}
      {processedData.stats && processedData.stats.length > 0 && (
        <div className="bg-white rounded-2xl shadow hover:shadow-xl transition mb-8 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-gray-600 text-lg">Numbers that showcase our growth and impact</p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {processedData.stats.map((stat, index) => {
              const StatIcon = getStatIcon(stat.icon, stat.title);
              const value = stat.value || stat.number || '0';
              const label = stat.title || stat.label || `Stat ${index + 1}`;

              return (
                <div key={`stat-${index}`} className="bg-gray-50 rounded-xl p-6 text-center hover:bg-gray-100 transition">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg mb-4">
                    <StatIcon className="w-6 h-6" />
                  </div>
                  
                  <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Values Grid - Similar to ProductsPage product cards */}
      {processedData.values && processedData.values.length > 0 && (
        <div className="bg-white rounded-2xl shadow hover:shadow-xl transition mb-8 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg">The principles that guide everything we do</p>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {processedData.values.map((value, index) => {
              const ValueIcon = getStatIcon(value.icon, value.title);
              
              return (
                <div key={`value-${index}`} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg mb-4">
                    <ValueIcon className="w-5 h-5" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {value.title || value.name || `Value ${index + 1}`}
                  </h3>
                  
                  {value.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA Section - Always show with fallback content */}
      <div className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center text-white">
          {processedData.ctaTitle && (
            <h2 className="text-3xl font-bold mb-4">{processedData.ctaTitle}</h2>
          )}
          
          {processedData.ctaDescription && (
            <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
              {processedData.ctaDescription}
            </p>
          )}
          
          {/* Always show navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Shop Now Button - Primary Action */}
            <button
              onClick={() => handleNavigation("/products")}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-200 flex items-center justify-center shadow-lg"
            >
              {processedData.ctaPrimaryButton || "Shop Now"}
              <FiArrowRight className="ml-2 flex-shrink-0" size={16} />
            </button>
            
            {/* Contact Us Button - Secondary Action */}
            <button
              onClick={() => handleNavigation("/contact")}
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <FiMail className="mr-2 flex-shrink-0" size={16} />
              {processedData.ctaSecondaryButton || "Contact Us"}
            </button>
          </div>
        </div>
      </div>

      {/* Debug Section - Show if no journey or mission content found */}
      {aboutData && !processedData.journeyDescription && !processedData.journeyBadgeText && !processedData.journeyTitle && !processedData.missionDescription && (
        <div className="bg-white rounded-2xl shadow hover:shadow-xl transition p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">🔍 Debug: Content Not Found</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <p className="text-yellow-800 text-sm mb-4">
                <strong>Looking for these fields in your Contentstack entry:</strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-1 mb-4">
                <li>• <strong>journey_badge_text</strong> - Badge text for Journey section</li>
                <li>• <strong>journey_title</strong> or <strong>about_title</strong> - Title for Journey section</li>
                <li>• <strong>about_descriptions</strong> - Description for Journey section (plural)</li>
                <li>• <strong>about_description</strong> - Description for Journey section (singular)</li>
                <li>• <strong>mission_statement</strong> - Content for Our Mission section</li>
              </ul>
              <p className="text-xs text-gray-600 mb-3">
                <strong>Available fields in your CMS entry:</strong>
              </p>
              <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                {Object.keys(aboutData).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
