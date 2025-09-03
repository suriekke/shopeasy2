import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Header } from "./components/Header";
import { CategoryNav } from "./components/CategoryNav";
import { ProductGrid } from "./components/ProductGrid";
import { Cart } from "./components/Cart";
import { LocationModal } from "./components/LocationModal";
import { SupportModal } from "./components/SupportModal";
import { CheckoutPage } from "./components/CheckoutPage";
import { OrderSuccessPage } from "./components/OrderSuccessPage";
import { ProfilePage } from "./components/ProfilePage";
import { WishlistPage } from "./components/WishlistPage";
import { OrderPage } from "./components/OrderPage";
import { RefundsPage } from "./components/RefundsPage";
import { GiftCardPage } from "./components/GiftCardPage";
import { SavedAddressesPage } from "./components/SavedAddressesPage";
import { RewardsPage } from "./components/RewardsPage";
import { PaymentManagementPage } from "./components/PaymentManagementPage";
import { SuggestProductsPage } from "./components/SuggestProductsPage";
import { NotificationsPage } from "./components/NotificationsPage";
import { GeneralInfoPage, InfoPage } from "./components/GeneralInfoPage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { Banner } from "./components/Banner";
import { Footer } from "./components/Footer";
import LoginModal from "./components/LoginModal";

import AnalyticsDashboard from "./components/AnalyticsDashboard";
import { AllCategoriesPage } from "./components/AllCategoriesPage";
import { supabase } from "./supabaseClient"; // ✅ import Supabase client
import axios from "axios"; // ✅ for calling backend API
import {
  CATEGORIES,
  PRODUCTS,
  SUB_CATEGORIES,
  ORDERS,
  REFUNDS,
  GIFT_CARDS,
  SAVED_ADDRESSES,
  REWARDS,
  PAYMENT_METHODS,
  NOTIFICATIONS,
} from "./constants";

import type {
  CartItem,
  View,
  Order,
  Refund,
  GiftCard,
  Address,
  Reward,
  PaymentMethod,
  Notification,
  Location,
  Product,
  UserProfile,
} from "./types";

