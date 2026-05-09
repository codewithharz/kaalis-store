const shouldShowBuyerCheckoutWallet = ({ user, isXofCountry }) => {
  if (!user || user.isSeller) return false;

  return (
    isXofCountry ||
    user.currency === "XOF" ||
    user.paymentMethod === "AfriExchange" ||
    Boolean(
      user.afriExchange?.userId ||
        user.afriExchange?.walletAddress ||
        user.afriExchange?.accountEmail
    )
  );
};

export const getProfileItems = ({ user, isXofCountry }) => {
  const items = [
    { labelKey: "account.myProfile", link: "/account/profile/" },
    { labelKey: "account.myAddressBook", link: "/account/profile/address-book" },
  ];

  if (user?.isSeller) {
    items.push({
      labelKey: "account.payoutSettings",
      link: "/account/profile/payout-settings",
    });
  } else if (shouldShowBuyerCheckoutWallet({ user, isXofCountry })) {
    items.push({
      labelKey: "account.checkoutWallet",
      link: "/account/profile/checkout-wallet",
    });
  }

  items.push(
    { labelKey: "account.changePassword", link: "/account/profile/change-password" },
    { labelKey: "account.managePayment", link: "/account/profile/manage-payment" },
    { labelKey: "account.myProducts", link: "/account/profile/my-products" }
  );

  return items;
};

export const getAccountNavItem = ({ user, isXofCountry }) => {
  if (user?.isSeller) {
    return {
      labelKey: "account.payoutSettings",
      link: "/account/profile/payout-settings",
    };
  }

  if (shouldShowBuyerCheckoutWallet({ user, isXofCountry })) {
    return {
      labelKey: "account.checkoutWallet",
      link: "/account/profile/checkout-wallet",
    };
  }

  return {
    labelKey: "account.bankDetails",
    link: "/account/profile/bank-details",
  };
};
