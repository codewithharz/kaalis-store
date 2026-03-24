const supportedCategoryLocales = new Set(["fr"]);

const normalizeCategoryLocale = (locale) => {
  const normalized = String(locale || "en")
    .toLowerCase()
    .split(",")[0]
    .split("-")[0]
    .trim();

  return supportedCategoryLocales.has(normalized) ? normalized : "en";
};

const getCategoryRequestLocale = (req) =>
  normalizeCategoryLocale(
    req.query.locale ||
      req.headers["x-locale"] ||
      req.headers["accept-language"]
  );

const localizeCategory = (category, locale = "en") => {
  if (!category) return category;

  const normalizedLocale = normalizeCategoryLocale(locale);
  const localized = category.toObject ? category.toObject() : { ...category };
  const translation =
    normalizedLocale === "en"
      ? null
      : localized.translations?.[normalizedLocale] || null;

  localized.displayName = translation?.name || localized.name;
  localized.displayDescription =
    translation?.description || localized.description || "";

  return localized;
};

const localizeCategoryPath = (categoryPath = [], locale = "en") =>
  categoryPath.map((category) => {
    const localized = localizeCategory(category, locale);

    return {
      name: localized.displayName || localized.name,
      slug: localized.slug,
      displayName: localized.displayName || localized.name,
    };
  });

module.exports = {
  normalizeCategoryLocale,
  getCategoryRequestLocale,
  localizeCategory,
  localizeCategoryPath,
};