// Format address -> location
const formatAddressToLocation = (address: Address): Location => ({
  address: `${address.type} - ${address.line1}, ${address.city}`,
  deliveryTime: "Delivering in 10 mins",
});

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<View>("HOME");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedInfoPageTitle, setSelectedInfoPageTitle] = useState<string>("");

  // Authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // OTP
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);


  // Cart / Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([6, 14]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const subCategoryScrollerRef = useRef<HTMLDivElement>(null);

  // Data
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [refunds, setRefunds] = useState<Refund[]>(REFUNDS);
  const [giftCards, setGiftCards] = useState<GiftCard[]>(GIFT_CARDS);
  const [savedAddresses, setSavedAddresses] =
    useState<Address[]>(SAVED_ADDRESSES);
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(PAYMENT_METHODS);
  const [notifications, setNotifications] =
    useState<Notification[]>(NOTIFICATIONS);
  const [location, setLocation] = useState<Location>({
    address: "Set your location",
    deliveryTime: "...",
  });
  const [lastPaymentMethod, setLastPaymentMethod] = useState("");

  // --- Derived ---
  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );
  const cartItemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const filteredProducts = useMemo(() => {
    let products = PRODUCTS;
    if (selectedCategory !== "All") {
      products = products.filter((p) => p.category === selectedCategory);
    }
    if (selectedSubCategory) {
      products = products.filter((p) => p.subCategory === selectedSubCategory);
    }
    if (searchQuery) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return products;
  }, [selectedCategory, selectedSubCategory, searchQuery]);

  // --- Auth Handlers ---

  const handleRequestOtp = async (phone: string) => {
    try {
      console.log("📱 Requesting OTP for phone:", phone);
      const res = await axios.post("http://localhost:5000/auth/send-otp", {
        phone,
      });
      console.log("📡 Send OTP response:", res.data);
      
      if (res.data.success) {
        console.log("✅ OTP sent successfully");
        return true;
      } else {
        console.log("❌ OTP send failed:", res.data.message);
        return false;
      }
    } catch (err) {
      console.error("❌ OTP request error", err);
      return false;
    }
  };

  const handleVerifyOtp = async (phone: string, otp: string) => {
    try {
      console.log("🔐 Verifying OTP for phone:", phone);
      const res = await axios.post("http://localhost:5000/auth/verify-otp", {
        phone,
        code: otp,
      });
      console.log("📡 Backend response:", res.data);
      
      if (res.data.success) {
        console.log("✅ OTP verification successful");
        
        // User data comes from backend
        const user = res.data.user;
        console.log("👤 User data:", user);
        
        setCurrentUser(user);
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        console.log("🎉 Login completed successfully");
        return true;
      } else {
        console.log("❌ OTP verification failed:", res.data.message);
        return false;
      }
    } catch (err) {
      console.error("❌ OTP verify error", err);
      return false;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCartItems([]);
    setView("HOME");
  };

  // --- Cart, Wishlist etc. (unchanged) ---
  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prevItems) => {
      if (prevItems.length === 0) setIsCartOpen(true);
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCartItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== productId)
        : prev.map((i) =>
            i.id === productId ? { ...i, quantity } : i
          )
    );
  };

  const handleToggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // --- UI Effects ---
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const checkScrollButtons = useCallback(() => {
    const el = subCategoryScrollerRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setShowLeftScroll(hasOverflow && el.scrollLeft > 0);
      setShowRightScroll(
        hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 1
      );
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const scroller = subCategoryScrollerRef.current;
    scroller?.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);
    return () => {
      scroller?.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [checkScrollButtons, filteredProducts]);

  // --- Render ---
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onLocationClick={() => setIsLocationModalOpen(true)}
        onSupportClick={() => setIsSupportModalOpen(true)}
        onProfileClick={() =>
          isLoggedIn ? setView("PROFILE") : setIsLoginModalOpen(true)
        }
        onHomeClick={() => setView("HOME")}

        onAnalyticsClick={() => setView("ANALYTICS")}
        cartItemCount={cartItemCount}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        location={location}
        isLoggedIn={isLoggedIn}
      />

      {/* Main content */}
      <div className="flex-grow">
        {view === "HOME" && (
          <>
            <CategoryNav
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <ProductGrid
              products={filteredProducts}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onProductSelect={(product) => {
                setSelectedProduct(product);
                setView("PRODUCT_DETAIL");
              }}
            />
          </>
        )}

        {view === "PRODUCT_DETAIL" && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            quantityInCart={
              cartItems.find((item) => item.id === selectedProduct.id)?.quantity || 0
            }
            isWishlisted={wishlist.includes(selectedProduct.id)}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleWishlist={handleToggleWishlist}
            onBack={() => setView("HOME")}
          />
        )}

        {view === "PROFILE" && (
          <ProfilePage
            user={currentUser}
            onUpdateUser={setCurrentUser}
            setView={setView}
            onOpenSupport={() => setIsSupportModalOpen(true)}
            onLogout={handleLogout}
          />
        )}


        {view === "ANALYTICS" && (
          <AnalyticsDashboard />
        )}

        {view === "CHECKOUT" && (
          <CheckoutPage
            cartItems={cartItems}
            total={cartTotal}
            setView={setView}
            location={location}
            onLocationChange={setLocation}
            savedAddresses={savedAddresses}
            onSelectAddress={(address) => setLocation(formatAddressToLocation(address))}
            onOrderPlaced={(paymentMethod) => {
              setLastPaymentMethod(paymentMethod);
              setView("ORDER_SUCCESS");
            }}
          />
        )}

        {view === "ORDER_SUCCESS" && (
          <OrderSuccessPage
            setView={setView}
            paymentMethod={lastPaymentMethod}
          />
        )}

        {view === "WISHLIST" && (
          <WishlistPage
            wishlist={wishlist}
            products={PRODUCTS}
            onProductSelect={(product) => {
              setSelectedProduct(product);
              setView("PRODUCT_DETAIL");
            }}
            setView={setView}
          />
        )}

        {view === "ORDERS" && (
          <OrderPage
            orders={orders}
            setView={setView}
            onCancelOrder={(orderId) => {
              setOrders(prev => prev.map(order => 
                order.id === orderId ? { ...order, status: "Cancelled" } : order
              ));
            }}
            onOpenSupport={() => setIsSupportModalOpen(true)}
          />
        )}

        {view === "REFUNDS" && (
          <RefundsPage
            refunds={refunds}
            setView={setView}
          />
        )}

        {view === "GIFT_CARDS" && (
          <GiftCardPage
            giftCards={giftCards}
            setView={setView}
            onAddGiftCard={(giftCard) => {
              setGiftCards(prev => [...prev, giftCard]);
            }}
          />
        )}

        {view === "SAVED_ADDRESSES" && (
          <SavedAddressesPage
            addresses={savedAddresses}
            setView={setView}
            onAddAddress={(address) => {
              setSavedAddresses(prev => [...prev, address]);
            }}
            onRemoveAddress={(addressId) => {
              setSavedAddresses(prev => prev.filter(addr => addr.id !== addressId));
            }}
          />
        )}

        {view === "REWARDS" && (
          <RewardsPage
            rewards={REWARDS}
            setView={setView}
          />
        )}

        {view === "PAYMENT_MANAGEMENT" && (
          <PaymentManagementPage
            methods={paymentMethods}
            setView={setView}
            onAddMethod={(method) => {
              setPaymentMethods(prev => [...prev, method]);
            }}
            onRemoveMethod={(methodId) => {
              setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
            }}
          />
        )}

        {view === "SUGGEST_PRODUCTS" && (
          <SuggestProductsPage
            setView={setView}
          />
        )}

        {view === "NOTIFICATIONS" && (
          <NotificationsPage
            notifications={notifications}
            setView={setView}
          />
        )}

        {view === "ALL_CATEGORIES" && (
          <AllCategoriesPage />
        )}

        {view === "GENERAL_INFO" && (
          <GeneralInfoPage
            setView={setView}
            onNavigateToInfo={(title) => {
              setSelectedInfoPageTitle(title);
              setView("INFO_PAGE");
            }}
          />
        )}

        {view === "INFO_PAGE" && (
          <InfoPage
            title={selectedInfoPageTitle}
            setView={setView}
          />
        )}


      </div>

      <Footer onCategorySelect={(sub) => setSelectedSubCategory(sub)} />

      {/* Modals */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        total={cartTotal}
        onCheckout={() => {
          setIsCartOpen(false);
          setView("CHECKOUT");
        }}
      />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSetLocation={(location) => {
          setLocation(location);
          setIsLocationModalOpen(false);
        }}
        savedAddresses={savedAddresses}
      />
      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={() => setIsSupportModalOpen(false)} 
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onRequestOtp={handleRequestOtp}
        onVerifyOtp={handleVerifyOtp}
      />
    </div>
  );
};

export default App;

