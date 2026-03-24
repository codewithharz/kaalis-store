# Internationalization Progress

## Status

Phase 1 foundation for frontend internationalization is complete.
Phase 2 core customer flow translation is in progress.

Implemented on: 2026-03-22

## What Was Added

- `vue-i18n` added to the frontend dependencies.
- Shared i18n bootstrap added to the Vue app entry.
- Separate persisted language store introduced.
- English and French locale files created.
- Shared account navigation labels converted from hardcoded text to translation keys.
- Shared `Navbar`, `Footer`, and country modal updated to use translations.
- Country and language kept as separate concerns.

## New Files

- `frontend/src/i18n/index.js`
- `frontend/src/i18n/locales/en.js`
- `frontend/src/i18n/locales/fr.js`
- `frontend/src/store/languageStore.js`

## Updated Files

- `frontend/package.json`
- `frontend/src/main.js`
- `frontend/src/utils/menuItems.js`
- `frontend/src/utils/orderItems.js`
- `frontend/src/utils/profileItems.js`
- `frontend/src/utils/rateReviewItems.js`
- `frontend/src/views/CountrySelectionModal.vue`
- `frontend/src/views/Footer.vue`
- `frontend/src/views/Navbar.vue`
- `frontend/src/views/OrderHeader.vue`
- `frontend/src/views/ProfileHeader.vue`
- `frontend/src/views/RatePurchaseHeader.vue`
- `frontend/src/views/Sidebar.vue`
- `frontend/src/views/Login.vue`
- `frontend/src/views/Register.vue`
- `frontend/src/views/Search.vue`
- `frontend/src/views/CartPage.vue`
- `frontend/src/views/CheckoutPage.vue`
- `frontend/src/i18n/locales/en.js`
- `frontend/src/i18n/locales/fr.js`

## Phase 1 Coverage

The following areas now use the i18n foundation:

- App bootstrap and locale registration
- Persisted language preference
- Shared account navigation labels
- Shared navbar text
- Shared footer text
- Country selection modal text
- Language switching from the shared modal

## Notes

- The app still contains many hardcoded English strings outside the shared UI.
- Routes, backend payloads, and business logic were not translated in Phase 1.
- The current implementation is structured so future languages can be added by:
  1. Adding a new locale file
  2. Registering it in `frontend/src/i18n/index.js`
  3. Adding it to the supported locale list

## Verification

- Frontend production build completed successfully with `npm run build`.

## Suggested Phase 2 Scope

Recommended next translation batch:

- `Home.vue`
- Core product browsing flow
- Product detail flow
- Order and account detail pages
- Help and support pages

## Phase 2 Progress

Completed in this batch:

