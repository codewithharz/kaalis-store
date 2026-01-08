import {
  PackageOpen,
  Wallet,
  User,
  Box,
  Star,
  Heart,
  Store,
  HelpCircle
} from 'lucide-vue-next';

export const menuItems = [
  { label: "My Orders", link: "/account/orders", icon: PackageOpen },
  { label: "My Clues Bucks", link: "/account/clues-bucks", icon: Wallet },
  { label: "My Clues Bucks*", link: "/account/clues-bucks", icon: Wallet },
  { label: "My Profile", link: "/account/profile", icon: User },
  { label: "My Products", link: "/account/my-products", icon: Box },
  { label: "Rate Your Purchase", link: "/account/rate-purchase", icon: Star },
  { label: "My Wishlist", link: "/account/wishlist", icon: Heart },
  { label: "My Favorite Stores", link: "/account/favorites", icon: Store },
  { label: "Bank Details", link: "/account/profile/bank-details", icon: Wallet },
  { label: "Help & Support", link: "/account/help-and-support", icon: HelpCircle },
];