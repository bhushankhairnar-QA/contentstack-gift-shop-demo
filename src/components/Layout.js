import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useContentstack } from "../hooks/useContentstack";
import { getImageUrl } from "../utils/helpers";
import {
  FiShoppingCart,
  FiSearch,
  FiMenu,
  FiHeart,
  FiX,
  FiUser,
  FiChevronDown,
  FiPhone,
  FiMail,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";

const Layout = ({ children }) => {
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { data: categories } = useContentstack("categories");
  const { data: contactData } = useContentstack("contact");
  const { data: homepageData } = useContentstack("homepage");
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Newsletter subscription states
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isNewsletterPopupOpen, setIsNewsletterPopupOpen] = useState(false);
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Newsletter popup keyboard and scroll handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isNewsletterPopupOpen) {
        setIsNewsletterPopupOpen(false);
      }
    };

    if (isNewsletterPopupOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isNewsletterPopupOpen]);

  // Debug branding data loading
  useEffect(() => {
    if (homepageData) {
      console.log('🎨 Website Branding Debug:', {
        website_name: homepageData.website_name,
        website_logo: homepageData.website_logo,
        website_tagline: homepageData.website_tagline,
        logo_display_style: homepageData.logo_display_style
      });
    }
  }, [homepageData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleCategoryClick = (id) => {
    navigate(`/products?category=${id}`);
    setShowMobileMenu(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setIsNewsletterSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsNewsletterPopupOpen(true);
      setNewsletterEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  // Close newsletter popup
  const closeNewsletterPopup = () => {
    setIsNewsletterPopupOpen(false);
  };

  // Navigate to products page from newsletter popup
  const continueToProducts = () => {
    setIsNewsletterPopupOpen(false);
    navigate('/products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle navigation with scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Helper functions to get contact details from Contentstack
  const getContactPhone = () => {
    return contactData?.phone_number || "+1 (555) 123-4567";
  };

  const getContactEmail = () => {
    return contactData?.email_address || "hello@giftshop.com";
  };

  // Footer helper functions
  const getFooterBrandTitle = () => {
    return homepageData?.footer_brand_title || "🎁 GiftShop";
  };

  const getFooterBrandDescription = () => {
    return homepageData?.footer_brand_description || "Your one-stop shop for gifts that bring smiles.";
  };

  const getFooterNavSections = () => {
    return homepageData?.footer_nav_sections || [];
  };

  const getFooterContactTitle = () => {
    return homepageData?.footer_contact_title || "Get in Touch";
  };

  const getFooterContactEmail = () => {
    return homepageData?.footer_contact_email || "hello@giftshop.com";
  };

  const getFooterContactPhone = () => {
    return homepageData?.footer_contact_phone || "+1 (555) 123-4567";
  };

  const getFooterContactAddress = () => {
    return homepageData?.footer_contact_address || "123 Gift Street, Shopping City";
  };

  const getFooterNewsletterTitle = () => {
    return homepageData?.footer_newsletter_title || "Stay Updated";
  };

  const getFooterNewsletterDescription = () => {
    return homepageData?.footer_newsletter_description || "Subscribe to get special offers and deals.";
  };

  const getFooterNewsletterButtonText = () => {
    return homepageData?.footer_newsletter_button_text || "Subscribe";
  };

  const getFooterNewsletterPlaceholder = () => {
    return homepageData?.footer_newsletter_placeholder || "Enter your email";
  };

  const getNewsletterSuccessMessage = () => {
    return homepageData?.newsletter_success_message || "Thank you for subscribing! You'll receive our latest updates and exclusive offers directly in your inbox.";
  };

  // Website branding helper functions
  const getWebsiteName = () => {
    const name = homepageData?.website_name;
    if (name && typeof name === 'string' && name.trim()) {
      return name.trim();
    }
    return "🎁 GiftShop";
  };

  const getWebsiteLogo = () => {
    if (!homepageData?.website_logo) {
      console.log('🔍 No website logo found in homepageData');
      return null;
    }
    
    const logoUrl = getImageUrl(homepageData.website_logo);
    if (logoUrl) {
      console.log('✅ Website logo loaded:', logoUrl);
    }
    return logoUrl;
  };

  const getWebsiteTagline = () => {
    const tagline = homepageData?.website_tagline;
    if (tagline && typeof tagline === 'string' && tagline.trim()) {
      return tagline.trim();
    }
    return "";
  };

  const getLogoDisplayStyle = () => {
    const style = homepageData?.logo_display_style;
    const validStyles = ["logo_only", "text_only", "logo_and_text", "logo_with_tagline"];
    
    if (style && validStyles.includes(style)) {
      return style;
    }
    return "logo_and_text";
  };

  const getFooterSocialLinks = () => {
    return homepageData?.footer_social_links || [];
  };

  const getFooterCopyrightText = () => {
    return homepageData?.footer_copyright_text || `© ${new Date().getFullYear()} GiftShop. All rights reserved.`;
  };

  const getFooterLegalLinks = () => {
    return homepageData?.footer_legal_links || [];
  };

  const shouldShowFooter = () => {
    return homepageData?.show_footer !== false;
  };

  // Social icon mapping
  const getSocialIcon = (iconType) => {
    const iconMap = {
      facebook: FiFacebook,
      twitter: FiTwitter,
      instagram: FiInstagram,
      youtube: FiYoutube,
      linkedin: FiLinkedin,
    };
    return iconMap[iconType] || FiFacebook;
  };

  // Get header navigation links from homepage content model
  const getHeaderNavLinks = () => {
    if (homepageData?.header_nav_links && Array.isArray(homepageData.header_nav_links)) {
      return homepageData.header_nav_links.map(link => ({
        to: link.nav_url || link.link_url || "/",
        label: link.nav_text || link.link_text || "Home"
      }));
    }
    
    // Fallback to hardcoded navigation if no data from Contentstack
    return [
      { to: "/", label: "Home" },
      { to: "/products", label: "Products" },
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
    ];
  };

  const navLinks = getHeaderNavLinks();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* TOP BAR */}
      <div className="hidden md:block bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <FiPhone className="w-4 h-4" />
              <span>{getContactPhone()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiMail className="w-4 h-4" />
              <span>{getContactEmail()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Free shipping on orders over $50</span>
            <div className="flex space-x-3">
              <FiFacebook className="cursor-pointer hover:text-blue-300" />
              <FiTwitter className="cursor-pointer hover:text-blue-300" />
              <FiInstagram className="cursor-pointer hover:text-pink-300" />
            </div>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-lg shadow-md" : "bg-white"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LOGO */}
            <button 
              onClick={() => handleNavigation("/")} 
              className="flex items-center space-x-3 cursor-pointer group transition-all duration-200 hover:opacity-90"
            >
              {(() => {
                const logoUrl = getWebsiteLogo();
                const websiteName = getWebsiteName();
                const tagline = getWebsiteTagline();
                const displayStyle = getLogoDisplayStyle();

                return (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Logo Image */}
                    {logoUrl && (displayStyle === "logo_only" || displayStyle === "logo_and_text" || displayStyle === "logo_with_tagline") && (
                      <div className="flex-shrink-0">
                        <img
                          src={logoUrl}
                          alt={`${websiteName} Logo`}
                          className="h-8 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Website Name & Tagline */}
                    {(displayStyle === "text_only" || displayStyle === "logo_and_text" || displayStyle === "logo_with_tagline") && (
                      <div className="flex flex-col min-w-0">
                        <span className="text-xl sm:text-2xl font-bold text-indigo-600 leading-tight truncate">
                          {websiteName}
                        </span>
                        {tagline && displayStyle === "logo_with_tagline" && (
                          <span className="text-xs text-gray-500 leading-tight -mt-0.5 hidden sm:block truncate">
                            {tagline}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Fallback: If no logo and no valid display style */}
                    {!logoUrl && displayStyle === "logo_only" && (
                      <span className="text-xl sm:text-2xl font-bold text-indigo-600 truncate">
                        {websiteName}
                      </span>
                    )}
                  </div>
                );
              })()}
            </button>

            {/* NAV LINKS */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  onClick={() => handleNavigation(link.to)}
                  className="text-gray-700 font-medium hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 font-medium text-gray-700 hover:text-indigo-600">
                  <span>Categories</span>
                  <FiChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <ul className="py-2">
                    {categories?.map((cat) => (
                      <li key={cat.uid}>
                        <button
                          onClick={() => handleCategoryClick(cat.uid)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          {cat.title || cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>

            {/* SEARCH BAR (desktop) */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Go
                </button>
              </form>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <FiUser className="w-5 h-5 text-gray-600" />
              </button>
              <Link to="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100">
                <FiHeart className="w-5 h-5 text-gray-600" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-gray-100">
                <FiShoppingCart className="w-5 h-5 text-gray-600" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>
              {/* Mobile Menu Btn */}
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setShowMobileMenu((prev) => !prev)}
              >
                {showMobileMenu ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div className="lg:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>
          </div>
        </div>

        {/* MOBILE MENU */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white shadow-lg border-t">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.to}
                  onClick={() => {
                    handleNavigation(link.to);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-50"
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">Categories</h4>
                {categories?.map((cat) => (
                  <button
                    key={cat.uid}
                    onClick={() => handleCategoryClick(cat.uid)}
                    className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-indigo-50"
                  >
                    {cat.title || cat.name}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER - Flipkart Style */}
      {shouldShowFooter() && (
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Main Footer Content */}
            <div className="py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Navigation Sections from Contentstack */}
                {getFooterNavSections().slice(0, 3).map((section, index) => (
                  <div key={index} className="lg:col-span-1">
                    <h3 className="text-gray-300 text-sm font-medium mb-3 uppercase tracking-wider">
                      {section.section_title}
                    </h3>
                    <ul className="space-y-2">
                      {section.section_links?.slice(0, 6).map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            to={link.link_url}
                            className="text-gray-400 hover:text-white text-sm transition-colors duration-200 block"
                          >
                            {link.link_text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Contact & Newsletter Section */}
                <div className="lg:col-span-1">
                  <h3 className="text-gray-300 text-sm font-medium mb-3 uppercase tracking-wider">
                    {getFooterContactTitle()}
                  </h3>
                  
                  {/* Brand Info */}
                  <div className="mb-4">
                    <p className="font-medium text-white text-sm mb-1">{getFooterBrandTitle()}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{getFooterBrandDescription()}</p>
                  </div>
                  
                  {/* Contact Details */}
                  <div className="space-y-1 text-gray-400 text-xs mb-4">
                    <div className="flex items-center space-x-2">
                      <FiMail className="w-3 h-3 flex-shrink-0" />
                      <span>{getFooterContactEmail()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiPhone className="w-3 h-3 flex-shrink-0" />
                      <span>{getFooterContactPhone()}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FiMapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{getFooterContactAddress()}</span>
                    </div>
                  </div>

                  {/* Social Media */}
                  {getFooterSocialLinks().length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-gray-300 text-xs font-medium mb-2 uppercase tracking-wider">
                        Follow Us
                      </h4>
                      <div className="flex space-x-3">
                        {getFooterSocialLinks().slice(0, 4).map((social, index) => {
                          const SocialIcon = getSocialIcon(social.social_icon);
                          return (
                            <a
                              key={index}
                              href={social.social_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-7 h-7 bg-gray-800 rounded flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
                              title={social.social_platform}
                            >
                              <SocialIcon className="w-3 h-3" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Newsletter */}
                  <div>
                    <h4 className="text-gray-300 text-xs font-medium mb-2 uppercase tracking-wider">
                      {getFooterNewsletterTitle()}
                    </h4>
                    <form onSubmit={handleNewsletterSubmit} className="flex">
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder={getFooterNewsletterPlaceholder()}
                        className="flex-1 px-2 py-1.5 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-l text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={isNewsletterSubmitting}
                      />
                      <button
                        type="submit"
                        disabled={isNewsletterSubmitting}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-r hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
                      >
                        {isNewsletterSubmitting ? "..." : getFooterNewsletterButtonText()}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-gray-800 py-3">
              <div className="flex flex-col md:flex-row items-center justify-between text-xs">
                <div className="mb-2 md:mb-0">
                  <span className="text-gray-400">{getFooterCopyrightText()}</span>
                </div>
                <div className="flex items-center space-x-4 text-gray-400">
                  {getFooterLegalLinks().map((legal, index) => (
                    <Link
                      key={index}
                      to={legal.legal_url}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {legal.legal_text}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Newsletter Success Popup */}
      {isNewsletterPopupOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeNewsletterPopup}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative transform transition-all duration-300 ease-out scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeNewsletterPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Popup Content */}
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <FiCheckCircle className="w-8 h-8 text-green-500" />
              </div>

              {/* Success Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Newsletter Subscription Successful!
              </h3>

              {/* Success Message from Contentstack */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                {getNewsletterSuccessMessage()}
              </p>

              {/* Action Button */}
              <button
                onClick={continueToProducts}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Layout;
