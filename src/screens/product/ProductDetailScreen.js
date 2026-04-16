import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { ProductCard } from '../../components/common';
import { PRODUCTS, getRelatedProducts } from '../../data/mockProducts';
import { fetchProductDetail } from '../../services/productService';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = Math.round(width * 1.25);

// â”€â”€â”€ Star Rating â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const StarRating = ({ rating, count, size = 14 }) => (
  <View style={starStyles.row}>
    {[1, 2, 3, 4, 5].map(s => (
      <Feather
        key={s}
        name="star"
        size={size}
        color={s <= Math.round(rating) ? Colors.gold : Colors.grey300}
      />
    ))}
    <Text style={starStyles.val}>{rating?.toFixed(1)}</Text>
    {count > 0 && <Text style={starStyles.count}>({count} reviews)</Text>}
  </View>
);
const starStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  val: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginLeft: 4 },
  count: { fontSize: 11, color: Colors.grey400 },
});

// â”€â”€â”€ Expandable Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ExpandableSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const rotation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggle = () => {
    Animated.timing(rotation, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(v => !v);
  };

  const rotateStyle = {
    transform: [{
      rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }),
    }],
  };

  return (
    <View style={expandStyles.container}>
      <TouchableOpacity onPress={toggle} style={expandStyles.header} activeOpacity={0.8}>
        <Text style={expandStyles.title}>{title.toUpperCase()}</Text>
        <Animated.View style={rotateStyle}>
          <Feather name="chevron-down" size={16} color={Colors.grey500} />
        </Animated.View>
      </TouchableOpacity>
      {open && <View style={expandStyles.body}>{children}</View>}
    </View>
  );
};

const expandStyles = StyleSheet.create({
  container: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.grey100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
  },
  title: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.grey600,
    letterSpacing: 2.5,
  },
  body: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingBottom: 20,
  },
});

// â”€â”€â”€ Review Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ReviewCard = ({ review }) => (
  <View style={reviewStyles.card}>
    <View style={reviewStyles.header}>
      <View style={reviewStyles.avatar}>
        <Text style={reviewStyles.avatarText}>{review.author.charAt(0)}</Text>
      </View>
      <View style={reviewStyles.meta}>
        <Text style={reviewStyles.author}>{review.author}</Text>
        <StarRating rating={review.rating} size={11} />
      </View>
      <Text style={reviewStyles.date}>{review.date}</Text>
    </View>
    <Text style={reviewStyles.comment}>{review.comment}</Text>
  </View>
);
const reviewStyles = StyleSheet.create({
  card: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.grey100,
    borderWidth: 1,
    borderColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '600', color: Colors.grey600 },
  meta: { flex: 1, gap: 2 },
  author: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, letterSpacing: 0.2 },
  date: { fontSize: 10, color: Colors.grey400 },
  comment: { fontSize: 13, color: Colors.grey600, lineHeight: 20, letterSpacing: 0.2 },
});

