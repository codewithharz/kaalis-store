// frontend/src/routes/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useCartStore } from "../store/cart";
import { useUserStore } from "../store/user";
import { useAdminStore } from "../store/admin";

// Core Views
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import NotFound from "../views/NotFound.vue";
import ProductDetails from "../views/ProductDetails.vue";
import CategoryProducts from "../views/CategoryProducts.vue";
import Search from "../views/Search.vue";
import CartPage from "../views/CartPage.vue";
import CheckoutPage from "../views/CheckoutPage.vue";

// Account Related Views
import MyAccount from "../views/MyAccount.vue";
import MyOrders from "../views/MyOrders.vue";
import OrdersList from "../views/OrdersList.vue";
import MyCluesBucks from "../views/MyCluesBucks.vue";
import MyProfile from "../views/MyProfile.vue";
import MyRatePurchase from "../views/MyRatePurchase.vue";
import HelpAndSupport from "../views/HelpAndSupport.vue";
import MyFavorites from "../views/MyFavorites.vue";
import MyWishlist from "../views/MyWishlist.vue";
import UserProfile from "../views/UserProfile.vue";

// Profile Related Components
import ProfileUserCard from "../views/ProfileUserCard.vue";
import ProfileAddressBookCard from "../views/ProfileAddressBookCard.vue";
import ProfileBankDetailsCard from "../views/ProfileBankDetailsCard.vue";
import ProfileChangePasswordCard from "../views/ProfileChangePasswordCard.vue";
import ProfileManagePaymentCard from "../views/ProfileManagePaymentCard.vue";
import ProfileOrderCard from "../views/ProfileOrderCard.vue";
import ProfileReturnCard from "../views/ProfileReturnCard.vue";

// Review Related Components
import ReviewsCard from "../views/ReviewsCard.vue";
import SellerReviews from "../views/SellerReviews.vue";
import PendingReviewCard from "../views/PendingReviewCard.vue";

// Order Related Components
import OrderConfirmation from "../views/OrderConfirmation.vue";
import OrderHistory from "../views/OrderHistory.vue";

// Auth Related Views
import RequestPasswordReset from "../views/RequestPasswordReset.vue";
import ResetPassword from "../views/ResetPassword.vue";
import UserProducts from "../views/UserProducts.vue";

// Seller Related Views
import BecomeSellerForm from "../views/BecomeSellerForm.vue";
import SellerStore from "../views/SellerStore.vue";
import SellerHome from "../views/SellerHome.vue";
import SellerProducts from "../views/SellerProducts.vue";
import SellerProfile from "../views/SellerProfile.vue";
import SellerOrders from "../views/SellerOrders.vue";
import UserSellerDashboard from "../views/UserSellerDashboard.vue";
import AddProduct from "../views/AddProduct.vue";
import ManagePromotions from "../views/ManagePromotions.vue";
import SellerAnalytics from "../views/SellerAnalytics.vue";
import SellerManageOrders from "../views/SellerManageOrders.vue";
import DownloadReports from "../views/DownloadReports.vue";
import ManageOrderDetails from "../views/ManageOrderDetails.vue";

// Payment Related Views
import PaymentSuccess from "../views/PaymentSuccess.vue";
import PaymentCallback from "../views/PaymentCallback.vue";

// Page Related Views
import WhoWeArePage from "../views/pages/WhoWeArePage.vue";
import Communication from "../views/pages/Communication.vue";
import Security from "../views/pages/Security.vue";
import ProtectionOfPersonalData from "../views/pages/ProtectionOfPersonalData.vue";
import MembershipAgreement from "../views/pages/MembershipAgreement.vue";
import CookiePolicy from "../views/pages/CookiePolicy.vue";
import CommunicationInformationText from "../views/pages/CommunicationInformationText.vue";
import TermsOfUse from "../views/pages/TermsOfUse.vue";
import TransactionGuide from "../views/pages/TransactionGuide.vue";
import BusinessPartnership from "../views/pages/BusinessPartnership.vue";
import CareerPage from "../views/pages/CareerPage.vue";
import CareerSustainability from "../views/pages/CareerSustainability.vue";

// Campaign Related Views
import ShoppingCredit from "../views/pages/campaigns/ShoppingCredit.vue";
import Campaigns from "../views/pages/campaigns/Campaigns.vue";
import EliteMembership from "../views/pages/campaigns/EliteMembership.vue";
import GiftIdeas from "../views/pages/campaigns/GiftIdeas.vue";

// Help Related Views
import LiveHelp from "../views/pages/help/LiveHelp.vue";
import HowToReturn from "../views/pages/help/HowToReturn.vue";
import FAQ from "../views/pages/help/FAQ.vue";
import TransactionGuideHelp from "../views/pages/help/TransactionGuideHelp.vue";