- `Login.vue`
- `Register.vue`
- `Search.vue`
- `CartPage.vue`
- `CheckoutPage.vue`
- `ProductList.vue`
- `ProductCard.vue`
- `CategoryProducts.vue`
- `ProductDetails.vue`
- `MyAccount.vue`
- `MyOrders.vue`
- `OrdersList.vue`
- `HelpAndSupport.vue`
- `ProfileAddressBookCard.vue`
- `ProfileChangePasswordCard.vue`
- `ProfileOrderCard.vue`
- `MyWishlist.vue`
- `ProfileReturnCard.vue`
- `MyFavorites.vue`
- `WishlistDetail.vue`
- `ProfileBankDetailsCard.vue`
- `ProfileManagePaymentCard.vue`
- `PendingReviewCard.vue`
- `ReviewsCard.vue`
- `UserProfileCard.vue`
- `SellerReviews.vue`
- `RequestPasswordReset.vue`
- `ResetPassword.vue`
- `ChangePassword.vue`
- `OrderConfirmation.vue`
- `pages/help/FAQ.vue`
- `pages/help/HowToReturn.vue`
- `pages/help/LiveHelp.vue`
- `pages/help/TransactionGuideHelp.vue`
- `UserProfile.vue`
- `ReviewSection.vue`
- `pages/Communication.vue`
- `pages/CookiePolicy.vue`
- `pages/TermsOfUse.vue`
- `pages/ProtectionOfPersonalData.vue`
- `pages/MembershipAgreement.vue`
- `pages/Security.vue`
- `pages/CareerPage.vue`
- `pages/CareerSustainability.vue`
- `pages/BusinessPartnership.vue`
- `pages/WhoWeArePage.vue`
- `pages/components/whoWeAre/CompanyValues.vue`
- `pages/campaigns/Campaigns.vue`
- `pages/campaigns/ShoppingCredit.vue`
- `pages/campaigns/EliteMembership.vue`
- `pages/campaigns/GiftIdeas.vue`
- `pages/CommunicationInformationText.vue`
- `pages/TransactionGuide.vue`
- `pages/TwoFactorSettings.vue`
- `pages/seller/BasicConcepts.vue`
- `pages/seller/BrutholAcademy.vue`
- `pages/components/community/SidebarNavigation.vue`
- `pages/components/career/CareerProgramCard.vue`
- `pages/components/career/CareerJobCard.vue`
- `pages/components/sustainability/GoalProgress.vue`
- `pages/components/campaigns/MembershipTierCard.vue`
- `pages/components/campaigns/PromotionCard.vue`
- `pages/components/campaigns/GuideCard.vue`
- `pages/components/campaigns/GiftCard.vue`
- `pages/components/campaigns/ServiceCard.vue`
- `pages/PaymentCallback.vue`
- `RelatedProducts.vue`
- `Categories.vue`
- `PaymentSuccess.vue`
- `ContactSeller.vue`
- `EmailVerified.vue`
- `NotFound.vue`
- `SizeSelector.vue`
- `MyCluesBucks.vue`
- `OrderDetails.vue`
- `OrderHistory.vue`
- `ManageOrderDetails.vue`
- `OrderTimeline.vue`
- `SellerHome.vue`
- `SellerProfile.vue`
- `ManagePromotions.vue`
- `UpdateOrderStatus.vue`
- `SellerOrders.vue`
- `SellerProducts.vue`
- `BecomeSellerForm.vue`
- `SellerStoreHeader.vue`
- `utils/sellerItems.js`
- `UserSellerDashboard.vue`
- `SellerAnalytics.vue`
- `EditSellerProfile.vue`
- `UpdateInventory.vue`
- `SellerManageOrders.vue`
- `OrderAnalytics.vue`
- `ProductCardOld.vue`
- `DownloadReports.vue`
- `ReportViewer.vue`
- `VendorPaymentSetup.vue`
- `UserProducts.vue`
- `AddProduct.vue`
- `EditProductForm.vue`
- `EditWishlistProductModal.vue`
- `MessageDetails.vue`
- `EnhancedCategorySection.vue`
- `HierarchicalCategorySelector.vue`
- `AddressCard.vue`
- `PaymentCallback.vue`
- `TermsOfUse.vue`
- `pages/components/campaigns/OccasionCard.vue`
- `ProductDetails.vue` (residual shopper-facing copy cleanup)
- `admin/layout/AdminLayout.vue`
- `admin/AdminLogin.vue`
- `admin/AdminDashboard.vue`
- `admin/AdminCategories.vue`
- `admin/components/CategoryTreeItem.vue`
- `admin/AdminUsers.vue`
- `admin/AdminSellers.vue`
- `admin/AdminOrders.vue`
- `admin/AdminPayments.vue`
- `admin/components/OrderDetailsModal.vue`
- `admin/components/TimePeriodSelector.vue`
- `admin/charts/RevenueChart.vue`
- `admin/charts/StatsChart.vue`
- `admin/AdminProducts.vue`
- `admin/AdminSettings.vue`
- `admin/AdminPasswordReset.vue`
- `components/ui/breadcrumb/BreadcrumbEllipsis.vue`
- `components/ui/carousel/CarouselPrevious.vue`
- `components/ui/carousel/CarouselNext.vue`
- `components/ui/dialog/DialogContent.vue`
- `components/ui/dialog/DialogScrollContent.vue`

What was added in this batch:

