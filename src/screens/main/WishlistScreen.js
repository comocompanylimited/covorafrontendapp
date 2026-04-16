import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

const { width } = Dimensions.get('window');
const H_PAD = Spacing.screenPaddingHorizontal;
const CARD_GAP = 10;
const CARD_W = (width - H_PAD * 2 - CARD_GAP) / 2;
const CARD_IMG_H = CARD_W * 1.3; // portrait ratio

// ─── Floating tab bar height estimate (pill + safe area buffer)
const TAB_BAR_H = 80;

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ navigation }) => (
  <View style={emptyS.wrap}>
    <View style={emptyS.iconRing}>
      <Feather name="heart" size={28} color={Colors.grey300} />
    </View>
    <Text style={emptyS.title}>Nothing saved yet</Text>
    <Text style={emptyS.sub}>
      Tap the heart on any item to save it here for later.
    </Text>
    <TouchableOpacity
      style={emptyS.btn}
      onPress={() => navigation.navigate('Categories')}
      activeOpacity={0.85}
    >
      <Text style={emptyS.btnText}>CONTINUE SHOPPING</Text>
    </TouchableOpacity>
  </View>
);

const emptyS = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    paddingBottom: TAB_BAR_H,
  },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    color: Colors.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    color: Colors.grey500,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  btn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  btnText: {
    color: Colors.white,
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: '500',
  },
});

// ─── Grid Product Card ────────────────────────────────────────────────────────
const WishlistCard = ({ item, onRemove, onMoveToCart, onPress }) => (
  <View style={cardS.card}>
    {/* Image */}
    <TouchableOpacity
      style={[cardS.imageWrap, { height: CARD_IMG_H }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      {item.isSale && item.discount && (
        <View style={cardS.saleBadge}>
          <Text style={cardS.saleBadgeText}>-{item.discount}%</Text>
        </View>
      )}
      {/* Remove button */}
      <TouchableOpacity
        style={cardS.removeBtn}
        onPress={() => onRemove(item)}
        hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
      >
        <Feather name="heart" size={14} color={Colors.white} solid />
      </TouchableOpacity>
    </TouchableOpacity>

    {/* Info */}
    <View style={cardS.info}>
      <Text style={cardS.brand} numberOfLines={1}>{item.brand}</Text>
      <Text style={cardS.name} numberOfLines={2}>{item.name}</Text>
      <View style={cardS.priceRow}>
        <Text style={cardS.price}>£{item.price.toFixed(2)}</Text>
        {item.originalPrice && (
          <Text style={cardS.originalPrice}>£{item.originalPrice.toFixed(2)}</Text>
        )}
      </View>
      <TouchableOpacity
        style={cardS.bagBtn}
        onPress={() => onMoveToCart(item)}
        activeOpacity={0.85}
      >
        <Feather name="shopping-bag" size={11} color={Colors.white} />
        <Text style={cardS.bagBtnText}>ADD TO BAG</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const cardS = StyleSheet.create({
  card: {
    width: CARD_W,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrap: {
    width: '100%',
    backgroundColor: Colors.grey100,
    overflow: 'hidden',
    position: 'relative',
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#C62828',
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  saleBadgeText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  info: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  brand: {
    fontSize: 8.5,
    fontWeight: '500',
    color: Colors.grey400,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  name: {
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '400',
    color: Colors.black,
    lineHeight: 18,
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
  },
  originalPrice: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.grey400,
    textDecorationLine: 'line-through',
  },
  bagBtn: {
    backgroundColor: Colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 6,
  },
  bagBtnText: {
    color: Colors.white,
    fontSize: 8.5,
    letterSpacing: 1.8,
    fontWeight: '500',
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const WishlistScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { wishlist, toggleWishlist, addToCart } = useApp();

  const handleRemove = (product) => toggleWishlist(product);

  const handleMoveToCart = (product) => {
    addToCart(product, { quantity: 1 });
    toggleWishlist(product);
  };

  const handleMoveAll = () => {
    Alert.alert(
      'Move All to Bag',
      `Add all ${wishlist.length} items to your bag?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Move All',
          onPress: () => {
            wishlist.forEach(item => {
              addToCart(item, { quantity: 1 });
              toggleWishlist(item);
            });
            navigation.navigate('Cart');
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear Saved',
      'Remove all saved items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => wishlist.forEach(item => toggleWishlist(item)),
        },
      ]
    );
  };

  // Pair items into rows of 2 for grid rendering via FlatList numColumns
  const hasItems = wishlist.length > 0;

  // Bottom bar height: sits above floating tab bar
  const bottomBarBottom = TAB_BAR_H + Math.max(insets.bottom, 0);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <Text style={styles.headerTitle}>Saved</Text>
          {hasItems && (
            <View style={styles.headerRight}>
              <Text style={styles.headerCount}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</Text>
              <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7} style={styles.clearBtn}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* ── Content ── */}
      {!hasItems ? (
        <EmptyState navigation={navigation} />
      ) : (
        <>
          <FlatList
            data={wishlist}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={[
              styles.gridContent,
              // extra bottom padding so last row clears both the bottom bar and tab bar
              { paddingBottom: bottomBarBottom + 64 },
            ]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <WishlistCard
                item={item}
                onRemove={handleRemove}
                onMoveToCart={handleMoveToCart}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              />
            )}
          />

          {/* ── Move All to Bag bar — floats above floating tab bar ── */}
          <View style={[styles.bottomBar, { bottom: bottomBarBottom }]}>
            <TouchableOpacity
              style={styles.moveAllBtn}
              onPress={handleMoveAll}
              activeOpacity={0.85}
            >
              <Feather name="shopping-bag" size={14} color={Colors.white} />
              <Text style={styles.moveAllText}>MOVE ALL TO BAG</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  // Header
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerInner: {
    height: 52,
    paddingHorizontal: H_PAD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    color: Colors.black,
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerCount: {
    fontSize: 11,
    color: Colors.grey500,
    letterSpacing: 0.3,
  },
  clearBtn: {
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 12,
    color: Colors.grey500,
    textDecorationLine: 'underline',
  },

  // Grid
  gridContent: {
    paddingHorizontal: H_PAD,
    paddingTop: 16,
  },
  gridRow: {
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    left: H_PAD,
    right: H_PAD,
  },
  moveAllBtn: {
    backgroundColor: Colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 12,
  },
  moveAllText: {
    color: Colors.white,
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: '500',
  },
});

export default WishlistScreen;
