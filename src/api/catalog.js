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
  // Fetch 4 different category groups in parallel for distinct home sections
  const [jewelleryRes, dressesRes, outerwearRes, beautyRes] = await Promise.allSettled([
    apiGet(PATHS.products, { category: 'Jewellery', page_size: 12 }),
    apiGet(PATHS.products, { category: 'Dresses', page_size: 12 }),
    apiGet(PATHS.products, { category: 'Outerwear', page_size: 12 }),
    apiGet(PATHS.products, { categories: 'Skincare,Makeup,Hair', page_size: 12 }),
  ]);

  const pick = (res) => res.status === 'fulfilled'
    ? extractList(res.value).map(normalizeProduct).filter(Boolean)
    : [];

  const jewellery = pick(jewelleryRes);
  const dresses   = pick(dressesRes);
  const outerwear  = pick(outerwearRes);
  const beauty    = pick(beautyRes);

  // All products combined for category derivation
  const allProducts = [...jewellery, ...dresses, ...outerwear, ...beauty];

  const seen = new Set();
  const categories = allProducts.reduce((acc, p) => {
    if (p.category && !seen.has(p.category)) {
      seen.add(p.category);
      acc.push(normalizeCategory({ id: p.categoryId, name: p.category, slug: p.categoryId }));
    }
    return acc;
  }, []);

  return {
    featured:         jewellery,
    newArrivals:      dresses,
    bestSellers:      outerwear,
    sale:             beauty,
    banners:          [],
    editorialBanners: [],
    categories,
  };
};