- Auth page translations
- Search page translations
- Cart page translations
- Checkout page translations
- Product browsing flow translations
- Product detail core labels and toast translations
- Account shell translations
- Orders dashboard and filter translations
- Help and support page translations
- Additional English and French locale keys for auth, search, cart, and checkout flows
- Additional English and French locale keys for product listing, category browsing, product cards, and product details
- Additional English and French locale keys for account shell, orders pages, and help pages
- Additional English and French locale keys for profile address book and security settings
- Additional English and French locale keys for admin orders, payments, order details modal, and admin chart helpers
- Additional English and French locale keys for admin products, settings, and password reset flows
- Final residual English cleanup for navbar notifications, admin payment/settings labels, and shared accessibility UI copy
- Additional English and French locale keys for order cards, status labels, tracking, receipts, and rating modals
- Additional English and French locale keys for wishlist and returns flows
- Additional English and French locale keys for favorite stores and wishlist detail views
- Additional English and French locale keys for bank details, payout schedule, and bank verification flows
- Additional English and French locale keys for payment methods, transactions, card validation, and card management flows
- Additional English and French locale keys for pending reviews, submitted reviews, and review feedback flows
- Additional English and French locale keys for profile settings and seller review pages
- Additional English and French locale keys for password recovery, password change, and order confirmation flows
- Additional English and French locale keys for FAQ, returns help, live support, and transaction guide help pages
- Additional English and French locale keys for the legacy user profile screen and shared product review section
- Additional English and French locale keys for public communication, cookie policy, and terms of use pages
- Additional English and French locale keys for personal data protection, membership agreement, and public security information pages
- Additional English and French locale keys for career, sustainability, and business partnership pages
- Additional English and French locale keys for the Who We Are page and its company values component
- Additional English and French locale keys for campaign landing, shopping credit, elite membership, and gift ideas pages
- Additional English and French locale keys for communication information, transaction guide overview, and two-factor settings pages
- Additional English and French locale keys for seller basic concepts and Bruthol Academy pages
- Additional English and French locale keys for shared page-component navigation, reusable campaign CTAs, and shared career/sustainability card labels
- Additional English and French locale keys for the payment callback verification flow
- Additional English and French locale keys for related products, category navigation labels, and the payment success redirect flow
- Additional English and French locale keys for contact seller, email verification, not-found, and size selector utility flows
- Additional English and French locale keys for the CluesBucks balance, redemption, offers, and transaction history dashboard
- Additional English and French locale keys for the order details modal, timeline, and action controls
- Additional English and French locale keys for order history and its rating modal flow
- Additional English and French locale keys for legacy order analytics charts and legacy product card copy
- Additional English and French locale keys for report downloads, report preview metrics, vendor payout setup, and seller product management
- Additional English and French locale keys for product creation and the basic product edit form
- Additional English and French locale keys for the advanced product edit modal and its upload/update flows
- Additional English and French locale keys for message details, category helper UI, and address card actions
- Additional English and French locale keys for residual address-book labels and shared campaign CTA copy
- Additional English and French locale keys for residual product-detail promo, seller, stock, and delivery labels
- Additional English and French locale keys for residual product-detail social-proof messaging
- Additional English and French locale keys for printable order-receipt company header copy
- Additional English and French locale keys for printable order-receipt SKU labels
- Additional English and French locale keys for printable order-receipt accessibility labels
- Additional English and French locale keys for residual public-page social labels and payment-brand labels
- Additional English and French locale keys for the admin shell navigation and admin login flow
- Additional English and French locale keys for the admin dashboard, category management, and category tree helper
- Additional English and French locale keys for admin users and seller management flows
- Additional English and French locale keys for the legacy payment callback route and legacy terms of use page
- Additional English and French locale keys for seller order management details and the order timeline component
- Additional English and French locale keys for public seller home and seller profile storefront pages
- Additional English and French locale keys for seller storefront loading-error and unknown-product fallbacks
- Additional English and French locale keys for promotion management and order-status update modal flows
- Additional English and French locale keys for seller orders dashboard and seller product browsing/filter flows
- Additional English and French locale keys for seller onboarding form, seller store header, and shared seller navigation labels
- Additional English and French locale keys for the seller dashboard shell, quick actions, sales performance, and seller onboarding state
- Additional English and French locale keys for the seller analytics dashboard, date-range filters, charts, and analytics status labels
- Additional English and French locale keys for seller profile editing and inventory management flows
- Additional English and French locale keys for the seller manage-orders dashboard, filters, table actions, and pagination flow

Additional note:

- `Home.vue` was reviewed and did not require translation changes because it currently only renders `ProductList.vue`, which is already localized.

Verification:

- Frontend production build completed successfully again with `npm run build`.
