import {
  PackageOpen,
  Wallet,
  User,
  Box,
  Star,
  Heart,
  Store,
  HelpCircle,
} from "lucide-vue-next";
import { getAccountNavItem } from "./profileItems";

export const getMenuItems = ({ user, isXofCountry }) => {
  const accountNavItem = getAccountNavItem({ user, isXofCountry });

  return [
    { labelKey: "account.myOrders", link: "/account/orders", icon: PackageOpen },
    { labelKey: "account.myCluesBucks", link: "/account/clues-bucks", icon: Wallet },
    { labelKey: "account.myProfile", link: "/account/profile", icon: User },
    { labelKey: "account.myProducts", link: "/account/my-products", icon: Box },
    { labelKey: "account.rateYourPurchase", link: "/account/rate-purchase", icon: Star },
    { labelKey: "account.myWishlist", link: "/account/wishlist", icon: Heart },
    { labelKey: "account.myFavoriteStores", link: "/account/favorites", icon: Store },
    { labelKey: accountNavItem.labelKey, link: accountNavItem.link, icon: Wallet },
    { labelKey: "account.helpSupport", link: "/account/help-and-support", icon: HelpCircle },
  ];
};
