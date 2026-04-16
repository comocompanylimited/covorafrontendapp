import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { ProductCard, SkeletonBlock, ScreenState } from '../../components/common';
import {
  PRODUCTS,
  BANNERS,
  CATEGORIES,
  EDITORIAL_BANNERS,
  NEW_ARRIVALS,
  BEST_SELLERS,
} from '../../data/mockProducts';
import { fetchHomeFeed } from '../../services/productService';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = Math.round(width * 1.22);
const HERO_AUTOSLIDE_MS = 4800;

// ─── Promo Strip ──────────────────────────────────────────────────────────────
const PromoStrip = () => {
  const items = [
    'FREE SHIPPING OVER $150',
    'NEW ARRIVALS WEEKLY',
    'UP TO 50% OFF SALE',
    'EASY 30-DAY RETURNS',
  ];
  return (
    <View style={promoStyles.strip}>
      {items.map((text, i) => (
        <React.Fragment key={i}>
          <Text style={promoStyles.text}>{text}</Text>
          {i < items.length - 1 && <View style={promoStyles.dot} />}
        </React.Fragment>
      ))}
    </View>
  );
};

const promoStyles = StyleSheet.create({
  strip: {
    backgroundColor: Colors.black,
    paddingVertical: 8,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  text: {
    color: Colors.white,
    fontSize: 8,
    letterSpacing: 2,
    fontWeight: '500',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.gold,
  },
});

// ─── Home Category Pills (sticky, below header bar) ──────────────────────────
const HOME_PILLS = [
  { key: 'all',       label: 'All',       categoryId: null,             categoryName: 'All Products' },
  { key: 'jewellery', label: 'Jewellery', categoryId: 'Jewellery',      categoryName: 'Jewellery' },
  { key: 'makeup',    label: 'Makeup',    categoryId: 'Makeup',         categoryName: 'Makeup' },
  { key: 'outerwear', label: 'Outerwear', categoryId: 'Outerwear',      categoryName: 'Outerwear' },
  { key: 'tops',      label: 'Tops',      categoryId: 'Tops & Blouses', categoryName: 'Tops & Blouses' },
  { key: 'hair',      label: 'Hair',      categoryId: 'Hair',           categoryName: 'Hair' },
  { key: 'skincare',  label: 'Skincare',  categoryId: 'Skincare',       categoryName: 'Skincare' },
  { key: 'dresses',   label: 'Dresses',   categoryId: 'Dresses',        categoryName: 'Dresses' },
  { key: 'bags',      label: 'Bags',      categoryId: 'bags',           categoryName: 'Bags' },
  { key: 'shoes',     label: 'Shoes',     categoryId: 'shoes',          categoryName: 'Shoes' },
];

const HomeCategoryPills = ({ navigation, active, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={pillRowStyles.list}
    bounces={false}
  >
    {HOME_PILLS.map(pill => {
      const isActive = active === pill.key;
      return (
        <TouchableOpacity
          key={pill.key}
          style={[pillRowStyles.pill, isActive && pillRowStyles.pillActive]}
          onPress={() => {
            onSelect(pill.key);
            navigation.navigate('CategoryLanding', {
              categoryId: pill.categoryId,
              categoryName: pill.categoryName,
            });
          }}
          activeOpacity={0.75}
        >
          <Text style={[pillRowStyles.pillText, isActive && pillRowStyles.pillTextActive]}>
            {pill.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const pillRowStyles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 10,
    gap: 7,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  pillActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.88)',
    letterSpacing: 0.2,
  },
  pillTextActive: {
    color: Colors.black,
    fontWeight: '600',
  },
});

// ─── Auto-Sliding Hero Banner ─────────────────────────────────────────────────
const HeroBanner = ({ navigation, banners = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef(null);
  const timerRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % banners.length;
        flatRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, HERO_AUTOSLIDE_MS);
  }, [banners.length]);

  useEffect(() => {
    restartTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [restartTimer]);

  const onMomentumEnd = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(idx);
    restartTimer();
  };

  if (!banners.length) {
    return (
      <View style={[bannerStyles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: Colors.grey500, fontSize: 12 }}>No campaigns available</Text>
      </View>
    );
  }

  return (
    <View style={bannerStyles.container}>
      <Animated.FlatList
        ref={flatRef}
        data={banners}
        horizontal
        pagingEnabled
        bounces={false}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScrollBeginDrag={() => timerRef.current && clearInterval(timerRef.current)}
        onMomentumScrollEnd={onMomentumEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const imgScale = scrollX.interpolate({
            inputRange, outputRange: [1.04, 1, 1.04], extrapolate: 'clamp',
          });
          const contentOpacity = scrollX.interpolate({
            inputRange, outputRange: [0.5, 1, 0.5], extrapolate: 'clamp',
          });
          const contentY = scrollX.interpolate({
            inputRange, outputRange: [10, 0, 10], extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity
              style={{ width }}
              activeOpacity={1}
              onPress={() => item.route && navigation.navigate(item.route, item.params)}
            >
              <Animated.Image
                source={{ uri: item.image }}
                style={[bannerStyles.image, { transform: [{ scale: imgScale }] }]}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.72)']}
                locations={[0.3, 0.62, 1]}
                style={bannerStyles.gradient}
              />
              <Animated.View
                style={[
                  bannerStyles.content,
                  { opacity: contentOpacity, transform: [{ translateY: contentY }] },
                ]}
              >
                <Text style={bannerStyles.season}>{item.subtitle}</Text>
                <Text style={bannerStyles.title}>{item.title}</Text>
                <TouchableOpacity
                  style={bannerStyles.ctaBtn}
                  activeOpacity={0.85}
                  onPress={() => item.route && navigation.navigate(item.route, item.params)}
                >
                  <Text style={bannerStyles.ctaText}>{item.cta || 'DISCOVER NOW'}</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Dots */}
      <View style={bannerStyles.dots}>
        {banners.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              flatRef.current?.scrollToIndex({ index: i, animated: true });
              setActiveIndex(i);
              restartTimer();
            }}
          >
            <View style={[bannerStyles.dot, i === activeIndex && bannerStyles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Count */}
      <View style={bannerStyles.counter}>
        <Text style={bannerStyles.counterText}>
          {String(activeIndex + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
};

const bannerStyles = StyleSheet.create({
  container: {
    height: BANNER_HEIGHT,
    backgroundColor: Colors.grey900,
    overflow: 'hidden',
  },
  image: {
    width,
    height: BANNER_HEIGHT,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'absolute',
    bottom: 52,
    left: Spacing.screenPaddingHorizontal,
    right: Spacing.screenPaddingHorizontal,
  },
  season: {
    color: Colors.goldLight,
    fontSize: 9,
    letterSpacing: 3.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: '400',
  },
  title: {
    color: Colors.white,
    fontSize: 38,
    fontFamily: 'Georgia',
    fontWeight: '400',
    letterSpacing: 0.3,
    lineHeight: 44,
    marginBottom: 20,
  },
  ctaBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 4,
  },
  ctaText: {
    color: Colors.white,
    fontSize: 9,
    letterSpacing: 2.8,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  dots: {
    position: 'absolute',
    bottom: 24,
    left: Spacing.screenPaddingHorizontal,
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  counter: {
    position: 'absolute',
    bottom: 26,
    right: Spacing.screenPaddingHorizontal,
  },
  counterText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '300',
  },
});

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, onViewAll }) => (
  <View style={secHeaderStyles.row}>
    <View style={secHeaderStyles.left}>
      <Text style={secHeaderStyles.title}>{title}</Text>
      {subtitle ? <Text style={secHeaderStyles.subtitle}>{subtitle}</Text> : null}
    </View>
    {onViewAll && (
      <TouchableOpacity onPress={onViewAll} activeOpacity={0.7} style={secHeaderStyles.viewAll}>
        <Text style={secHeaderStyles.viewAllText}>View All</Text>
        <Feather name="chevron-right" size={12} color={Colors.grey500} />
      </TouchableOpacity>
    )}
  </View>
);

const secHeaderStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    marginBottom: 14,
  },
  left: { flex: 1 },
  title: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '400',
    color: Colors.black,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.grey500,
    letterSpacing: 0.3,
    marginTop: 2,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 11,
    color: Colors.grey500,
    letterSpacing: 0.3,
  },
});


