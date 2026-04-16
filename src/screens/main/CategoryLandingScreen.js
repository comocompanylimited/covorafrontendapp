import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { ProductCard, FilterModal, SortModal } from '../../components/common';
import { PRODUCTS, getProductsByCategory } from '../../data/mockProducts';
import { fetchCategoryProducts } from '../../services/productService';

const { width } = Dimensions.get('window');

// ── Grid: 3 tight columns for an open marketplace feel ───────────────────────
const GRID_H_PAD = 10;
const GRID_GAP   = 6;
const CARD_W     = (width - GRID_H_PAD * 2 - GRID_GAP * 2) / 3;

// ── Header floats over content — we push the list down by this amount ─────────
// Measured empirically: title(52) + search(52) + pills(46) + safeArea
// We compute it dynamically using onLayout below, but seed a safe default.
const HEADER_SEED_H = 160;

// ─── Filter / sort logic ──────────────────────────────────────────────────────
const applyFilters = (products, filters, sortId) => {
  let r = [...products];
  if (filters.priceRange) {
    const { min, max } = filters.priceRange;
    r = r.filter(p => p.price >= min && p.price < (max === Infinity ? 999999 : max + 0.01));
  }
  if (filters.sizes?.length)  r = r.filter(p => p.sizes  && filters.sizes.some(s  => p.sizes.includes(s)));
  if (filters.colors?.length) r = r.filter(p => p.colors && filters.colors.some(c => p.colors.includes(c)));
  if (filters.minRating)      r = r.filter(p => p.rating && p.rating >= filters.minRating);
  if (filters.onlyNew)        r = r.filter(p => p.isNew);
  if (filters.onlySale)       r = r.filter(p => p.isSale);
  switch (sortId) {
    case 'newest':     r.sort((a, b) => (b.isNew      ? 1 : 0) - (a.isNew      ? 1 : 0)); break;
    case 'price_asc':  r.sort((a, b) => a.price - b.price);                               break;
    case 'price_desc': r.sort((a, b) => b.price - a.price);                               break;
    case 'rating':     r.sort((a, b) => (b.rating     || 0) - (a.rating     || 0));       break;
    case 'bestseller': r.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break;
    default: break;
  }
  return r;
};

const countFilters = f => [
  f.priceRange, f.sizes?.length > 0, f.colors?.length > 0,
  f.minRating, f.onlyNew, f.onlySale,
].filter(Boolean).length;

