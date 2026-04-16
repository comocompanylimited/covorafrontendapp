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
      banners:     BANNERS,
      categories:  api.categories?.length ? api.categories : CATEGORIES,
      editorial:   EDITORIAL_BANNERS,
      newArrivals: api.newArrivals?.length  ? api.newArrivals  : [],
      bestSellers: api.bestSellers?.length  ? api.bestSellers  : [],
      saleItems:   api.sale?.length         ? api.sale         : [],
      products:    api.featured?.length     ? api.featured     : [],
    };
  } catch {
    return {
      banners: BANNERS, categories: CATEGORIES, editorial: EDITORIAL_BANNERS,
      newArrivals: [], bestSellers: [], saleItems: [], products: [],
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

// Maps every app category ID → backend /store/products query params.
// Backend filters by the `short_description` field (set during CJ import).
// All 24 backend categories:
//   Jewellery(436) Makeup(296) Outerwear(289) Tops & Blouses(260)
//   Bottoms(241) Hair(233) Skincare(196) Dresses(171)
//   Shoulder Bags(96) Accessories(95) Clutches(87) Denim(51)
//   Knitwear(50) Boots(49) Crossbody Bags(49) Flats(49)
//   Sneakers(48) Co-ords(48) Mules(47) Scarves(47)
//   Loungewear(47) Sandals(46) Tote Bags(45) Heels(45)
const CATEGORY_PARAMS = {
  // ── Special / composite ──────────────────────────────────────────────────
  null:        { page_size: 40 },
  new:         { page_size: 40 },
  sale:        { page_size: 40 },
  bestsellers: { page_size: 40 },
  // ── Top-level browse groups ──────────────────────────────────────────────
  clothing:  { categories: 'Dresses,Tops & Blouses,Knitwear,Co-ords,Outerwear,Loungewear,Bottoms,Denim', page_size: 40 },
  shoes:     { categories: 'Heels,Flats,Boots,Sneakers,Sandals,Mules', page_size: 40 },
  beauty:    { categories: 'Skincare,Makeup,Hair', page_size: 40 },
  bags:      { categories: 'Tote Bags,Crossbody Bags,Clutches,Shoulder Bags', page_size: 40 },
  jewellery: { category: 'Jewellery', page_size: 40 },
  active:    { categories: 'Tops & Blouses,Bottoms', page_size: 40 },
  more:      { categories: 'Loungewear,Scarves,Accessories', page_size: 40 },
  // ── Clothing subcategories ───────────────────────────────────────────────
  tops:           { category: 'Tops & Blouses', page_size: 40 },
  tshirts:        { category: 'Tops & Blouses', page_size: 40 },
  tanks:          { category: 'Tops & Blouses', page_size: 40 },
  blouses:        { category: 'Tops & Blouses', page_size: 40 },
  shirts:         { category: 'Tops & Blouses', page_size: 40 },
  bodysuits:      { category: 'Tops & Blouses', page_size: 40 },
  knitwear:       { category: 'Knitwear', page_size: 40 },
  hoodies:        { category: 'Tops & Blouses', page_size: 40 },
  jeans:          { category: 'Bottoms', page_size: 40 },
  trousers:       { category: 'Bottoms', page_size: 40 },
  leggings:       { category: 'Bottoms', page_size: 40 },
  skirts:         { category: 'Bottoms', page_size: 40 },
  shorts:         { category: 'Bottoms', page_size: 40 },
  dresses:        { category: 'Dresses', page_size: 40 },
  'mini-dresses': { category: 'Dresses', page_size: 40 },
  'midi-dresses': { category: 'Dresses', page_size: 40 },
  'maxi-dresses': { category: 'Dresses', page_size: 40 },
  'formal-dresses':{ category: 'Dresses', page_size: 40 },
  'party-dresses': { category: 'Dresses', page_size: 40 },
  'casual-dresses':{ category: 'Dresses', page_size: 40 },
  jackets:         { category: 'Outerwear', page_size: 40 },
  coats:           { category: 'Outerwear', page_size: 40 },
  blazers:         { category: 'Outerwear', page_size: 40 },
  'trench-coats':  { category: 'Outerwear', page_size: 40 },
  'puffer-jackets':{ category: 'Outerwear', page_size: 40 },
  'co-ords':       { category: 'Co-ords', page_size: 40 },
  'denim-all':     { category: 'Denim', page_size: 40 },
  'denim-jackets': { category: 'Denim', page_size: 40 },
  'denim-jeans':   { category: 'Denim', page_size: 40 },
  'denim-skirts':  { category: 'Denim', page_size: 40 },
  denim:           { category: 'Denim', page_size: 40 },
  loungewear:      { category: 'Loungewear', page_size: 40 },
  lingerie:        { category: 'Loungewear', page_size: 40 },
  swimwear:        { categories: 'Dresses,Tops & Blouses', page_size: 40 },
  // ── Shoes subcategories ──────────────────────────────────────────────────
  heels:         { category: 'Heels', page_size: 40 },
  flats:         { category: 'Flats', page_size: 40 },
  sandals:       { category: 'Sandals', page_size: 40 },
  slides:        { category: 'Sandals', page_size: 40 },
  loafers:       { category: 'Flats', page_size: 40 },
  slippers:      { category: 'Flats', page_size: 40 },
  boots:         { category: 'Boots', page_size: 40 },
  'ankle-boots': { category: 'Boots', page_size: 40 },
  'knee-boots':  { category: 'Boots', page_size: 40 },
  'otk-boots':   { category: 'Boots', page_size: 40 },
  sneakers:      { category: 'Sneakers', page_size: 40 },
  'sports-shoes':{ category: 'Sneakers', page_size: 40 },
  'designer-shoes':{ categories: 'Heels,Flats,Boots', page_size: 40 },
  mules:         { category: 'Mules', page_size: 40 },
  // ── Beauty subcategories ─────────────────────────────────────────────────
  makeup:       { category: 'Makeup', page_size: 40 },
  foundation:   { category: 'Makeup', page_size: 40 },
  concealer:    { category: 'Makeup', page_size: 40 },
  powder:       { category: 'Makeup', page_size: 40 },
  blush:        { category: 'Makeup', page_size: 40 },
  bronzer:      { category: 'Makeup', page_size: 40 },
  highlighter:  { category: 'Makeup', page_size: 40 },
  eyeshadow:    { category: 'Makeup', page_size: 40 },
  eyeliner:     { category: 'Makeup', page_size: 40 },
  mascara:      { category: 'Makeup', page_size: 40 },
  lipstick:     { category: 'Makeup', page_size: 40 },
  'lip-gloss':  { category: 'Makeup', page_size: 40 },
  skincare:     { category: 'Skincare', page_size: 40 },
  cleansers:    { category: 'Skincare', page_size: 40 },
  moisturizers: { category: 'Skincare', page_size: 40 },
  serums:       { category: 'Skincare', page_size: 40 },
  sunscreen:    { category: 'Skincare', page_size: 40 },
  'face-masks': { category: 'Skincare', page_size: 40 },
  toners:       { category: 'Skincare', page_size: 40 },
  hair:         { category: 'Hair', page_size: 40 },
  haircare:     { category: 'Hair', page_size: 40 },
  shampoo:      { category: 'Hair', page_size: 40 },
  conditioner:  { category: 'Hair', page_size: 40 },
  'hair-treatments': { category: 'Hair', page_size: 40 },
  styling:      { category: 'Hair', page_size: 40 },
  perfume:      { category: 'Accessories', page_size: 40 },
  'body-mist':  { category: 'Accessories', page_size: 40 },
  brushes:      { category: 'Makeup', page_size: 40 },
  sponges:      { category: 'Makeup', page_size: 40 },
  'hair-tools': { category: 'Hair', page_size: 40 },
  // ── Bags subcategories ───────────────────────────────────────────────────
  handbags:    { categories: 'Shoulder Bags,Clutches', page_size: 40 },
  'tote-bags': { category: 'Tote Bags', page_size: 40 },
  crossbody:   { category: 'Crossbody Bags', page_size: 40 },
  clutches:    { category: 'Clutches', page_size: 40 },
  backpacks:   { categories: 'Shoulder Bags,Tote Bags', page_size: 40 },
  // ── Accessories subcategories ────────────────────────────────────────────
  sunglasses:         { category: 'Accessories', page_size: 40 },
  belts:              { category: 'Accessories', page_size: 40 },
  hats:               { category: 'Accessories', page_size: 40 },
  scarves:            { category: 'Scarves', page_size: 40 },
  'hair-accessories': { category: 'Hair', page_size: 40 },
  'phone-cases':      { category: 'Accessories', page_size: 40 },
  'airpods-cases':    { category: 'Accessories', page_size: 40 },
  // ── Jewellery subcategories ──────────────────────────────────────────────
  necklaces:            { category: 'Jewellery', page_size: 40 },
  earrings:             { category: 'Jewellery', page_size: 40 },
  rings:                { category: 'Jewellery', page_size: 40 },
  bracelets:            { category: 'Jewellery', page_size: 40 },
  anklets:              { category: 'Jewellery', page_size: 40 },
  watches:              { category: 'Jewellery', page_size: 40 },
  'fine-jewellery':     { category: 'Jewellery', page_size: 40 },
  'luxury-jewellery':   { category: 'Jewellery', page_size: 40 },
  'high-end-jewellery': { category: 'Jewellery', page_size: 40 },
  // ── Activewear ───────────────────────────────────────────────────────────
  activewear:        { categories: 'Tops & Blouses,Bottoms', page_size: 40 },
  'sports-bras':     { category: 'Tops & Blouses', page_size: 40 },
  'gym-tops':        { category: 'Tops & Blouses', page_size: 40 },
  'active-leggings': { category: 'Bottoms', page_size: 40 },
  'active-shorts':   { category: 'Bottoms', page_size: 40 },
  tracksuits:        { category: 'Co-ords', page_size: 40 },
  'running-shoes':   { category: 'Sneakers', page_size: 40 },
  'yoga-wear':       { category: 'Tops & Blouses', page_size: 40 },
  // ── Lingerie / sleepwear ─────────────────────────────────────────────────
  bras:            { category: 'Loungewear', page_size: 40 },
  panties:         { category: 'Loungewear', page_size: 40 },
  'lingerie-sets': { category: 'Loungewear', page_size: 40 },
  shapewear:       { category: 'Loungewear', page_size: 40 },
  sleepwear:       { category: 'Loungewear', page_size: 40 },
  robes:           { category: 'Loungewear', page_size: 40 },
  // ── Swimwear / modest / maternity ────────────────────────────────────────
  bikinis:               { category: 'Dresses', page_size: 40 },
  'one-piece':           { category: 'Dresses', page_size: 40 },
  'cover-ups':           { category: 'Dresses', page_size: 40 },
  beachwear:             { category: 'Dresses', page_size: 40 },
  modest:                { category: 'Dresses', page_size: 40 },
  abayas:                { category: 'Dresses', page_size: 40 },
  hijabs:                { category: 'Accessories', page_size: 40 },
  'modest-dresses':      { category: 'Dresses', page_size: 40 },
  'long-skirts':         { category: 'Bottoms', page_size: 40 },
  maternity:             { category: 'Dresses', page_size: 40 },
  'maternity-dresses':   { category: 'Dresses', page_size: 40 },
  'maternity-tops':      { category: 'Tops & Blouses', page_size: 40 },
  'maternity-activewear':{ category: 'Tops & Blouses', page_size: 40 },
  // ── Size ranges → all products ───────────────────────────────────────────
  'plus-size': { page_size: 40 },
  petite:      { page_size: 40 },
  tall:        { page_size: 40 },
  // ── Designer / luxury ────────────────────────────────────────────────────
  designers:           { page_size: 40 },
  'designer-clothing': { categories: 'Dresses,Tops & Blouses,Outerwear,Knitwear', page_size: 40 },
  'designer-bags':     { categories: 'Tote Bags,Crossbody Bags,Clutches,Shoulder Bags', page_size: 40 },
  'luxury-shoes':      { categories: 'Heels,Boots,Flats', page_size: 40 },
  'limited-editions':  { page_size: 40 },
  // ── Sale sub-groups ──────────────────────────────────────────────────────
  'sale-clothing':    { categories: 'Dresses,Tops & Blouses,Outerwear,Knitwear,Bottoms,Denim', page_size: 40 },
  'sale-shoes':       { categories: 'Heels,Flats,Boots,Sneakers,Sandals,Mules', page_size: 40 },
  'sale-beauty':      { categories: 'Skincare,Makeup,Hair', page_size: 40 },
  'sale-bags':        { categories: 'Tote Bags,Crossbody Bags,Clutches,Shoulder Bags', page_size: 40 },
  'sale-accessories': { categories: 'Accessories,Scarves', page_size: 40 },
  // ── Direct backend short_description values (exact match) ────────────────
  Jewellery:        { category: 'Jewellery', page_size: 40 },
  Makeup:           { category: 'Makeup', page_size: 40 },
  Outerwear:        { category: 'Outerwear', page_size: 40 },
  'Tops & Blouses': { category: 'Tops & Blouses', page_size: 40 },
  Bottoms:          { category: 'Bottoms', page_size: 40 },
  Hair:             { category: 'Hair', page_size: 40 },
  Skincare:         { category: 'Skincare', page_size: 40 },
  Dresses:          { category: 'Dresses', page_size: 40 },
  'Shoulder Bags':  { category: 'Shoulder Bags', page_size: 40 },
  Accessories:      { category: 'Accessories', page_size: 40 },
  Clutches:         { category: 'Clutches', page_size: 40 },
  Denim:            { category: 'Denim', page_size: 40 },
  Knitwear:         { category: 'Knitwear', page_size: 40 },
  Boots:            { category: 'Boots', page_size: 40 },
  'Crossbody Bags': { category: 'Crossbody Bags', page_size: 40 },
  Flats:            { category: 'Flats', page_size: 40 },
  Sneakers:         { category: 'Sneakers', page_size: 40 },
  'Co-ords':        { category: 'Co-ords', page_size: 40 },
  Mules:            { category: 'Mules', page_size: 40 },
  Scarves:          { category: 'Scarves', page_size: 40 },
  Loungewear:       { category: 'Loungewear', page_size: 40 },
  Sandals:          { category: 'Sandals', page_size: 40 },
  'Tote Bags':      { category: 'Tote Bags', page_size: 40 },
  Heels:            { category: 'Heels', page_size: 40 },
};

export const fetchCategoryProducts = async (categoryId, extraParams = {}) => {
  if (!isApiConfigured()) {
    await delay(300);
    const results = mockGetByCategory(categoryId);
    return { results, count: results.length, next: null, total: results.length };
  }

  try {
    // Look up mapped params; fall back to passing categoryId as the `category` filter
    const key = categoryId === null ? 'null' : categoryId;
    const mappedParams = CATEGORY_PARAMS[key] ?? { category: categoryId, page_size: 40 };
    const res = await fetchProductsByCategory(null, { ...mappedParams, ...extraParams });
    return res;
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