// Seller Support Views
import BasicConcepts from "../views/pages/seller/BasicConcepts.vue";
import BrutholAcademy from "../views/pages/seller/BrutholAcademy.vue";
import ContactSeller from "../views/ContactSeller.vue";
import MessageDetails from "../views/MessageDetails.vue";

// Admin Related Views
import AdminLogin from "../views/admin/AdminLogin.vue";
import AdminLayout from "../views/admin/layout/AdminLayout.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminUsers from "../views/admin/AdminUsers.vue";
import AdminSellers from "../views/admin/AdminSellers.vue";
import AdminProducts from "../views/admin/AdminProducts.vue";
import AdminCategories from "../views/admin/AdminCategories.vue";
import AdminOrders from "../views/admin/AdminOrders.vue";
import AdminPayments from "../views/admin/AdminPayments.vue";
import AdminSettings from "../views/admin/AdminSettings.vue";
import AdminPasswordReset from "../views/admin/AdminPasswordReset.vue";

const adminRoutes = [
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
    meta: { requiresAdmin: false }, // Allow access to login page
    // beforeEnter: (to, from, next) => {
    //   const adminStore = useAdminStore();
    //   if (adminStore.isAdminLoggedIn) {
    //     next({ name: "AdminDashboard" });
    //   } else {
    //     next();
    //   }
    // },
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAdmin: true },
    beforeEnter: (to, from, next) => {
      const adminStore = useAdminStore();
      if (!adminStore.isAdminLoggedIn) {
        next({
          name: "AdminLogin",
          query: { redirect: to.fullPath },
        });
      } else {
        next();
      }
    },
    children: [
      {
        path: "",
        redirect: { name: "AdminDashboard" },
      },
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: AdminDashboard,
      },
      {
        path: "users",
        name: "AdminUsers",
        component: AdminUsers,
      },
      {
        path: "sellers",
        name: "AdminSellers",
        component: AdminSellers,
      },
      {
        path: "products",
        name: "AdminProducts",
        component: AdminProducts,
      },
      {
        path: "categories",
        name: "AdminCategories",
        component: AdminCategories,
      },
      {
        path: "orders",
        name: "AdminOrders",
        component: AdminOrders,
      },
      {
        path: "payments",
        name: "AdminPayments",
        component: AdminPayments,
      },
      {
        path: "settings",
        name: "AdminSettings",
        component: AdminSettings,
      },
      {
        path: "password-reset",
        name: "AdminPasswordReset",
        component: AdminPasswordReset,
      },
      // Add other admin routes...
    ],
  },
];