// ─── Editorial Card ───────────────────────────────────────────────────────────
const EditorialCard = ({ item, navigation }) => (
  <TouchableOpacity
    style={editStyles.card}
    onPress={() => item.route && navigation.navigate(item.route, item.params)}
    activeOpacity={0.94}
  >
    <Image source={{ uri: item.image }} style={editStyles.image} resizeMode="cover" />
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.62)']}
      locations={[0.4, 1]}
      style={editStyles.gradient}
    />
    <View style={editStyles.content}>
      <Text style={editStyles.eyebrow}>{item.eyebrow}</Text>
      <Text style={editStyles.title}>{item.title}</Text>
      <View style={editStyles.cta}>
        <Text style={editStyles.ctaText}>{item.cta}</Text>
        <Feather name="arrow-right" size={12} color={Colors.gold} />
      </View>
    </View>
  </TouchableOpacity>
);

const editStyles = StyleSheet.create({
  card: {
    height: 280,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    overflow: 'hidden',
    borderRadius: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  image: { width: '100%', height: '100%' },
  gradient: { ...StyleSheet.absoluteFillObject },
  content: {
    position: 'absolute',
    bottom: 22,
    left: 20,
    right: 20,
  },
  eyebrow: {
    color: Colors.gold,
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 6,
    fontWeight: '500',
  },
  title: {
    color: Colors.white,
    fontSize: 26,
    fontFamily: 'Georgia',
    fontWeight: '400',
    lineHeight: 32,
    marginBottom: 12,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ctaText: {
    color: Colors.gold,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});

// ─── Flash Sale Banner ────────────────────────────────────────────────────────
const FlashSaleBanner = ({ navigation }) => (
  <TouchableOpacity
    style={saleStyles.container}
    onPress={() => navigation.navigate('CategoryLanding', { categoryId: 'sale', categoryName: 'Sale' })}
    activeOpacity={0.93}
  >
    <View style={saleStyles.left}>
      <Text style={saleStyles.eyebrow}>LIMITED TIME</Text>
      <Text style={saleStyles.title}>Sale</Text>
      <Text style={saleStyles.sub}>Up to 50% off selected styles</Text>
    </View>
    <View style={saleStyles.right}>
      <Text style={saleStyles.percent}>50%</Text>
      <Text style={saleStyles.off}>OFF</Text>
    </View>
    <Feather name="arrow-right" size={16} color={Colors.gold} style={saleStyles.arrow} />
  </TouchableOpacity>
);

const saleStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 22,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  left: { flex: 1 },
  eyebrow: {
    color: Colors.gold,
    fontSize: 8,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: Colors.white,
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  sub: {
    color: Colors.grey500,
    fontSize: 11,
    letterSpacing: 0.2,
    fontWeight: '300',
  },
  right: {
    alignItems: 'center',
    marginRight: 14,
  },
  percent: {
    color: Colors.gold,
    fontSize: 32,
    fontFamily: 'Georgia',
    fontWeight: '300',
    lineHeight: 36,
  },
  off: {
    color: Colors.gold,
    fontSize: 9,
    letterSpacing: 3,
    fontWeight: '500',
  },
  arrow: {
    alignSelf: 'center',
  },
});

// ─── Occasion Cards ───────────────────────────────────────────────────────────
const OCCASIONS = [
  { id: 'formal',    label: 'Formal',    color: '#1A1A2E', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80' },
  { id: 'casual',   label: 'Casual',    color: '#2C1810', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80' },
  { id: 'resort',   label: 'Resort',    color: '#0D2137', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80' },
  { id: 'evening',  label: 'Evening',   color: '#1C0A2C', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80' },
  { id: 'workwear', label: 'Workwear',  color: '#0F1923', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80' },
];

const ShopByOccasion = ({ navigation }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={occasionStyles.list}
  >
    {OCCASIONS.map(occ => (
      <TouchableOpacity
        key={occ.id}
        style={occasionStyles.card}
        onPress={() => navigation.navigate('CategoryLanding', { categoryId: occ.id, categoryName: occ.label })}
        activeOpacity={0.88}
      >
        <Image source={{ uri: occ.image }} style={occasionStyles.image} resizeMode="cover" />
        <View style={[occasionStyles.overlay, { backgroundColor: 'rgba(0,0,0,0.32)' }]} />
        <Text style={occasionStyles.label}>{occ.label}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const occasionStyles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    gap: 10,
  },
  card: {
    width: 130,
    height: 180,
    overflow: 'hidden',
    borderRadius: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  image: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject },
  label: {
    position: 'absolute',
    bottom: 14,
    left: 12,
    right: 12,
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Georgia',
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});

// ─── Spotlight Banner (Beauty / Footwear / Accessories) ───────────────────────
const SpotlightBanner = ({ eyebrow, title, cta, image, onPress }) => (
  <TouchableOpacity style={spotStyles.container} onPress={onPress} activeOpacity={0.94}>
    <Image source={{ uri: image }} style={spotStyles.image} resizeMode="cover" />
    <View style={spotStyles.overlay} />
    <View style={spotStyles.content}>
      <Text style={spotStyles.eyebrow}>{eyebrow}</Text>
      <Text style={spotStyles.title}>{title}</Text>
      <TouchableOpacity style={spotStyles.cta} onPress={onPress} activeOpacity={0.85}>
        <Text style={spotStyles.ctaText}>{cta}</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const spotStyles = StyleSheet.create({
  container: {
    height: 220,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    overflow: 'hidden',
    borderRadius: 14,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.44)',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyebrow: {
    color: Colors.gold,
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: '500',
  },
  title: {
    color: Colors.white,
    fontSize: 28,
    fontFamily: 'Georgia',
    fontWeight: '400',
    letterSpacing: 0.3,
    textAlign: 'center',
    marginBottom: 18,
  },
  cta: {
    borderWidth: 1,
    borderColor: Colors.white,
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 4,
  },
  ctaText: {
    color: Colors.white,
    fontSize: 9,
    letterSpacing: 2.5,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});

// ─── Brand Strip ──────────────────────────────────────────────────────────────
const BRANDS = [
  { id: 'b1', name: 'GUCCI' },
  { id: 'b2', name: 'PRADA' },
  { id: 'b3', name: 'JACQUEMUS' },
  { id: 'b4', name: 'TOTÊME' },
  { id: 'b5', name: 'A.P.C.' },
  { id: 'b6', name: 'SAINT LAURENT' },
];

const BrandStrip = ({ navigation }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={brandStyles.list}
  >
    {BRANDS.map(b => (
      <TouchableOpacity
        key={b.id}
        style={brandStyles.chip}
        onPress={() => navigation.navigate('Categories')}
        activeOpacity={0.75}
      >
        <Text style={brandStyles.label}>{b.name}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const brandStyles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderWidth: 0.5,
    borderColor: Colors.grey200,
    borderRadius: 6,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.black,
  },
});

// ─── Horizontal Product Row ───────────────────────────────────────────────────
const ProductRow = ({ products, navigation, toggleWishlist, isInWishlist, onQuickAdd, showQuickAdd }) => (
  <FlatList
    data={products}
    horizontal
    bounces={false}
    decelerationRate="fast"
    showsHorizontalScrollIndicator={false}
    keyExtractor={item => item.id}
    removeClippedSubviews
    initialNumToRender={4}
    maxToRenderPerBatch={6}
    contentContainerStyle={{ paddingHorizontal: Spacing.screenPaddingHorizontal, gap: Spacing.itemGap }}
    renderItem={({ item }) => (
      <ProductCard
        product={item}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        onWishlistToggle={() => toggleWishlist(item)}
        onQuickAdd={onQuickAdd}
        showQuickAdd={showQuickAdd}
        isWishlisted={isInWishlist(item.id)}
        fullWidth={false}
      />
    )}
  />
);

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => <View style={{ height: 0.5, backgroundColor: Colors.border, marginHorizontal: Spacing.screenPaddingHorizontal }} />;

// ─── Main HomeScreen ──────────────────────────────────────────────────────────
const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { unreadNotifications, toggleWishlist, isInWishlist, recentlyViewed, addToCart, cart } = useApp();
  const mountedRef = useRef(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [homeFeed, setHomeFeed] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const loadHomeFeed = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');
      const feed = await fetchHomeFeed();
      if (mountedRef.current) setHomeFeed(feed);
    } catch (e) {
      if (mountedRef.current) setLoadError('We could not load your curated feed. Please try again.');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeFeed();
    return () => { mountedRef.current = false; };
  }, [loadHomeFeed]);

  const feedProducts = homeFeed?.products?.length ? homeFeed.products : PRODUCTS;
  const heroBanners = homeFeed?.banners?.length ? homeFeed.banners : BANNERS;
  const editorialBanners = homeFeed?.editorial?.length ? homeFeed.editorial : EDITORIAL_BANNERS;
  const newArrivals = homeFeed?.newArrivals?.length ? homeFeed.newArrivals : (NEW_ARRIVALS.length ? NEW_ARRIVALS : PRODUCTS.slice(0, 4));
  const bestSellers = homeFeed?.bestSellers?.length ? homeFeed.bestSellers : (BEST_SELLERS.length ? BEST_SELLERS : PRODUCTS.slice(2, 6));

  const handleQuickAdd = useCallback((product) => {
    if (!product) return;
    addToCart(product, {
      quantity: 1,
      selectedSize: product.sizes?.[0] || 'One Size',
      selectedColor: product.colorNames?.[0] || product.colors?.[0] || 'Default',
    });
  }, [addToCart]);

  if (loadError) {
    return (
      <View style={styles.container}>
        <ScreenState
          type="error"
          icon="alert-triangle"
          title="Could Not Load Home"
          message={loadError}
          ctaLabel="TRY AGAIN"
          onCtaPress={loadHomeFeed}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Floating Transparent Header (position: absolute, overlays hero) ── */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {/* Gradient fade — ensures icons legible over any hero image */}
        <LinearGradient
          colors={['rgba(0,0,0,0.46)', 'rgba(0,0,0,0.22)', 'transparent']}
          locations={[0, 0.65, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Top bar: search | COVORA | bell + bag */}
        <View style={styles.headerInner}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Search')}
            style={styles.headerBtn}
            activeOpacity={0.7}
          >
            <Feather name="search" size={18} color={Colors.white} />
          </TouchableOpacity>

          <Text style={styles.wordmark}>COVORA</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              style={styles.headerBtn}
              activeOpacity={0.7}
            >
              <Feather name="bell" size={18} color={Colors.white} />
              {unreadNotifications > 0 && <View style={styles.notifDot} />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart')}
              style={styles.headerBtn}
              activeOpacity={0.7}
            >
              <Feather name="shopping-bag" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category pill row */}
        <HomeCategoryPills
          navigation={navigation}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        {loading ? (
          <View style={styles.loadingWrap}>
            <SkeletonBlock height={320} />
            <View style={{ paddingHorizontal: Spacing.screenPaddingHorizontal, gap: 12, marginTop: 16 }}>
              <SkeletonBlock height={20} width={140} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <SkeletonBlock height={200} width={150} />
                <SkeletonBlock height={200} width={150} />
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* Hero */}
            <HeroBanner navigation={navigation} banners={heroBanners} />

            {/* Promo Strip */}
            <PromoStrip />

            {/* NEW ARRIVALS */}
            <View style={styles.section}>
              <SectionHeader
                title="New Arrivals"
                subtitle="Just landed this week"
                onViewAll={() => navigation.navigate('CategoryLanding', { categoryId: null, categoryName: 'All Products' })}
              />
              <ProductRow
                products={newArrivals.length ? newArrivals : PRODUCTS.slice(0, 5)}
                navigation={navigation}
                toggleWishlist={toggleWishlist}
                isInWishlist={isInWishlist}
              />
            </View>

            <Divider />

            {/* EDITORIAL 1 */}
            {editorialBanners[0] && (
              <View style={styles.section}>
                <EditorialCard item={editorialBanners[0]} navigation={navigation} />
              </View>
            )}

            {/* BEST SELLERS */}
            <View style={styles.section}>
              <SectionHeader
                title="Best Sellers"
                subtitle="Most loved by our community"
                onViewAll={() => navigation.navigate('CategoryLanding', { categoryId: 'bestsellers', categoryName: 'Best Sellers' })}
              />

              <ProductRow
                products={bestSellers.length ? bestSellers : PRODUCTS.slice(1, 6)}
                navigation={navigation}
                toggleWishlist={toggleWishlist}
                isInWishlist={isInWishlist}
              />
            </View>

            <Divider />

            {/* SALE BANNER */}
            <View style={styles.section}>
              <FlashSaleBanner navigation={navigation} />
            </View>

            <Divider />

            {/* SHOP BY OCCASION */}
            <View style={styles.section}>
              <SectionHeader
                title="Shop by Occasion"
                onViewAll={() => navigation.navigate('Categories')}
              />
              <ShopByOccasion navigation={navigation} />
            </View>

            <Divider />

            {/* EDITORIAL 2 */}
            {editorialBanners[1] && (
              <View style={styles.section}>
                <EditorialCard item={editorialBanners[1]} navigation={navigation} />
              </View>
            )}

            {/* TRENDING NOW */}
            <View style={styles.section}>
              <SectionHeader
                title="Trending Now"
                subtitle="This season's must-haves"
                onViewAll={() => navigation.navigate('Categories')}
              />
              <ProductRow
                products={feedProducts.slice(0, 6)}
                navigation={navigation}
                toggleWishlist={toggleWishlist}
                isInWishlist={isInWishlist}
                onQuickAdd={handleQuickAdd}
                showQuickAdd
              />
            </View>

            <Divider />

            {/* BEAUTY SPOTLIGHT */}
            <View style={styles.section}>
              <SpotlightBanner
                eyebrow="Beauty Edit"
                title={"Luxury Beauty\nEssentials"}
                cta="SHOP BEAUTY"
                image="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80"
                onPress={() => navigation.navigate('CategoryLanding', { categoryId: 'beauty', categoryName: 'Beauty' })}
              />
            </View>

            {/* SEASONAL EDIT */}
            <View style={styles.section}>
              <SectionHeader
                title="The Seasonal Edit"
                subtitle="Curated for this season"
                onViewAll={() => navigation.navigate('Categories')}
              />
              <ProductRow
                products={feedProducts.slice(2, 7)}
                navigation={navigation}
                toggleWishlist={toggleWishlist}
                isInWishlist={isInWishlist}
              />
            </View>

            <Divider />

            {/* FOOTWEAR SPOTLIGHT */}
            <View style={styles.section}>
              <SpotlightBanner
                eyebrow="Footwear"
                title={"Step Into\nLuxury"}
                cta="SHOP SHOES"
                image="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&q=80"
                onPress={() => navigation.navigate('CategoryLanding', { categoryId: 'shoes', categoryName: 'Shoes' })}
              />
            </View>

            {/* EDITORIAL 3 */}
            {editorialBanners[2] && (
              <View style={styles.section}>
                <EditorialCard item={editorialBanners[2]} navigation={navigation} />
              </View>
            )}

            {/* FEATURED BRANDS */}
            <View style={styles.section}>
              <SectionHeader
                title="Featured Brands"
                onViewAll={() => navigation.navigate('Categories')}
              />
              <BrandStrip navigation={navigation} />
            </View>

            <Divider />

            {/* RECOMMENDED FOR YOU */}
            <View style={styles.section}>
              <SectionHeader
                title="For You"
                subtitle="Personalised picks"
                onViewAll={() => navigation.navigate('Categories')}
              />
              <ProductRow
                products={feedProducts.slice(0, 5)}
                navigation={navigation}
                toggleWishlist={toggleWishlist}
                isInWishlist={isInWishlist}
                onQuickAdd={handleQuickAdd}
                showQuickAdd
              />
            </View>

            <Divider />

            {/* ACCESSORIES SPOTLIGHT */}
            <View style={styles.section}>
              <SpotlightBanner
                eyebrow="Accessories"
                title={"The Bag &\nJewellery Edit"}
                cta="EXPLORE"
                image="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80"
                onPress={() => navigation.navigate('CategoryLanding', { categoryId: 'bags', categoryName: 'Bags' })}
              />
            </View>

            {/* RECENTLY VIEWED */}
            {recentlyViewed?.length > 0 && (
              <View style={styles.section}>
                <SectionHeader
                  title="Recently Viewed"
                  onViewAll={() => navigation.navigate('Categories')}
                />
                <ProductRow
                  products={recentlyViewed.slice(0, 8)}
                  navigation={navigation}
                  toggleWishlist={toggleWishlist}
                  isInWishlist={isInWishlist}
                  onQuickAdd={handleQuickAdd}
                  showQuickAdd
                />
              </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <Text style={styles.footerLogo}>COVORA</Text>
              <Text style={styles.footerSub}>Luxury Women's Fashion & Beauty</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    // no backgroundColor, no border — fully transparent
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
  },
  wordmark: {
    fontFamily: 'Georgia',
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 8,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  headerBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 6,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.gold,
  },
  section: {
    marginTop: 28,
    marginBottom: 4,
  },
  loadingWrap: {
    gap: 0,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    marginTop: 20,
  },
  footerLine: {
    width: 32,
    height: 1,
    backgroundColor: Colors.gold,
    opacity: 0.5,
    marginBottom: 16,
  },
  footerLogo: {
    fontFamily: 'Georgia',
    fontSize: 14,
    letterSpacing: 6,
    color: Colors.grey400,
    marginBottom: 4,
  },
  footerSub: {
    fontSize: 9,
    color: Colors.grey300,
    letterSpacing: 1,
  },
});

export default HomeScreen;
