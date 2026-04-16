const toFloat = (v) => {
  if (v === null || v === undefined || v === '') return 0;
  const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
};

const extractImages = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(img => {
      if (typeof img === 'string') return img;
      return img?.url || img?.image_url || img?.src || img?.image || img?.original || '';
    }).filter(Boolean);
  }
  if (typeof raw === 'string') return [raw];
  return [];
};

const extractSizes = (product) => {
  if (Array.isArray(product.sizes) && product.sizes.length) return product.sizes;
  if (Array.isArray(product.available_sizes) && product.available_sizes.length) return product.available_sizes;
  if (product.attributes) {
    const sizeAttr = product.attributes.find?.(a =>
      a.name?.toLowerCase() === 'size' || a.slug?.toLowerCase() === 'size'
    );
    if (sizeAttr?.options) return sizeAttr.options;
    if (sizeAttr?.values) return sizeAttr.values;
    if (product.attributes.size) return product.attributes.size;
  }
  return ['XS', 'S', 'M', 'L', 'XL'];
};

const extractColors = (product) => {
  if (Array.isArray(product.colors) && product.colors.length) {
    return product.colors.map(c => (typeof c === 'object' ? c.hex || c.value || c.code || '#000000' : c));
  }
  if (product.attributes) {
    const colorAttr = product.attributes.find?.(a =>
      a.name?.toLowerCase() === 'color' || a.slug?.toLowerCase() === 'color'
    );
    if (colorAttr?.options) return colorAttr.options;
    if (colorAttr?.values) return colorAttr.values;
    if (product.attributes.color) return product.attributes.color;
  }
  return ['#000000'];
};

const extractColorNames = (product) => {
  if (Array.isArray(product.colors) && product.colors.length) {
    return product.colors.map(c => (typeof c === 'object' ? c.name || c.label || 'Color' : c));
  }
  if (product.color_names) return product.color_names;
  return ['Black'];
};

export const normalizeProduct = (raw) => {
  if (!raw) return null;

  const images = extractImages(raw.images || raw.gallery);
  const price = toFloat(raw.price || raw.current_price || raw.sale_price || 0);
  const originalPrice = toFloat(raw.compare_at_price || raw.original_price || raw.regular_price || raw.base_price || 0);

  return {
    id: String(raw.id || raw.pk || raw.product_id || ''),
    name: raw.name || raw.title || raw.product_name || '',
    slug: raw.slug || raw.handle || String(raw.id || ''),
    description: raw.description || raw.body_html || raw.short_description || '',
    price,
    originalPrice: originalPrice > price ? originalPrice : 0,
    image: images[0] || raw.thumbnail || raw.featured_image || '',
    images,
    category: raw.category?.name || raw.category_name || raw.category || raw.short_description || '',
    categoryId: raw.category?.slug || raw.category?.id || raw.category_slug || raw.category_id || raw.short_description?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
    brand: raw.brand?.name || raw.brand_name || raw.vendor || raw.brand || '',
    brandId: raw.brand?.slug || raw.brand?.id || raw.brand_slug || raw.brand_id || '',
    sizes: extractSizes(raw),
    colors: extractColors(raw),
    colorNames: extractColorNames(raw),
    inStock: raw.in_stock ?? raw.is_available ?? (raw.stock_status === 'in_stock') ?? (raw.stock_quantity > 0) ?? true,
    stockCount: raw.stock_quantity ?? raw.quantity ?? raw.stock ?? null,
    isNew: raw.is_new ?? raw.new ?? false,
    isSale: raw.is_sale ?? raw.on_sale ?? (originalPrice > price && price > 0) ?? false,
    isBestSeller: raw.is_featured ?? raw.is_bestseller ?? raw.featured ?? false,
    rating: toFloat(raw.rating || raw.average_rating || raw.avg_rating || 0),
    reviewCount: parseInt(raw.review_count || raw.reviews_count || raw.num_reviews || 0, 10),
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    sku: raw.sku || raw.product_sku || '',
  };
};

export const normalizeCategory = (raw) => {
  if (!raw) return null;
  return {
    id: String(raw.id || raw.pk || ''),
    name: raw.name || raw.title || '',
    slug: raw.slug || String(raw.id || ''),
    image: raw.image || raw.thumbnail || raw.cover_image || '',
    productCount: raw.product_count || raw.count || 0,
    parent: raw.parent || raw.parent_id || null,
  };
};

export const normalizeBrand = (raw) => {
  if (!raw) return null;
  return {
    id: String(raw.id || raw.pk || ''),
    name: raw.name || raw.title || '',
    slug: raw.slug || String(raw.id || ''),
    logo: raw.logo || raw.image || raw.thumbnail || '',
    productCount: raw.product_count || raw.count || 0,
  };
};
