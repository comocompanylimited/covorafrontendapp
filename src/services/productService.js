import {
  PRODUCTS,
  BANNERS,
  CATEGORIES,
  EDITORIAL_BANNERS,
  NEW_ARRIVALS,
  BEST_SELLERS,
  SALE_ITEMS,
  searchProducts as mockSearch,
  getProductsByCategory as mockGetByCategory,
} from '../data/mockProducts';
import {
  isApiConfigured,
  fetchHomeFeedFromApi,
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  searchProducts as apiSearch,
  fetchCategories,
  fetchNewArrivals,
  fetchSaleProducts,
  fetchFeaturedProducts,
} from '../api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchHomeFeed = async () => {
  if (!isApiConfigured()) {
    await delay(480);
    return {
      banners: BANNERS,
      categories: CATEGORIES,
      editorial: EDITORIAL_BANNERS,
      newArrivals: NEW_ARRIVALS.length ? NEW_ARRIVALS : PRODUCTS.slice(0, 4),
      bestSellers: BEST_SELLERS.length ? BEST_SELLERS : PRODUCTS.slice(2, 6),
      saleItems: SALE_ITEMS.length ? SALE_ITEMS : PRODUCTS.slice(0, 6),
      products: PRODUCTS,
    };
  }

  try {
    const api = await fetchHomeFeedFromApi();
    return {
      banners: api.banners?.length ? api.banners : BANNERS,
      categories: api.categories?.length ? api.categories : CATEGORIES,
      editorial: api.editorialBanners?.length ? api.editorialBanners : EDITORIAL_BANNERS,
      newArrivals: api.newArrivals?.length ? api.newArrivals : (NEW_ARRIVALS.length ? NEW_ARRIVALS : PRODUCTS.slice(0, 4)),
      bestSellers: api.bestSellers?.length ? api.bestSellers : (BEST_SELLERS.length ? BEST_SELLERS : PRODUCTS.slice(2, 6)),
      saleItems: api.sale?.length ? api.sale : (SALE_ITEMS.length ? SALE_ITEMS : PRODUCTS.slice(0, 6)),
      products: api.featured?.length ? api.featured : PRODUCTS,
    };
  } catch {
    return {
      banners: BANNERS,
      categories: CATEGORIES,
      editorial: EDITORIAL_BANNERS,
      newArrivals: NEW_ARRIVALS.length ? NEW_ARRIVALS : PRODUCTS.slice(0, 4),
      bestSellers: BEST_SELLERS.length ? BEST_SELLERS : PRODUCTS.slice(2, 6),
      saleItems: SALE_ITEMS.length ? SALE_ITEMS : PRODUCTS.slice(0, 6),
      products: PRODUCTS,
    };
  }
};

export const searchCatalog = async (query) => {
  if (!isApiConfigured()) {
    await delay(240);
    return mockSearch(query);
  }

  try {
    const results = await apiSearch(query);
    return results.length ? results : mockSearch(query);
  } catch {
    await delay(240);
    return mockSearch(query);
  }
};

export const fetchCatalogProducts = async (params = {}) => {
  if (!isApiConfigured()) {
    await delay(300);
    return { results: PRODUCTS, count: PRODUCTS.length, next: null };
  }

  try {
    return await fetchProducts(params);
  } catch {
    return { results: PRODUCTS, count: PRODUCTS.length, next: null };
  }
};

export const fetchProductDetail = async (idOrSlug) => {
  if (!isApiConfigured()) {
    await delay(200);
    return PRODUCTS.find(p => String(p.id) === String(idOrSlug) || p.slug === idOrSlug) || null;
  }

  try {
    return await fetchProductById(idOrSlug);
  } catch {
    return PRODUCTS.find(p => String(p.id) === String(idOrSlug) || p.slug === idOrSlug) || null;
  }
};

export const fetchCategoryProducts = async (categorySlug, params = {}) => {
  if (!isApiConfigured()) {
    await delay(300);
    const results = mockGetByCategory(categorySlug);
    return { results, count: results.length, next: null };
  }

  try {
    const res = await fetchProductsByCategory(categorySlug, params);
    if (res.results?.length) return res;
    const fallback = mockGetByCategory(categorySlug);
    return { results: fallback, count: fallback.length, next: null };
  } catch {
    const fallback = mockGetByCategory(categorySlug);
    return { results: fallback, count: fallback.length, next: null };
  }
};

export const productService = {
  fetchHomeFeed,
  searchCatalog,
  fetchCatalogProducts,
  fetchProductDetail,
  fetchCategoryProducts,
};

export default productService;
