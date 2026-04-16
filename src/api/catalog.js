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

// Categories are not on a public endpoint — extract unique category names from products
export const fetchCategories = async () => {
  try {
    const res = await apiGet(PATHS.products, { page_size: 100 });
    const seen = new Set();
    return extractList(res)
      .filter(p => p.short_description)
      .reduce((acc, p) => {
        const name = p.short_description;
        if (!seen.has(name)) {
          seen.add(name);
          const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          acc.push(normalizeCategory({ id: slug, name, slug }));
        }
        return acc;
      }, []);
  } catch {
    return [];
  }
};

export const fetchBrands = async () => {
  return [];
};

export const fetchProductsByCategory = async (categorySlug, params = {}) => {
  // categorySlug is null when caller provides all params directly
  const query = categorySlug ? { category: categorySlug, ...params } : params;
  const res = await apiGet(PATHS.products, query);
  return {
    results: extractList(res).map(normalizeProduct).filter(Boolean),
    total: res?.total || res?.count || extractList(res).length,
    count: res?.total || res?.count || extractList(res).length,
    next: res?.next || null,
    page: res?.page || 1,
    page_size: res?.page_size || 40,
  };
};

export const fetchProductsByBrand = async (brandSlug, params = {}) => {
  const res = await apiGet(PATHS.products, { search: brandSlug, ...params });
  return {
    results: extractList(res).map(normalizeProduct).filter(Boolean),
    count: res?.count || res?.total || extractList(res).length,
    next: res?.next || null,
  };
};

export const searchProducts = async (query, params = {}) => {
  const res = await apiGet(PATHS.search, { search: query, ...params });
  return extractList(res).map(normalizeProduct).filter(Boolean);
};

export const fetchFeaturedProducts = async () => {
  const res = await apiGet(PATHS.featured, { featured: true, page_size: 20 });
  return extractList(res).map(normalizeProduct).filter(Boolean);
};

export const fetchNewArrivals = async () => {
  const res = await apiGet(PATHS.newArrivals, { page_size: 20 });
  return extractList(res).map(normalizeProduct).filter(Boolean);
};

export const fetchSaleProducts = async () => {
  const res = await apiGet(PATHS.sale, { page_size: 20 });
  return extractList(res).map(normalizeProduct).filter(Boolean);
};

export const fetchHomeFeedFromApi = async () => {
  const [allRes, featuredRes] = await Promise.allSettled([
    apiGet(PATHS.products, { page_size: 40 }),
    apiGet(PATHS.featured, { featured: true, page_size: 20 }),
  ]);

  const allProducts = allRes.status === 'fulfilled'
    ? extractList(allRes.value).map(normalizeProduct).filter(Boolean)
    : [];
  const featuredProducts = featuredRes.status === 'fulfilled'
    ? extractList(featuredRes.value).map(normalizeProduct).filter(Boolean)
    : [];

  // Derive categories from product short_descriptions
  const seen = new Set();
  const categories = allProducts.reduce((acc, p) => {
    if (p.category && !seen.has(p.category)) {
      seen.add(p.category);
      acc.push(normalizeCategory({ id: p.categoryId, name: p.category, slug: p.categoryId }));
    }
    return acc;
  }, []);

  return {
    featured:    featuredProducts.length ? featuredProducts : allProducts.slice(0, 10),
    newArrivals: allProducts.slice(0, 10),
    bestSellers: featuredProducts.length ? featuredProducts : allProducts.slice(10, 20),
    sale:        allProducts.slice(20, 30),
    banners:     [],
    editorialBanners: [],
    categories,
  };
};