// ─── In-category search ───────────────────────────────────────────────────────
const searchProducts = (products, q) => {
  const lq = q.toLowerCase().trim();
  if (!lq) return products;
  return products.filter(p =>
    p.name?.toLowerCase().includes(lq)        ||
    p.brand?.toLowerCase().includes(lq)       ||
    p.description?.toLowerCase().includes(lq) ||
    p.categoryId?.toLowerCase().includes(lq)  ||
    p.sizes?.some(s  => s.toLowerCase().includes(lq)) ||
    p.colorNames?.some(c => c.toLowerCase().includes(lq)) ||
    p.colors?.some(c => c.toLowerCase().includes(lq))
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const CategoryLandingScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { categoryName = 'Products', categoryId } = route.params || {};
  const { toggleWishlist, isInWishlist } = useApp();

  const [sortId,        setSortId]        = useState('featured');
  const [filters,       setFilters]       = useState({ priceRange: null, sizes: [], colors: [], minRating: null, onlyNew: false, onlySale: false });
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible,   setSortVisible]   = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [headerH,       setHeaderH]       = useState(HEADER_SEED_H);
  const [sourceProducts, setSourceProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const searchRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingProducts(true);
      setLoadError(null);
      try {
        let results;
        if (!categoryId) {
          results = PRODUCTS;
        } else if (categoryId === 'new') {
          results = PRODUCTS.filter(p => p.isNew);
        } else if (categoryId === 'sale') {
          results = PRODUCTS.filter(p => p.isSale);
        } else if (categoryId === 'bestsellers') {
          results = PRODUCTS.filter(p => p.isBestSeller);
        } else {
          const res = await fetchCategoryProducts(categoryId);
          results = res.results;
        }
        if (!cancelled) setSourceProducts(results);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message);
          const fallback = getProductsByCategory(categoryId);
          setSourceProducts(fallback.length ? fallback : PRODUCTS);
        }
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [categoryId]);

  const filteredProducts = useMemo(() => applyFilters(sourceProducts, filters, sortId), [sourceProducts, filters, sortId]);
  const visibleProducts  = useMemo(() => searchProducts(filteredProducts, searchQuery), [filteredProducts, searchQuery]);

  const filterCount = countFilters(filters);
  const hasSearch   = searchQuery.trim().length > 0;

  const clearAll = useCallback(() => {
    setFilters({ priceRange: null, sizes: [], colors: [], minRating: null, onlyNew: false, onlySale: false });
    setSearchQuery('');
  }, []);

  const handleProductPress = useCallback(p => navigation.navigate('ProductDetail', { product: p }), [navigation]);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={S.screen}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* ── Product list — sits at top: 0, header floats over it ── */}
      {loadingProducts ? (
        <View style={[S.emptyWrap, { paddingTop: headerH }]}>
          <ActivityIndicator size="large" color={Colors.gold} />
        </View>
      ) : visibleProducts.length === 0 ? (
        <View style={[S.emptyWrap, { paddingTop: headerH }]}>
          <View style={S.emptyIcon}>
            <Feather name={hasSearch ? 'search' : 'package'} size={28} color={Colors.grey300} />
          </View>
          <Text style={S.emptyTitle}>
            {hasSearch ? `No results for "${searchQuery}"` : 'No products found'}
          </Text>
          <Text style={S.emptySub}>
            {hasSearch ? 'Try a different search or clear filters' : 'Try adjusting your filters'}
          </Text>
          <TouchableOpacity onPress={clearAll} style={S.emptyBtn} activeOpacity={0.85}>
            <Text style={S.emptyBtnText}>CLEAR ALL</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={visibleProducts}
          numColumns={3}
          keyExtractor={item => item.id}
          // Top padding = measured header height so first row clears the floating header
          contentContainerStyle={[S.grid, { paddingTop: headerH + 8 }]}
          columnWrapperStyle={S.gridRow}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={5}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item)}
              onWishlistToggle={() => toggleWishlist(item)}
              isWishlisted={isInWishlist(item.id)}
              size="sm"
              style={{ width: CARD_W }}
            />
          )}
        />
      )}

      {/* ── Floating transparent header — position: absolute, overlays list ── */}
      <View
        style={[S.header, { paddingTop: insets.top }]}
        onLayout={e => setHeaderH(e.nativeEvent.layout.height)}
        pointerEvents="box-none"
      >
        {/* Row 1: back button + title + item count */}
        <View style={S.titleRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={S.backBtn}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <View style={S.backCircle}>
              <Feather name="chevron-left" size={20} color={Colors.black} />
            </View>
          </TouchableOpacity>

          <View style={S.titleBlock}>
            <Text style={S.title} numberOfLines={1}>{categoryName}</Text>
            <Text style={S.subtitle}>
              {visibleProducts.length}
              {(hasSearch || filterCount > 0) ? ` of ${sourceProducts.length}` : ''} items
            </Text>
          </View>

          {/* Wishlist / search shortcut */}
          <TouchableOpacity
            onPress={() => searchRef.current?.focus()}
            style={S.backBtn}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <View style={S.backCircle}>
              <Feather name="search" size={16} color={Colors.black} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Row 2: Search bar — glass pill */}
        <View style={[S.searchWrap, searchFocused && S.searchFocused]}>
          <Feather name="search" size={13} color={searchFocused ? Colors.black : Colors.grey500} />
          <TextInput
            ref={searchRef}
            style={S.searchInput}
            placeholder={`Search in ${categoryName}…`}
            placeholderTextColor={Colors.grey400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Feather name="x-circle" size={14} color={Colors.grey400} />
            </TouchableOpacity>
          )}
        </View>

        {/* Row 3: Control pills — flex row, equal spacing */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={S.pillRow}
          bounces={false}
        >
          {/* Filter */}
          <TouchableOpacity
            style={[S.pill, filterCount > 0 && S.pillActive]}
            onPress={() => setFilterVisible(true)}
            activeOpacity={0.8}
          >
            <Feather name="sliders" size={11} color={filterCount > 0 ? Colors.white : Colors.grey700} />
            <Text style={[S.pillTxt, filterCount > 0 && S.pillTxtActive]}>
              Filter{filterCount > 0 ? ` (${filterCount})` : ''}
            </Text>
          </TouchableOpacity>

          {/* Sort */}
          <TouchableOpacity style={S.pill} onPress={() => setSortVisible(true)} activeOpacity={0.8}>
            <Feather name="chevrons-up-down" size={11} color={Colors.grey700} />
            <Text style={S.pillTxt}>
              {sortId === 'featured' ? 'Featured' :
               sortId === 'newest'   ? 'Newest'   :
               sortId === 'price_asc'? 'Price ↑'  :
               sortId === 'price_desc'? 'Price ↓' :
               sortId === 'rating'   ? 'Top Rated' : 'Best Sellers'}
            </Text>
          </TouchableOpacity>

          {/* Sale toggle */}
          <TouchableOpacity
            style={[S.pill, filters.onlySale && S.pillActive]}
            onPress={() => setFilters(f => ({ ...f, onlySale: !f.onlySale }))}
            activeOpacity={0.8}
          >
            <Text style={[S.pillTxt, filters.onlySale && S.pillTxtActive]}>Sale</Text>
          </TouchableOpacity>

          {/* New In toggle */}
          <TouchableOpacity
            style={[S.pill, filters.onlyNew && S.pillActive]}
            onPress={() => setFilters(f => ({ ...f, onlyNew: !f.onlyNew }))}
            activeOpacity={0.8}
          >
            <Text style={[S.pillTxt, filters.onlyNew && S.pillTxtActive]}>New In</Text>
          </TouchableOpacity>

          {/* Top Rated shortcut */}
          <TouchableOpacity
            style={[S.pill, sortId === 'rating' && S.pillActive]}
            onPress={() => setSortId(s => s === 'rating' ? 'featured' : 'rating')}
            activeOpacity={0.8}
          >
            <Text style={[S.pillTxt, sortId === 'rating' && S.pillTxtActive]}>Top Rated</Text>
          </TouchableOpacity>

          {/* Price low-high shortcut */}
          <TouchableOpacity
            style={[S.pill, sortId === 'price_asc' && S.pillActive]}
            onPress={() => setSortId(s => s === 'price_asc' ? 'featured' : 'price_asc')}
            activeOpacity={0.8}
          >
            <Text style={[S.pillTxt, sortId === 'price_asc' && S.pillTxtActive]}>Price ↑</Text>
          </TouchableOpacity>

          {/* Clear pill — only visible when something active */}
          {(filterCount > 0 || hasSearch) && (
            <TouchableOpacity style={S.clearPill} onPress={clearAll} activeOpacity={0.8}>
              <Feather name="x" size={11} color={Colors.grey500} />
              <Text style={S.clearTxt}>Clear</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setFilters}
        initialFilters={filters}
      />
      <SortModal
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        activeSort={sortId}
        onSelect={setSortId}
      />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // ── Floating header — position absolute, no background, no border ──────────
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    // NO backgroundColor
    // NO borderBottomWidth
    // NO borderColor
    paddingBottom: 10,
  },

  // Thin gradient-style fade behind the controls so they read over product imgs
  // Applied via a background on the inner wrap only, not the full header
  titleRow: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // Very subtle top tint — keeps text readable over any product
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    // subtle shadow so it floats
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '400',
    color: Colors.black,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.grey500,
    letterSpacing: 0.3,
    marginTop: 1,
  },

  // ── Search bar — glass pill ───────────────────────────────────────────────
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    height: 38,
    backgroundColor: 'rgba(245,245,245,0.88)',
    borderRadius: 19,
    paddingHorizontal: 13,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    // backdrop blur not available in RN without native module,
    // so we use a high-opacity background with subtle border
  },
  searchFocused: {
    backgroundColor: Colors.white,
    borderColor: Colors.black,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.black,
    paddingVertical: 0,
    letterSpacing: 0.1,
  },

  // ── Pill control row — horizontal scroll, pills start flush left ──────────
  pillRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 7,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
    // shadow so pills float above product images
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  pillActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
    shadowOpacity: 0,
    elevation: 0,
  },
  pillTxt: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.grey800,
    letterSpacing: 0.2,
  },
  pillTxtActive: {
    color: Colors.white,
  },
  clearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.grey300,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  clearTxt: {
    fontSize: 11,
    color: Colors.grey500,
  },

  // ── Product grid — 3 tight columns ───────────────────────────────────────
  grid: {
    paddingHorizontal: GRID_H_PAD,
    paddingBottom: 100,
  },
  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
    justifyContent: 'flex-start',
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontFamily: 'Georgia',
    fontSize: 17,
    fontWeight: '400',
    color: Colors.black,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.grey400,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.black,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyBtnText: {
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: '500',
    color: Colors.black,
  },
});

export default CategoryLandingScreen;