const routes = [
  {
    path: "/verify-email/:token",
    name: "VerifyEmail",
    component: () => import("../views/EmailVerified.vue"),
  },
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },

  // Main product route (for public viewing)
  {
    path: "/product/:id",
    name: "ProductDetails",
    component: ProductDetails,
    props: true,
  },

  {
    path: "/account",
    component: MyAccount,
    meta: { requiresAuth: true },
    children: [
      {
        path: "orders",
        component: MyOrders,
        children: [
          { path: "", component: OrdersList },
          { path: "profile-order", component: ProfileOrderCard },
          { path: "profile-returns", component: ProfileReturnCard },
        ],
      },
      { path: "clues-bucks", component: MyCluesBucks },
      {
        path: "profile",
        component: MyProfile,
        children: [
          // { path: "", redirect: "profile/profile-user" },
          { path: "", component: ProfileUserCard },
          { path: "address-book", component: ProfileAddressBookCard },
          { path: "bank-details", component: ProfileBankDetailsCard },
          { path: "my-products", component: UserProducts },
          { path: "change-password", component: ProfileChangePasswordCard },
          { path: "manage-payment", component: ProfileManagePaymentCard },
          // {
          //   path: "/product/:id",
          //   name: "UserProductDetails",
          //   component: ProductDetails,
          //   props: true,
          // }, // New product details route
          {
            path: "add-product",
            name: "AddProduct",
            component: AddProduct,
            meta: { requiresAuth: true, requiresSeller: true },
            props: (route) => ({
              fromDashboard: route.query.from === "dashboard",
            }), // Pass a prop to the component UserSellerDashboard.vue
          },
          {
            path: "/seller/promotions",
            name: "ManagePromotions",
            component: ManagePromotions,
            meta: { requiresAuth: true, requiresSeller: true },
          },
          {
            path: "/seller/analytics",
            name: "SellerAnalytics",
            component: SellerAnalytics,
            meta: {
              requiresAuth: true,
              isSeller: true,
            },
          },
          {
            path: "/seller/manage-orders",
            name: "SellerManageOrders",
            component: SellerManageOrders,
            meta: {
              requiresAuth: true,
              isSeller: true,
            },
          },
          {
            path: "/seller/orders/:id",
            name: "ManageOrderDetails", // Keep your existing route name
            component: ManageOrderDetails, // Update to point to the correct component
            meta: {
              requiresAuth: true,
              isSeller: true,
            },
            props: true,
          },
          {
            path: "/seller/reports",
            name: "DownloadReports",
            component: DownloadReports,
            meta: {
              requiresAuth: true,
              isSeller: true,
            },
          },
          {
            path: "/seller/orders",
            name: "SellerOrders",
            component: SellerOrders,
            meta: { requiresAuth: true, requiresSeller: true },
          },
        ],
      },
      {
        path: "my-products",
        component: UserProducts,
      },
      // {
      //   path: "/product/:id",
      //   name: "UserProductDetails",
      //   component: ProductDetails,
      //   props: true,
      // }, // New product details route

      {
        path: "rate-purchase",
        component: MyRatePurchase,
        children: [
          { path: "", component: ReviewsCard },
          { path: "pending-reviews", component: PendingReviewCard },
        ],
      },
      { path: "help-and-support", component: HelpAndSupport },
      { path: "favorites", component: MyFavorites },
      { path: "wishlist", component: MyWishlist },
      {
        path: "seller-dashboard",
        name: "UserSellerDashboard",
        component: UserSellerDashboard,
        meta: { requiresAuth: true, requiresSeller: true },
      },
    ],
  },
  { path: "/user-profile", component: UserProfile },
  {
    path: "/product/:id",
    name: "ProductDetails",
    component: ProductDetails,
    props: true,
  }, // New product details route
  { path: "/request-password-reset", component: RequestPasswordReset }, // Route for requesting a password reset
  { path: "/reset-password/:token", component: ResetPassword }, // Route for resetting password
  {
    path: "/seller-store/:id",
    name: "SellerStore",
    component: SellerStore,
    props: true, // This allows route params to be passed as props to the component
    children: [
      {
        path: "home",
        name: "SellerHome",
        component: SellerHome,
        props: true,
      },
      {
        path: "products",
        name: "SellerProducts",
        component: SellerProducts,
        props: true,
      },
      {
        path: "profile",
        name: "SellerProfile",
        component: SellerProfile,
        props: true,
      },
    ],
  },
  {
    path: "/become-seller",
    name: "BecomeSeller",
    component: BecomeSellerForm,
    meta: { requiresAuth: true },
  },

  {
    path: "/cart",
    name: "Cart",
    component: CartPage,
    meta: { requiresAuth: true }, // Add this if you want the cart to be accessible only to authenticated users
  },

  {
    path: "/checkout",
    name: "Checkout",
    component: CheckoutPage,
    meta: { requiresAuth: true }, // Add this if you want the cart to be accessible only to authenticated users
  },

  {
    path: "/payment/success/:reference/:orderId",
    name: "PaymentSuccess",
    component: PaymentSuccess,
    meta: { requiresAuth: true },
    props: true,
  },

  {
    path: "/payment/callback",
    name: "PaymentCallback",
    component: PaymentCallback,
    meta: { requiresAuth: true },
  },

  {
    path: "/order-confirmation/:orderId",
    name: "OrderConfirmation",
    component: OrderConfirmation,
    meta: { requiresAuth: true },
  },

  {
    path: "/seller/:sellerId/reviews",
    name: "SellerReviews",
    component: SellerReviews, // You'll need to create this component
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: "/order-history",
    name: "OrderHistory",
    component: OrderHistory,
    meta: { requiresAuth: true },
  },

  {
    path: "/category/:categorySlug",
    name: "CategoryProducts",
    component: CategoryProducts,
    props: true,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
    props: (route) => ({ query: route.query.q }),
  },

  {
    path: "/page/who-we-are",
    name: "WhoWeArePage",
    component: WhoWeArePage,
    props: true,
  },

  {
    path: "/page/communication",
    name: "Communication",
    component: Communication,
    props: true,
  },

  {
    path: "/page/security",
    name: "Security",
    component: Security,
    props: true,
  },
  {
    path: "/page/protection-of-personal-data",
    name: "ProtectionOfPersonalData",
    component: ProtectionOfPersonalData,
    props: true,
  },
  {
    path: "/page/membership-agreement",
    name: "MembershipAgreement",
    component: MembershipAgreement,
    props: true,
  },
  {
    path: "/page/cookie-policy",
    name: "CookiePolicy",
    component: CookiePolicy,
    props: true,
  },
  {
    path: "/page/communication-information-text",
    name: "CommunicationInformationText",
    component: CommunicationInformationText,
    props: true,
  },
  {
    path: "/page/terms-of-use",
    name: "TermsOfUse",
    component: TermsOfUse,
    props: true,
  },
  {
    path: "/page/transaction-guide",
    name: "TransactionGuide",
    component: TransactionGuide,
    props: true,
  },
  {
    path: "/page/business-partnership",
    name: "BusinessPartnership",
    component: BusinessPartnership,
    props: true,
  },

  {
    path: "/page/career-page",
    name: "CareerPage",
    component: CareerPage,
    props: true,
  },

  {
    path: "/page/career-sustainability",
    name: "CareerSustainability",
    component: CareerSustainability,
    props: true,
  },

  {
    path: "/page/campaigns/shopping-credit",
    name: "ShoppingCredit",
    component: ShoppingCredit,
    props: true,
  },

  {
    path: "/page/campaigns",
    name: "Campaigns",
    component: Campaigns,
    props: true,
  },

  {
    path: "/page/campaigns/elite-membership",
    name: "EliteMembership",
    component: EliteMembership,
    props: true,
  },

  {
    path: "/page/campaigns/gift-ideas",
    name: "GiftIdeas",
    component: GiftIdeas,
    props: true,
  },

  {
    path: "/page/help/live-help",
    name: "LiveHelp",
    component: LiveHelp,
    props: true,
  },

  {
    path: "/page/help/how-to-return",
    name: "HowToReturn",
    component: HowToReturn,
    props: true,
  },

  {
    path: "/page/help/frequently-asked-questions",
    name: "FAQ",
    component: FAQ,
    props: true,
  },

  {
    path: "/page/help/transaction-guide-help",
    name: "TransactionGuideHelp",
    component: TransactionGuideHelp,
    props: true,
  },

  {
    path: "/page/seller/basic-concepts",
    name: "BasicConcepts",
    component: BasicConcepts,
    props: true,
  },

  {
    path: "/page/seller/bruthol-academy",
    name: "BrutholAcademy",
    component: BrutholAcademy,
    props: true,
  },

  {
    path: "/seller/:sellerId/contact",
    name: "ContactSeller",
    component: ContactSeller,
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: "/messages/:messageId",
    name: "MessageDetails",
    component: MessageDetails,
    meta: { requiresAuth: true },
    props: true,
  },

  ...adminRoutes, // Add the admin routes to the main routes array
  // Catch-all route for 404
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // scroll behavior to the top
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  console.log(`Navigating to: ${to.fullPath}`);
  const userStore = useUserStore();
  const adminStore = useAdminStore();

  // IMPORTANT: Allow email verification route without authentication
  if (to.name === "VerifyEmail") {
    console.log("Accessing email verification page - bypassing auth check");
    next();
    return;
  }

  const isTokenValid = userStore.checkTokenExpiration();
  console.log("Is token valid?", isTokenValid);

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresSeller = to.matched.some(
    (record) => record.meta.requiresSeller
  );

  console.log("Requires auth?", requiresAuth);
  console.log("Requires seller?", requiresSeller);

  // Check for admin routes first
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    // Skip token check for admin login page
    if (to.name === "AdminLogin") {
      next();
      return;
    }

    // Check admin authentication
    if (!adminStore.isAdminLoggedIn) {
      next({
        name: "AdminLogin",
        query: { redirect: to.fullPath },
      });
      return;
    }

    // Admin is authenticated, proceed
    next();
    return;
  }

  // Add special handling for checkout route
  if (to.name === "Checkout") {
    // First check authentication
    if (!isTokenValid) {
      console.log(
        "Authentication required for checkout. Redirecting to login."
      );
      next({ name: "Login", query: { redirect: to.fullPath } });
      return;
    }

    // Then check if cart is empty
    const cartStore = useCartStore();
    try {
      await cartStore.fetchCart(); // Ensure cart is up to date
      if (!cartStore.items?.length) {
        console.log("Cart is empty. Redirecting to cart page.");
        next({ name: "Cart" });
        return;
      }
      next(); // Proceed to checkout if cart has items
    } catch (error) {
      console.error("Error checking cart:", error);
      next({ name: "Cart" });
      return;
    }
  }

  if (requiresAuth && !isTokenValid) {
    console.log("Authentication required. Redirecting to login.");
    next("/login");
  } else if (requiresSeller && !userStore.isSeller) {
    console.log(
      "Seller privileges required. Redirecting to become-seller page."
    );
    next("/become-seller");
  } else {
    next();
  }
});

export default router;
