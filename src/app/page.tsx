'use client';
import { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import HeroBanner from './components/HeroBanner';
import PromoBanner from './components/PromoBanner';
import TopBrands from './components/TopBrands';
import TopCategories from './components/TopCategories';
import ProductGrid from './components/ProductGrid';
import FeaturedProducts from './components/FeaturedProducts';
import BrandsPage from './brands/page';
import BrandDetailPage from './allbrands/page';
import BuyingGuidePage from './buying-guide/page';
import BuyingGuideDetailPage from './detailbuyingguide/[id]/page';
import CartPage from './cart/page';
import EventsPage from './events/page';
import EventDetailsPage from './eventsdetail/[id]/page';
import EventRegistrationPage from './eventRegisteration/[id]/page';
import MembershipPage from './membership/page';
import FreebiesPage from './freebies/page';
import BestSellerPage from './bestseller/page';
import FavoritesPage from './favorites/page';
import ClinicSetupPage from './clinic-setup/page';
import CategoryBrowsePage from './category/page';
import FullStoreDirectoryPage from './components/FullStoreDirectoryPage';
import ProductDetailPage from './productdetailpage/[id]/page';
import CheckoutPage from './checkout/page';
import PaymentGatewayPage from './paymentgatewaypage/page';
import OrderConfirmationPage from './orderconfirmation/page';
import OrderTrackingPage from './ordertracking/page';
import OrderHistoryPage from './orderhistory/page';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsAndConditionsPage from './components/TermsAndConditionsPage';
import AccountPage from './account/page';
import WhatsAppButton from './components/WhatsAppButton';
import AllProductsPage from './allproducts/page';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from './hooks/useAuth'; // Add this import
import baseUrl from './baseUrl'; // Add this import

export default function App() {
  const router = useRouter();
  const { isLoggedIn: userIsLoggedIn } = useAuth(); // Get auth status
  const [cartCount, setCartCount] = useState(16);
  // Store liked product IDs as strings (MongoDB _id or numeric ids coerced to string)
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set(['2', '3']));
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState<'home' | 'brands' | 'brand-detail' | 'buying-guide' | 'buying-guide-detail' | 'cart' | 'events' | 'event-details' | 'event-registration' | 'membership' | 'freebies' | 'bestseller' | 'favorites' | 'clinic-setup' | 'category-browse' | 'full-store-directory' | 'productdetailpage/[id]' | 'checkout' | 'payment-gateway' | 'order-confirmation' | 'order-tracking' | 'order-history' | 'account' | 'privacy-policy' | 'terms-and-conditions' | 'all-products'>('home');
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState<string | number>(1);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedBrandId, setSelectedBrandId] = useState('1');
  const [selectedBrandName, setSelectedBrandName] = useState('');
  const [selectedGuideId, setSelectedGuideId] = useState(1);
  const [isProcessingLike, setIsProcessingLike] = useState<string | null>(null); // Track processing likes

  // Load liked products from localStorage on component mount
  useEffect(() => {
    const savedLikedProducts = localStorage.getItem('likedProducts');
    if (savedLikedProducts) {
      try {
        setLikedProducts(new Set(JSON.parse(savedLikedProducts)));
      } catch (error) {
        console.error('Error parsing liked products:', error);
      }
    }
  }, []);

  // Save liked products to localStorage when they change
  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(Array.from(likedProducts)));
  }, [likedProducts]);

  // API function for adding/removing favorites
  const addToFavoritesAPI = useCallback(async (productId: string) => {
    try {
      setIsProcessingLike(productId);

      const response = await fetch(
        `${baseUrl.INVENTORY}/api/v1/product/favorites/add/${productId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      console.log(response);

      if (response.status === 401) {
        return { success: false, requiresLogin: true };
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        liked: data.liked,
        message: data.message,
        data: data.data,
      };
    } catch (err) {
      console.error("Error adding to favorites:", err);
      return { success: false, error: err };
    } finally {
      setIsProcessingLike(null);
    }
  }, []);

  // Function to show login prompt
  const showLoginPrompt = useCallback((productId: string) => {
    // Store the product ID to like after login
    sessionStorage.setItem('productToLikeAfterLogin', productId);
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);

    toast.error('Login Required', {
      description: 'You need to login to add products to favorites',
      action: {
        label: 'Login',
        onClick: () => {
          router.push('/login');
        },
      },
      duration: 5000,
    });
  }, [router]);

  // Main like toggle handler
  const toggleLike = async (productId: number | string) => {
    const idStr = String(productId);

    // Check if user is logged in
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isLoggedIn = !!token || userIsLoggedIn;

    if (!isLoggedIn) {
      showLoginPrompt(idStr);
      return;
    }

    const isCurrentlyLiked = likedProducts.has(idStr);

    // Optimistic UI update
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idStr)) {
        newSet.delete(idStr);
      } else {
        newSet.add(idStr);
      }
      return newSet;
    });

    // Make API call
    const result = await addToFavoritesAPI(idStr);

    if (!result.success) {
      // Revert optimistic update on failure
      setLikedProducts(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(idStr);
        } else {
          newSet.delete(idStr);
        }
        return newSet;
      });

      if (result.requiresLogin) {
        showLoginPrompt(idStr);
      } else {
        toast.error('Failed to update favorites. Please try again.');
      }
    } else {
      // Success - show appropriate message
      if (result.liked) {
        toast.success('Added to favorites!');
      } else {
        toast.info('Removed from favorites');
      }
    }
  };

  // Helper function to check if a product is currently processing like
  const isProductLoadingLike = (productId: string | number) => {
    return isProcessingLike === String(productId);
  };

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  // Update Navigation component to pass favoritesCount and cart props
  // Update ProductGrid to pass loading state

  // Render Brands Page
  if (currentPage === 'brands') {
    return (
      <div>
        <BrandsPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onAccountClick={() => setCurrentPage('account')}
          favoritesCount={likedProducts.size}
          onBrandDetailClick={(brandId: string, name: string) => {
            router.push(`/allbrands?brandId=${brandId}&brandName=${encodeURIComponent(name)}`);
          }}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Brand Detail Page
  if (currentPage === 'brand-detail') {
    return (
      <div>
        <BrandDetailPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToBrands={() => setCurrentPage('brands')}
          onCartClick={() => setCurrentPage('cart')}
          onProductClick={(productId: string) => {
            router.push(`/allbrands/${productId}`);
          }}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onAccountClick={() => setCurrentPage('account')}
          favoritesCount={likedProducts.size}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Buying Guide Page
  if (currentPage === 'buying-guide') {
    return (
      <div>
        {/* <BuyingGuidePage 
          cartCount={cartCount}
          onCardClick={(guideId: number) => {
            setSelectedGuideId(guideId);
            setCurrentPage('buying-guide-detail');
          }}
          onCartClick={() => setCurrentPage('cart')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onAccountClick={() => setCurrentPage('account')}
          favoritesCount={likedProducts.size}
        /> */}
        <WhatsAppButton />
      </div>
    );
  }

  // Render Buying Guide Detail Page
  if (currentPage === 'buying-guide-detail') {
    return (
      <div>
        {/* <BuyingGuideDetailPage 
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToGuide={() => setCurrentPage('buying-guide')}
          onCartClick={() => setCurrentPage('cart')}
          onProductClick={(productId: string | number) => {
            setSelectedProductId(productId);
            setCurrentPage('product-detail');
          }}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          onCategoryBrowseClick={() => setCurrentPage('category-browse')}
        /> */}
        <WhatsAppButton />
      </div>
    );
  }

  // Render Cart Page
  if (currentPage === 'cart') {
    return (
      <div>
        <CartPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCheckoutClick={() => setCurrentPage('checkout')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onAccountClick={() => setCurrentPage('account')}
          favoritesCount={likedProducts.size}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Events Page
  if (currentPage === 'events') {
    return (
      <div>
        <EventsPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onEventClick={(eventId: number) => {
            setSelectedEventId(eventId);
            setCurrentPage('event-details');
          }}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onAccountClick={() => setCurrentPage('account')}
          favoritesCount={likedProducts.size}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Event Details Page
  if (currentPage === 'event-details') {
    return (
      <div>
        {/* <EventDetailsPage 
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToEvents={() => setCurrentPage('events')}
          onCartClick={() => setCurrentPage('cart')}
          eventId={selectedEventId}
          onRegisterClick={() => setCurrentPage('event-registration')}
        /> */}
        <WhatsAppButton />
      </div>
    );
  }

  // Render Event Registration Page
  if (currentPage === 'event-registration') {
    return (
      <div>
        <EventRegistrationPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToDetails={() => setCurrentPage('event-details')}
          onCartClick={() => setCurrentPage('cart')}
          eventId={selectedEventId}
          favoritesCount={likedProducts.size}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Membership Page
  if (currentPage === 'membership') {
    return (
      <div>
        <MembershipPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Freebies Page
  if (currentPage === 'freebies') {
    return (
      <div>
        <FreebiesPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          onProductClick={(productId) => {
            setSelectedProductId(productId);
            setCurrentPage('productdetailpage/[id]');
          }}
          favoritesCount={likedProducts.size}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Best Seller Page
  if (currentPage === 'bestseller') {
    return (
      <div>
        <BestSellerPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onAccountClick={() => setCurrentPage('account')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          onProductClick={(productId: string | number) => {
            setSelectedProductId(productId);
            setCurrentPage('productdetailpage/[id]');
          }}
          favoritesCount={likedProducts.size}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Favorites Page
  if (currentPage === 'favorites') {
    return (
      <div>
        <FavoritesPage
          // cartCount={cartCount}
          // onCartCountChange={setCartCount}
          // onBackToHome={() => setCurrentPage('home')}
          // onCartClick={() => setCurrentPage('cart')}
          // likedProducts={likedProducts}
          // onToggleLike={toggleLike}
          // onBrandClick={() => setCurrentPage('brands')}
          // onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          // onEventsClick={() => setCurrentPage('events')}
          // onMembershipClick={() => setCurrentPage('membership')}
          // onFreebiesClick={() => setCurrentPage('freebies')}
          // onBestSellerClick={() => setCurrentPage('bestseller')}
          // onClinicSetupClick={() => setCurrentPage('clinic-setup')}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Clinic Setup Page
  if (currentPage === 'clinic-setup') {
    return (
      <div>
        <ClinicSetupPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onAccountClick={() => setCurrentPage('account')}
          favoritesCount={likedProducts.size}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Category Browse Page
  if (currentPage === 'category-browse') {
    return (
      <div>
        <CategoryBrowsePage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          onFullStoreDirectoryClick={() => setCurrentPage('full-store-directory')}
          likedProducts={likedProducts}
          onToggleLike={toggleLike}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Full Store Directory Page
  if (currentPage === 'full-store-directory') {
    return (
      <div>
        {/* <FullStoreDirectoryPage 
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
        /> */}
        <WhatsAppButton />
      </div>
    );
  }

  // Render Product Detail Page
  if (currentPage === 'productdetailpage/[id]') {
    return (
      <div>
        <ProductDetailPage
          productId={selectedProductId}
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          isLiked={likedProducts.has(String(selectedProductId))}
          isLoadingLike={isProductLoadingLike(selectedProductId)}
          onToggleLike={toggleLike}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          onCheckoutClick={() => setCurrentPage('checkout')}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Checkout Page
  if (currentPage === 'checkout') {
    return (
      <div>
        <CheckoutPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToCart={() => setCurrentPage('cart')}
          onProceedToPayment={(amount: number, orderId: string) => {
            setPaymentAmount(amount);
            setCurrentOrderId(orderId);
            setCurrentPage('payment-gateway');
          }}
          onCartClick={() => setCurrentPage('cart')}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Payment Gateway Page
  if (currentPage === 'payment-gateway') {
    return (
      <div>
        <PaymentGatewayPage
          amount={paymentAmount}
          orderId={currentOrderId}
          cartCount={cartCount}
          onPaymentSuccess={() => {
            setCurrentPage('order-confirmation');
          }}
          onPaymentCancel={() => setCurrentPage('checkout')}
          onCartClick={() => setCurrentPage('cart')}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Order Confirmation Page
  if (currentPage === 'order-confirmation') {
    return (
      <div>
        <OrderConfirmationPage
          orderId={currentOrderId}
          cartCount={cartCount}
          onBackToHome={() => setCurrentPage('home')}
          onTrackOrder={(orderId: string) => {
            setCurrentOrderId(orderId);
            setCurrentPage('order-tracking');
          }}
          onCartClick={() => setCurrentPage('cart')}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Order Tracking Page
  if (currentPage === 'order-tracking') {
    return (
      <div>
        <OrderTrackingPage
          orderId={currentOrderId}
          cartCount={cartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Order History Page
  if (currentPage === 'order-history') {
    return (
      <div>
        <OrderHistoryPage
          cartCount={cartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onTrackOrder={(orderId: string) => {
            setCurrentOrderId(orderId);
            setCurrentPage('order-tracking');
          }}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Account Page
  if (currentPage === 'account') {
    return (
      <div>
        <AccountPage
          cartCount={cartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          favoritesCount={likedProducts.size}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Privacy Policy Page
  if (currentPage === 'privacy-policy') {
    return (
      <div>
        <PrivacyPolicyPage
          cartCount={cartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onAccountClick={() => setCurrentPage('account')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          favoritesCount={likedProducts.size}
          onPrivacyPolicyClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onTermsClick={() => setCurrentPage('terms-and-conditions')}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Terms and Conditions Page
  if (currentPage === 'terms-and-conditions') {
    return (
      <div>
        <TermsAndConditionsPage
          cartCount={cartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onAccountClick={() => setCurrentPage('account')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          favoritesCount={likedProducts.size}
          onPrivacyPolicyClick={() => setCurrentPage('privacy-policy')}
          onTermsClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render All Products Page
  if (currentPage === 'all-products') {
    return (
      <div>
        <AllProductsPage
          cartCount={cartCount}
          onCartCountChange={setCartCount}
          onBackToHome={() => setCurrentPage('home')}
          onCartClick={() => setCurrentPage('cart')}
          onBrandClick={() => setCurrentPage('brands')}
          onBuyingGuideClick={() => setCurrentPage('buying-guide')}
          onEventsClick={() => setCurrentPage('events')}
          onMembershipClick={() => setCurrentPage('membership')}
          onFreebiesClick={() => setCurrentPage('freebies')}
          onBestSellerClick={() => setCurrentPage('bestseller')}
          onClinicSetupClick={() => setCurrentPage('clinic-setup')}
          onFavoritesClick={() => setCurrentPage('favorites')}
          onOrdersClick={() => setCurrentPage('order-history')}
          onAccountClick={() => setCurrentPage('account')}
          likedProducts={likedProducts}
          onToggleLike={toggleLike}
          onProductClick={(productId: string | number) => {
            setSelectedProductId(productId);
            setCurrentPage('productdetailpage/[id]');
          }}
          favoritesCount={likedProducts.size}
        />
        <WhatsAppButton />
      </div>
    );
  }

  // Render Home Page
  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentPage="/"
        cartCount={cartCount}
        favoritesCount={likedProducts.size}
        onCartCountChange={setCartCount}
      />
      <main>
        <HeroBanner />
        <PromoBanner />
        <TopBrands onBrandClick={(brandId: string, name: string) => {
          router.push(`/allbrands?brandId=${brandId}`);
        }} />
        <TopCategories onCategoryClick={() => setCurrentPage('category-browse')} />
        <ProductGrid
          likedProducts={likedProducts}
          onToggleLike={toggleLike}
          onAddToCart={addToCart}
          onProductClick={(productId: string | number) => {
            router.push(`/productdetailpage/${productId}`);
          }}
        />
        <FeaturedProducts />
      </main>
      <WhatsAppButton />
    </div>
  );
}