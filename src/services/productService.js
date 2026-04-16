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

// Maps app category IDs → backend query params for /store/products
const CATEGORY_PARAMS = {
  new:        { page_size: 40 },
  sale:       { page_size: 40 },
  bestsellers:{ featured: true, page_size: 40 },
  clothing:   { categories: 'Dresses,Tops & Blouses,Outerwear,Knitwear', page_size: 40 },
  beauty:     { categories: 'Hair', page_size: 40 },
  shoes:      { categories: 'Boots,Mules,Sneakers', page_size: 40 },
  bags:       { page_size: 40 },
  jewellery:  { category: 'Jewellery', page_size: 40 },
  // real backend short_description values
  Dresses:          { category: 'Dresses', page_size: 40 },
  Hair:             { category: 'Hair', page_size: 40 },
  Outerwear:        { category: 'Outerwear', page_size: 40 },
  Jewellery:        { category: 'Jewellery', page_size: 40 },
  Boots:            { category: 'Boots', page_size: 40 },
  'Tops & Blouses': { category: 'Tops & Blouses', page_size: 40 },
  Knitwear:         { category: 'Knitwear', page_size: 40 },
  Mules:            { category: 'Mules', page_size: 40 },
  Sneakers:         { category: 'Sneakers', page_size: 40 },
};

export const fetchCategoryProducts = async (categoryId, extraParams = {}) => {
  if (!isApiConfigured()) {
    await delay(300);
    const results = mockGetByCategory(categoryId);
    return { results, count: results.length, next: null, total: results.length };
  }

  try {
    const mappedParams = CATEGORY_PARAMS[categoryId] || { category: categoryId, page_size: 40 };
    const res = await fetchProductsByCategory(null, { ...mappedParams, ...extraParams });
    if (res.results?.length) return res;
    // Empty from API — return empty rather than confusing mock data
    return { results: [], count: 0, next: null, total: 0 };
  } catch {
    return { results: [], count: 0, next: null, total: 0 };
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