// â”€â”€â”€ Main Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ProductDetailScreen = ({ navigation, route }) => {
  const { product: routeProduct, productId } = route.params || {};
  const insets = useSafeAreaInsets();
  const { toggleWishlist, isInWishlist, addToCart, cartCount, addRecentlyViewed } = useApp();

  const [product, setProduct] = useState(routeProduct || null);
  const [loadingProduct, setLoadingProduct] = useState(!routeProduct && !!productId);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (routeProduct) {
      setProduct(routeProduct);
      setLoadingProduct(false);
      return;
    }
    if (!productId) return;
    let cancelled = false;
    const load = async () => {
      setLoadingProduct(true);
      setLoadError(null);
      try {
        const p = await fetchProductDetail(productId);
        if (!cancelled) setProduct(p);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message);
          const fallbackP = PRODUCTS.find(p => String(p.id) === String(productId));
          if (fallbackP && !cancelled) setProduct(fallbackP);
        }
      } finally {
        if (!cancelled) setLoadingProduct(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [routeProduct, productId]);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const addedAnim = useRef(new Animated.Value(0)).current;
  const galleryX = useRef(new Animated.Value(0)).current;
  const pageEnter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (product?.sizes?.length) {
      setSelectedSize(product.sizes.length > 1 ? product.sizes[1] : product.sizes[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product) addRecentlyViewed(product);
  }, [addRecentlyViewed, product]);

  useEffect(() => {
    Animated.timing(pageEnter, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [pageEnter]);

  const images = product ? (product.images?.length > 0 ? product.images : [product.image]) : [];
  const wishlisted = product ? isInWishlist(product.id) : false;
  const related = product ? getRelatedProducts(product, 6) : [];
  const fallback = product ? PRODUCTS.filter(p => p.id !== product.id).slice(0, 6) : [];
  const relatedProducts = related.length > 0 ? related : fallback;

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart(product, {
      selectedSize,
      selectedColor: product.colorNames?.[selectedColorIdx] || product.colors?.[selectedColorIdx],
      quantity,
    });
    setAddedToCart(true);
    Animated.sequence([
      Animated.timing(addedAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(1300),
      Animated.timing(addedAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(() => setAddedToCart(false));
  }, [addToCart, product, selectedSize, selectedColorIdx, quantity]);

  const goToCart = useCallback(() => {
    navigation.navigate('Main', { screen: 'Cart' });
  }, [navigation]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    addToCart(product, {
      selectedSize,
      selectedColor: product.colorNames?.[selectedColorIdx] || product.colors?.[selectedColorIdx],
      quantity,
    });
    goToCart();
  }, [addToCart, product, selectedSize, selectedColorIdx, quantity, goToCart]);

  const reviewCount = product?.reviews?.length || 0;

  if (loadingProduct) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, padding: 40 }}>
        <Feather name="alert-circle" size={32} color={Colors.grey300} />
        <Text style={{ fontFamily: 'Georgia', fontSize: 18, color: Colors.textPrimary, marginTop: 16, marginBottom: 8 }}>Product Not Found</Text>
        <Text style={{ fontSize: 13, color: Colors.grey500, textAlign: 'center', marginBottom: 24 }}>
          {loadError || 'This product could not be loaded.'}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: Colors.black, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 }}>
          <Text style={{ color: Colors.white, fontSize: 11, letterSpacing: 2.5, fontWeight: '600' }}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Floating Header */}
      <View style={[styles.floatingHeader, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.floatBtn}>
          <Feather name="chevron-left" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.floatRight}>
          <TouchableOpacity onPress={() => toggleWishlist(product)} style={styles.floatBtn}>
            <Feather name="heart" size={20} color={wishlisted ? Colors.gold : Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToCart} style={styles.floatBtn}>
            <Feather name="shopping-bag" size={20} color={Colors.white} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* â”€â”€ Image Gallery â”€â”€ */}
        <View style={{ height: IMAGE_HEIGHT, backgroundColor: Colors.grey100 }}>
          <Animated.FlatList
            data={images}
            horizontal
            pagingEnabled
            bounces={false}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: galleryX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={e => {
              setActiveImageIdx(Math.round(e.nativeEvent.contentOffset.x / width));
            }}
            renderItem={({ item, index }) => {
              const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
              const scale = galleryX.interpolate({
                inputRange,
                outputRange: [1.07, 1, 1.07],
                extrapolate: 'clamp',
              });
              return (
                <Animated.Image
                  source={{ uri: item }}
                  style={{ width, height: IMAGE_HEIGHT, transform: [{ scale }] }}
                  resizeMode="cover"
                />
              );
            }}
          />

          <View style={styles.galleryMeta}>
            <Text style={styles.galleryMetaText}>COVORA EDIT</Text>
            <Text style={styles.galleryMetaCount}>{String(activeImageIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</Text>
          </View>

          {/* Image dots */}
          {images.length > 1 && (
            <View style={styles.imgDots}>
              {images.map((_, i) => (
                <View key={i} style={[styles.imgDot, i === activeImageIdx && styles.imgDotActive]} />
              ))}
            </View>
          )}

          {/* Badges */}
          <View style={styles.imgBadges}>
            {product.isNew && (
              <View style={[styles.badge, { backgroundColor: Colors.black }]}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            )}
            {product.isSale && product.discount && (
              <View style={[styles.badge, { backgroundColor: Colors.error }]}>
                <Text style={styles.badgeText}>-{product.discount}%</Text>
              </View>
            )}
            {product.isBestSeller && !product.isNew && !product.isSale && (
              <View style={[styles.badge, { backgroundColor: Colors.gold }]}>
                <Text style={[styles.badgeText, { color: Colors.black }]}>BESTSELLER</Text>
              </View>
            )}
          </View>

          {/* Low stock */}
          {product.stockCount <= 5 && (
            <View style={styles.stockAlert}>
              <Text style={styles.stockAlertText}>Only {product.stockCount} left</Text>
            </View>
          )}
        </View>

        {/* â”€â”€ Product Info Panel â”€â”€ */}
        <Animated.View
          style={[
            styles.infoPanel,
            {
              opacity: pageEnter,
              transform: [{
                translateY: pageEnter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }),
              }],
            },
          ]}
        >

          {/* Brand / Name / Rating */}
          <View style={styles.nameBlock}>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.name}>{product.name}</Text>
            {product.rating > 0 && (
              <View style={styles.ratingRow}>
                <StarRating rating={product.rating} count={product.reviewCount} />
              </View>
            )}
          </View>

          {/* Price */}
          <View style={styles.priceBlock}>
            <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>£{product.originalPrice.toFixed(2)}</Text>
            )}
            {product.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}% OFF</Text>
              </View>
            )}
          </View>

          {/* â”€â”€ Colour Selector â”€â”€ */}
          {product.colors?.length > 0 && (
            <View style={styles.optionBlock}>
              <Text style={styles.optionLabel}>
                COLOUR:{' '}
                <Text style={styles.optionValue}>
                  {product.colorNames?.[selectedColorIdx] || product.colors[selectedColorIdx]}
                </Text>
              </Text>
              <View style={styles.colorRow}>
                {product.colors.map((hex, i) => (
                  <TouchableOpacity
                    key={hex + i}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: hex },
                      selectedColorIdx === i && styles.colorSwatchActive,
                    ]}
                    onPress={() => setSelectedColorIdx(i)}
                    activeOpacity={0.85}
                  >
                    {selectedColorIdx === i && (
                      <Feather
                        name="check"
                        size={10}
                        color={hex === '#F5F0E8' || hex === '#FFFFFF' || hex === '#C4A882' || hex === '#E8C4A0' ? Colors.black : Colors.white}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* â”€â”€ Size Selector â”€â”€ */}
          {product.sizes?.length > 0 && (
            <View style={styles.optionBlock}>
              <View style={styles.optionHeaderRow}>
                <Text style={styles.optionLabel}>
                  SIZE: <Text style={styles.optionValue}>{selectedSize}</Text>
                </Text>
                <Text style={styles.sizeGuide}>Size Guide</Text>
              </View>
              <View style={styles.sizeRow}>
                {product.sizes.map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
                    onPress={() => setSelectedSize(size)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.sizeBtnText, selectedSize === size && styles.sizeBtnTextActive]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* â”€â”€ Quantity â”€â”€ */}
          <View style={styles.optionBlock}>
            <View style={styles.qtyRow}>
              <Text style={styles.optionLabel}>QTY</Text>
              <View style={styles.qtyControl}>
                <TouchableOpacity
                  onPress={() => setQuantity(q => Math.max(1, q - 1))}
                  style={styles.qtyBtn}
                >
                  <Feather name="minus" size={14} color={Colors.black} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => setQuantity(q => q + 1)}
                  style={styles.qtyBtn}
                >
                  <Feather name="plus" size={14} color={Colors.black} />
                </TouchableOpacity>
              </View>
              {product.inStock !== false && (
                <Text style={styles.stockText}>
                  {product.stockCount <= 5 ? `Only ${product.stockCount} left!` : 'In Stock'}
                </Text>
              )}
            </View>
          </View>

          {/* â”€â”€ CTA Buttons â”€â”€ */}
          <View style={styles.ctaBlock}>
            <TouchableOpacity
              style={[styles.addBtn, addedToCart && styles.addedBtn]}
              onPress={handleAddToCart}
              activeOpacity={0.85}
            >
              <Feather
                name={addedToCart ? 'check' : 'shopping-bag'}
                size={16}
                color={Colors.black}
              />
              <Text style={styles.addBtnText}>
                {addedToCart ? 'ADDED TO BAG' : 'ADD TO BAG'}
              </Text>
            </TouchableOpacity>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.addedToast,
                {
                  opacity: addedAnim,
                  transform: [{
                    translateY: addedAnim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }),
                  }],
                },
              ]}
            >
              <Feather name="check-circle" size={14} color={Colors.success} />
              <Text style={styles.addedToastText}>Added to bag</Text>
            </Animated.View>

            <TouchableOpacity
              style={styles.buyBtn}
              onPress={handleBuyNow}
              activeOpacity={0.85}
            >
              <Text style={styles.buyBtnText}>BUY NOW</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.wishlistBtn, wishlisted && styles.wishlistBtnActive]}
              onPress={() => toggleWishlist(product)}
              activeOpacity={0.85}
            >
              <Feather
                name="heart"
                size={16}
                color={wishlisted ? Colors.gold : Colors.grey500}
              />
              <Text style={[styles.wishlistBtnText, wishlisted && { color: Colors.gold }]}>
                {wishlisted ? 'SAVED TO WISHLIST' : 'SAVE TO WISHLIST'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* â”€â”€ Trust Badges â”€â”€ */}
          <View style={styles.trustRow}>
            {[
              { icon: 'truck', text: 'Free Delivery\nOver £150' },
              { icon: 'rotate-ccw', text: 'Free Returns\n30 Days' },
              { icon: 'shield', text: '100%\nAuthentic' },
            ].map((item) => (
              <View key={item.icon} style={styles.trustItem}>
                <Feather name={item.icon} size={18} color={Colors.gold} />
                <Text style={styles.trustText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* â”€â”€ Expandable Sections â”€â”€ */}
          <ExpandableSection title="Description" defaultOpen>
            <Text style={styles.descText}>{product.description}</Text>
          </ExpandableSection>

          {product.details?.length > 0 && (
            <ExpandableSection title="Product Details">
              {product.details.map((d, i) => (
                <View key={i} style={styles.detailRow}>
                  <View style={styles.detailDot} />
                  <Text style={styles.detailText}>{d}</Text>
                </View>
              ))}
            </ExpandableSection>
          )}

          <ExpandableSection title="Delivery & Returns">
            <Text style={styles.descText}>
              {'Complimentary standard delivery on orders over £150. Express delivery available at checkout.\n\nWe offer free returns within 30 days of purchase. Items must be in original condition with tags attached.\n\nSee our full delivery and returns policy for more details.'}
            </Text>
          </ExpandableSection>

          {/* â”€â”€ Reviews â”€â”€ */}
          {reviewCount > 0 && (
            <ExpandableSection title={`Reviews (${reviewCount})`} defaultOpen>
              <View style={styles.ratingOverview}>
                <Text style={styles.ratingBig}>{product.rating?.toFixed(1)}</Text>
                <View>
                  <StarRating rating={product.rating} count={product.reviewCount} />
                  <Text style={styles.ratingSubtext}>Based on {product.reviewCount} reviews</Text>
                </View>
              </View>
              {product.reviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </ExpandableSection>
          )}

          {/* â”€â”€ Related Products â”€â”€ */}
          <View style={styles.relatedSection}>
            <Text style={styles.relatedEyebrow}>COVORA RECOMMENDS</Text>
            <Text style={styles.relatedTitle}>You May Also Like</Text>
            <FlatList
              data={relatedProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.relatedList}
              ItemSeparatorComponent={() => <View style={{ width: Spacing.itemGap }} />}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  size="sm"
                  fullWidth={false}
                  onPress={() => navigation.replace('ProductDetail', { product: item })}
                  onWishlistToggle={() => toggleWishlist(item)}
                  isWishlisted={isInWishlist(item.id)}
                />
              )}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Floating header
  floatingHeader: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: 8,
  },
  floatBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatRight: { flexDirection: 'row', gap: 8 },
  cartBadge: {
    position: 'absolute',
    top: 2, right: 2,
    width: 13, height: 13,
    borderRadius: 7,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { fontSize: 7, fontWeight: '800', color: Colors.black },

  // Image overlays
  imgDots: {
    position: 'absolute',
    bottom: 16,
    left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  imgDot: {
    width: 5, height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  imgDotActive: { width: 18, backgroundColor: Colors.white },
  imgBadges: {
    position: 'absolute',
    top: 80, left: 16,
    gap: 5,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: Colors.white, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  stockAlert: {
    position: 'absolute',
    bottom: 16, right: 16,
    backgroundColor: 'rgba(198,40,40,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stockAlertText: { color: Colors.white, fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  galleryMeta: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: 'rgba(10,10,10,0.42)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
    alignItems: 'flex-end',
  },
  galleryMetaText: {
    color: Colors.goldLight,
    fontSize: 8,
    letterSpacing: 2.2,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  galleryMetaCount: {
    color: Colors.white,
    fontSize: 10,
    letterSpacing: 1.2,
  },

  // Info panel
  infoPanel: {
    backgroundColor: Colors.white,
    paddingTop: 30,
  },

  nameBlock: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingBottom: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
    marginBottom: 24,
  },
  brand: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.grey400,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  name: {
    fontFamily: 'Georgia',
    fontSize: 30,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 36,
    marginBottom: 14,
  },
  ratingRow: { marginTop: 2 },

  priceBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
  },
  price: { fontSize: 30, fontWeight: '600', color: Colors.textPrimary, letterSpacing: 0.3 },
  originalPrice: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.grey400,
    textDecorationLine: 'line-through',
  },
  discountBadge: { backgroundColor: Colors.error, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  discountText: { color: Colors.white, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  // Options
  optionBlock: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    marginBottom: 20,
  },
  optionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.grey400,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  optionValue: {
    color: Colors.textPrimary,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'none',
  },
  optionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sizeGuide: {
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 1,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },

  colorRow: { flexDirection: 'row', gap: 10 },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchActive: { borderWidth: 2.5, borderColor: Colors.gold },

  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeBtn: {
    minWidth: 50,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.grey200,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  sizeBtnActive: { borderColor: Colors.black, backgroundColor: Colors.black },
  sizeBtnText: { fontSize: 12, fontWeight: '500', color: Colors.grey700, letterSpacing: 0.5 },
  sizeBtnTextActive: { color: Colors.white },

  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.grey200, borderRadius: 8, overflow: 'hidden' },
  qtyBtn: {
    width: 42, height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.grey200,
    lineHeight: 42,
  },
  stockText: { fontSize: 11, color: Colors.grey400, letterSpacing: 0.3, flex: 1 },

  // CTA
  ctaBlock: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    gap: 12,
    marginBottom: 34,
  },
  addBtn: {
    backgroundColor: Colors.gold,
    height: 58,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  addedBtn: { backgroundColor: Colors.goldDark },
  addBtnText: { color: Colors.black, fontSize: 12, letterSpacing: 2.5, fontWeight: '700' },
  addedToast: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(46,125,50,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(46,125,50,0.25)',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addedToastText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
  },
  buyBtn: {
    backgroundColor: Colors.black,
    height: 58,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnText: { color: Colors.white, fontSize: 12, letterSpacing: 2.5, fontWeight: '600' },
  wishlistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: Colors.grey200,
    borderRadius: 10,
    gap: 8,
  },
  wishlistBtnActive: { borderColor: Colors.gold },
  wishlistBtnText: { fontSize: 11, letterSpacing: 2, fontWeight: '500', color: Colors.grey500 },

  // Trust badges
  trustRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 20,
    borderTopWidth: 0.5,
    borderTopColor: Colors.grey100,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
    marginBottom: 0,
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 9,
    color: Colors.grey500,
    letterSpacing: 0.3,
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
  },

  // Expand section content
  descText: {
    fontSize: 14,
    color: Colors.grey600,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  detailDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gold,
    marginTop: 8,
  },
  detailText: { flex: 1, fontSize: 13, color: Colors.grey600, lineHeight: 20 },

  // Reviews
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
  },
  ratingBig: {
    fontFamily: 'Georgia',
    fontSize: 40,
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  ratingSubtext: { fontSize: 11, color: Colors.grey400, marginTop: 4, letterSpacing: 0.3 },

  // Related
  relatedSection: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.grey100,
    paddingTop: 30,
    paddingBottom: 32,
  },
  relatedEyebrow: {
    fontSize: 9,
    letterSpacing: 2.6,
    color: Colors.gold,
    marginBottom: 8,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.screenPaddingHorizontal,
  },
  relatedTitle: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginBottom: 18,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
  },
  relatedList: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
  },
});

export default ProductDetailScreen;


