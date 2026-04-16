import { apiGet, extractList, isApiConfigured } from './client';
import { normalizeProduct, normalizeCategory, normalizeBrand } from './normalize';

const PATHS = {
  products:    '/store/products',
  product:     (slug) => `/store/products/${slug}`,
  categories:  '/store/products',
  brands:      '/store/products',
  search:      '/store/products',
  featured:    '/store/products',
  newArrivals: '/store/products',
  sale:        '/store/products',
  homeFeed:    '/store/products',
};

export const fetchProducts = async (params = {}) => {
  const res = await apiGet(PATHS.products, params);
  return {
    results: extractList(res).map(normalizeProduct).filter(Boolean),
    count: res?.count || res?.total || extractList(res).length,
    next: res?.next || null,
    previous: res?.previous || null,
  };
};

export const fetchProductById = async (id) => {
  const res = await apiGet(PATHS.product(id));
  return normalizeProduct(res);
};

export const fetchProductBySlug = async (slug) => {
  try {
    const res = await apiGet(PATHS.product(slug));
    return normalizeProduct(res);
  } catch {
    const res2 = await apiGet(PATHS.products, { slug });
    const list = extractList(res2);
    return list.length ? normalizeProduct(list[0]) : null;
  }
};

export const fetchCategories = async () => {
  const res = await apiGet(PATHS.categories);
  return extractList(res).map(normalizeCategory).filter(Boolean);
};

export const fetchBrands = async () => {
  const res = await apiGet(PATHS.brands);
  return extractList(res).map(normalizeBrand).filter(Boolean);
};

export const fetchProductsByCategory = async (categorySlug, params = {}) => {
  const res = await apiGet(PATHS.products, { category: categorySlug, ...params });
  return {
    results: extractList(res).map(normalizeProduct).filter(Boolean),
    count: res?.count || extractList(res).length,
    next: res?.next || null,
  };
};

export const fetchProductsByBrand = async (brandSlug, params = {}) => {
  const res = await apiGet(PATHS.products, { brand: brandSlug, ...params });
  return {
    results: extractList(res).map(normalizeProduct).filter(Boolean),
    count: res?.count || extractList(res).length,
    next: res?.next || null,
  };
};

export const searchProducts = async (query, params = {}) => {
  let res;
  try {
    res = await apiGet(PATHS.search, { q: query, search: query, ...params });
  } catch {
    res = await apiGet(PATHS.products, { search: query, q: query, ...params });
  }
  return extractList(res).map(normalizeProduct).filter(Boolean);
};

export const fetchFeaturedProducts = async () => {
  try {
    const res = await apiGet(PATHS.featured);
    return extractList(res).map(normalizeProduct).filter(Boolean);
  } catch {
    const res2 = await apiGet(PATHS.products, { is_featured: true, featured: true });
    return extractList(res2).map(normalizeProduct).filter(Boolean);
  }
};

export const fetchNewArrivals = async () => {
  try {
    const res = await apiGet(PATHS.newArrivals);
    return extractList(res).map(normalizeProduct).filter(Boolean);
  } catch {
    const res2 = await apiGet(PATHS.products, { is_new: true, ordering: '-created_at' });
    return extractList(res2).map(normalizeProduct).filter(Boolean);
  }
};

export const fetchSaleProducts = async () => {
  try {
    const res = await apiGet(PATHS.sale);
    return extractList(res).map(normalizeProduct).filter(Boolean);
  } catch {
    const res2 = await apiGet(PATHS.products, { is_sale: true, on_sale: true });
    return extractList(res2).map(normalizeProduct).filter(Boolean);
  }
};

export const fetchHomeFeedFromApi = async () => {
  try {
    const res = await apiGet(PATHS.homeFeed);
    const normalize = (list) => extractList(list).map(normalizeProduct).filter(Boolean);
    return {
      featured:    normalize(res.featured || res.featured_products || []),
      newArrivals: normalize(res.new_arrivals || res.newArrivals || []),
      bestSellers: normalize(res.best_sellers || res.bestSellers || res.featured || []),
      sale:        normalize(res.sale || res.sale_products || []),
      banners:     res.banners || res.hero_banners || [],
      editorialBanners: res.editorial_banners || res.editorials || [],
      categories:  (res.categories || []).map(normalizeCategory).filter(Boolean),
    };
  } catch {
    const [featuredRes, newRes, saleRes, categoriesRes] = await Promise.allSettled([
      fetchFeaturedProducts(),
      fetchNewArrivals(),
      fetchSaleProducts(),
      fetchCategories(),
    ]);
    return {
      featured:    featuredRes.status === 'fulfilled' ? featuredRes.value : [],
      newArrivals: newRes.status === 'fulfilled' ? newRes.value : [],
      bestSellers: featuredRes.status === 'fulfilled' ? featuredRes.value : [],
      sale:        saleRes.status === 'fulfilled' ? saleRes.value : [],
      banners:     [],
      editorialBanners: [],
      categories:  categoriesRes.status === 'fulfilled' ? categoriesRes.value : [],
    };
  }
};
