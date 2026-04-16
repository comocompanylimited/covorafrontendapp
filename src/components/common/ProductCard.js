import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.screenPaddingHorizontal * 2 - Spacing.itemGap) / 2;

const ProductCard = ({
  product,
  onPress,
  onWishlistToggle,
  onQuickAdd,
  isWishlisted = false,
  showQuickAdd = false,
  quickAddLabel = 'ADD TO BAG',
  size = 'md',
  style,
  horizontal = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: isWishlisted ? 1.22 : 0.92, duration: 110, useNativeDriver: true }),
      Animated.timing(heartScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [isWishlisted, heartScale]);

  const handlePressIn = () =>
    Animated.timing(scale, { toValue: 0.975, duration: 130, useNativeDriver: true }).start();

  const handlePressOut = () =>
    Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }).start();

  const { id, name, brand, price, originalPrice, discount, rating, reviewCount, image, isNew, isBestSeller, isSale } = product;

  const cardWidth =
    size === 'sm' ? CARD_WIDTH * 0.8
    : size === 'lg' ? CARD_WIDTH * 1.2
    : size === 'full' ? width - Spacing.screenPaddingHorizontal * 2
    : CARD_WIDTH;

  const imageHeight = size === 'sm' ? 156 : size === 'lg' ? 250 : size === 'full' ? 320 : 220;

  if (horizontal) {
    return (
      <TouchableOpacity
        style={[styles.horizontalCard, style]}
        onPress={onPress}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Image source={{ uri: image }} style={styles.horizontalImage} resizeMode="cover" />
        <View style={styles.horizontalInfo}>
          <Text style={styles.brand} numberOfLines={1}>{brand}</Text>
          <Text style={styles.name} numberOfLines={2}>{name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>£{price.toFixed(2)}</Text>
            {originalPrice ? <Text style={styles.originalPrice}>£{originalPrice.toFixed(2)}</Text> : null}
          </View>
        </View>
        <Animated.View style={[styles.horizontalWishlist, { transform: [{ scale: heartScale }] }]}>
          <TouchableOpacity
            onPress={() => onWishlistToggle && onWishlistToggle(id)}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <Feather name="heart" size={18} color={isWishlisted ? Colors.gold : Colors.grey400} />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        style={[styles.card, { width: cardWidth }]}
        onPress={onPress}
        activeOpacity={0.95}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={[styles.imageContainer, { height: imageHeight }]}>
          <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

          <Animated.View style={[styles.wishlistBtn, { transform: [{ scale: heartScale }] }]}>
            <TouchableOpacity
              onPress={() => onWishlistToggle && onWishlistToggle(id)}
              hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            >
              <View style={[styles.wishlistCircle, isWishlisted && styles.wishlistCircleActive]}>
                <Feather name="heart" size={13} color={isWishlisted ? Colors.gold : Colors.grey500} />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.badges}>
            {isNew ? (
              <View style={[styles.badge, styles.badgeNew]}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            ) : null}
            {isBestSeller && !isNew ? (
              <View style={[styles.badge, styles.badgeBestSeller]}>
                <Text style={styles.badgeText}>BESTSELLER</Text>
              </View>
            ) : null}
            {isSale ? (
              <View style={[styles.badge, styles.badgeSale]}>
                <Text style={styles.badgeText}>SALE</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.brand} numberOfLines={1}>{brand}</Text>
          <Text style={styles.name} numberOfLines={2}>{name}</Text>

          {rating ? (
            <View style={styles.ratingRow}>
              <Feather name="star" size={9} color={Colors.gold} />
              <Text style={styles.rating}>{rating}</Text>
              {reviewCount ? <Text style={styles.reviewCount}>({reviewCount})</Text> : null}
            </View>
          ) : null}

          <View style={styles.priceRow}>
            <Text style={styles.price}>£{price.toFixed(2)}</Text>
            {originalPrice ? <Text style={styles.originalPrice}>£{originalPrice.toFixed(2)}</Text> : null}
            {discount ? <Text style={styles.discount}>-{discount}%</Text> : null}
          </View>

          {showQuickAdd && (
            <TouchableOpacity
              style={styles.quickAddBtn}
              onPress={() => onQuickAdd && onQuickAdd(product)}
              activeOpacity={0.82}
            >
              <Feather name="plus" size={11} color={Colors.white} />
              <Text style={styles.quickAddText}>{quickAddLabel}</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: Colors.grey100,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  wishlistCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  wishlistCircleActive: {
    backgroundColor: Colors.white,
  },
  badges: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'column',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeNew: { backgroundColor: Colors.black },
  badgeBestSeller: { backgroundColor: Colors.gold },
  badgeSale: { backgroundColor: Colors.error },
  badgeText: { color: Colors.white, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },

  info: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  brand: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.grey400,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  name: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 5,
    fontFamily: 'Georgia',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 3,
  },
  rating: { fontSize: 10, color: Colors.grey600, fontWeight: '600' },
  reviewCount: { fontSize: 10, color: Colors.grey400 },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  originalPrice: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.grey400,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.error,
  },

  quickAddBtn: {
    marginTop: 10,
    height: 32,
    borderRadius: 6,
    backgroundColor: Colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  quickAddText: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '600',
    color: Colors.white,
  },

  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  horizontalImage: {
    width: 100,
    height: 125,
    backgroundColor: Colors.grey100,
  },
  horizontalInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  horizontalWishlist: {
    padding: Spacing.sm,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
});

export default ProductCard;
