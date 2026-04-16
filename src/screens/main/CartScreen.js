import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

const FREE_SHIPPING_THRESHOLD = 150;
const VALID_PROMO = 'COVORA20';

// ─── Empty Bag ────────────────────────────────────────────────────────────────
const EmptyBag = ({ navigation }) => (
  <View style={emptyS.wrap}>
    <View style={emptyS.iconRing}>
      <Feather name="shopping-bag" size={28} color={Colors.grey300} />
    </View>
    <Text style={emptyS.title}>Your Bag is Empty</Text>
    <Text style={emptyS.sub}>
      Discover the latest arrivals and add your favourite pieces.
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
    paddingHorizontal: 44,
  },
  iconRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    marginBottom: 28,
  },
  btn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 36,
    paddingVertical: 13,
  },
  btnText: { color: Colors.white, fontSize: 10, letterSpacing: 2.5, fontWeight: '500' },
});

// ─── Shipping Progress Bar ────────────────────────────────────────────────────
const ShippingBar = ({ total }) => {
  if (total >= FREE_SHIPPING_THRESHOLD) {
    return (
      <View style={shipS.wrap}>
        <Feather name="check-circle" size={12} color={Colors.success} />
        <Text style={[shipS.text, { color: Colors.success }]}>
          {' '}Complimentary delivery unlocked
        </Text>
      </View>
    );
  }
  const progress = Math.min(total / FREE_SHIPPING_THRESHOLD, 1);
  const remaining = (FREE_SHIPPING_THRESHOLD - total).toFixed(2);
  return (
    <View style={shipS.wrap}>
      <Text style={shipS.text}>
        Spend <Text style={{ fontWeight: '600', color: Colors.black }}>£{remaining}</Text> more for free delivery
      </Text>
      <View style={shipS.track}>
        <View style={[shipS.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const shipS = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  text: {
    fontSize: 11,
    color: Colors.grey500,
    marginBottom: 7,
    letterSpacing: 0.2,
  },
  track: {
    height: 2,
    backgroundColor: Colors.grey100,
    borderRadius: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.black,
    borderRadius: 1,
  },
});

// ─── Cart Item Card ───────────────────────────────────────────────────────────
const CartItem = ({ item, onRemove, onQuantityChange, onProductPress }) => (
  <View style={itemS.card}>
    {/* Image */}
    <TouchableOpacity onPress={onProductPress} activeOpacity={0.88}>
      <Image source={{ uri: item.image }} style={itemS.image} resizeMode="cover" />
    </TouchableOpacity>

    {/* Details */}
    <View style={itemS.details}>
      {/* Brand + Remove */}
      <View style={itemS.topRow}>
        <Text style={itemS.brand} numberOfLines={1}>{item.brand}</Text>
        <TouchableOpacity
          onPress={() => onRemove(item.cartItemId)}
          style={itemS.removeBtn}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          activeOpacity={0.7}
        >
          <Feather name="x" size={14} color={Colors.grey400} />
        </TouchableOpacity>
      </View>

      {/* Name */}
      <Text style={itemS.name} numberOfLines={2}>{item.name}</Text>

      {/* Size / Colour */}
      {(item.selectedSize || item.selectedColor) && (
        <Text style={itemS.meta}>
          {[item.selectedSize, item.selectedColor].filter(Boolean).join('  ·  ')}
        </Text>
      )}

      {/* Price */}
      <View style={itemS.priceRow}>
        <Text style={itemS.price}>£{(item.price * item.quantity).toFixed(2)}</Text>
        {item.originalPrice && (
          <Text style={itemS.originalPrice}>£{(item.originalPrice * item.quantity).toFixed(2)}</Text>
        )}
      </View>

      {/* Quantity stepper */}
      <View style={itemS.qtyRow}>
        <TouchableOpacity
          style={itemS.qtyBtn}
          onPress={() => onQuantityChange(item.cartItemId, item.quantity - 1)}
          activeOpacity={0.7}
          hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
        >
          <Feather name="minus" size={11} color={Colors.black} />
        </TouchableOpacity>
        <Text style={itemS.qty}>{item.quantity}</Text>
        <TouchableOpacity
          style={itemS.qtyBtn}
          onPress={() => onQuantityChange(item.cartItemId, item.quantity + 1)}
          activeOpacity={0.7}
          hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
        >
          <Feather name="plus" size={11} color={Colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const itemS = StyleSheet.create({
  card: {
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
  image: {
    width: 108,
    height: 144,
    backgroundColor: Colors.grey100,
  },
  details: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  brand: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.grey400,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    flex: 1,
    marginRight: 6,
  },
  removeBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Georgia',
    fontSize: 13,
    fontWeight: '400',
    color: Colors.black,
    lineHeight: 18,
    marginBottom: 5,
  },
  meta: {
    fontSize: 10,
    color: Colors.grey400,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  price: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
    letterSpacing: 0.2,
  },
  originalPrice: {
    fontSize: 11,
    color: Colors.grey400,
    textDecorationLine: 'line-through',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.grey200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grey100,
  },
  qty: {
    width: 32,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
    lineHeight: 32,
  },
});

// ─── Promo Code ───────────────────────────────────────────────────────────────
const PromoSection = ({ promoCode, setPromoCode, promoApplied, setPromoApplied, promoError, setPromoError }) => {
  const apply = () => {
    if (promoCode.trim().toUpperCase() === VALID_PROMO) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Invalid code — try COVORA20');
    }
  };

  return (
    <View style={promoS.wrap}>
      <Text style={promoS.label}>PROMO CODE</Text>
      <View style={[promoS.row, promoApplied && promoS.rowApplied]}>
        <TextInput
          style={promoS.input}
          placeholder="Enter code"
          placeholderTextColor={Colors.grey400}
          value={promoCode}
          onChangeText={t => {
            setPromoCode(t);
            setPromoError('');
            if (promoApplied) setPromoApplied(false);
          }}
          autoCapitalize="characters"
          selectionColor={Colors.gold}
          editable={!promoApplied}
        />
        {promoApplied ? (
          <View style={promoS.appliedBadge}>
            <Feather name="check" size={12} color={Colors.success} />
            <Text style={promoS.appliedText}>Applied</Text>
          </View>
        ) : (
          <TouchableOpacity style={promoS.applyBtn} onPress={apply} activeOpacity={0.85}>
            <Text style={promoS.applyText}>APPLY</Text>
          </TouchableOpacity>
        )}
      </View>
      {promoError ? <Text style={promoS.error}>{promoError}</Text> : null}
      {promoApplied ? <Text style={promoS.success}>20% discount applied to your order</Text> : null}
    </View>
  );
};

const promoS = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 16,
    marginTop: 10,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.grey400,
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.grey200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  rowApplied: { borderColor: Colors.success },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: Colors.black,
    letterSpacing: 1,
  },
  applyBtn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { color: Colors.white, fontSize: 9, letterSpacing: 2, fontWeight: '600' },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 5,
  },
  appliedText: { fontSize: 11, color: Colors.success, fontWeight: '500' },
  error: { fontSize: 11, color: Colors.error, marginTop: 6, letterSpacing: 0.2 },
  success: { fontSize: 11, color: Colors.success, marginTop: 6, fontWeight: '500' },
});

// ─── Order Summary ────────────────────────────────────────────────────────────
const OrderSummary = ({ subtotal, discount, shipping, total, promoApplied }) => (
  <View style={summaryS.wrap}>
    <Text style={summaryS.title}>ORDER SUMMARY</Text>

    <View style={summaryS.row}>
      <Text style={summaryS.label}>Subtotal</Text>
      <Text style={summaryS.value}>£{subtotal.toFixed(2)}</Text>
    </View>

    {promoApplied && (
      <View style={summaryS.row}>
        <Text style={[summaryS.label, summaryS.green]}>Discount (COVORA20)</Text>
        <Text style={[summaryS.value, summaryS.green]}>−£{discount.toFixed(2)}</Text>
      </View>
    )}

    <View style={summaryS.row}>
      <Text style={summaryS.label}>Delivery</Text>
      <Text style={[summaryS.value, shipping === 0 && summaryS.green]}>
        {shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}
      </Text>
    </View>

    <View style={summaryS.divider} />

    <View style={summaryS.totalRow}>
      <Text style={summaryS.totalLabel}>Total</Text>
      <Text style={summaryS.totalValue}>£{total.toFixed(2)}</Text>
    </View>

    <Text style={summaryS.taxNote}>Including all applicable taxes</Text>
  </View>
);

const summaryS = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 20,
    marginTop: 10,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.grey400,
    letterSpacing: 2.5,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: { fontSize: 13, color: Colors.grey500, fontWeight: '400' },
  value: { fontSize: 13, color: Colors.black, fontWeight: '500' },
  green: { color: Colors.success },
  divider: { height: 0.5, backgroundColor: Colors.grey100, marginVertical: 12 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  totalLabel: { fontSize: 15, fontWeight: '500', color: Colors.black },
  totalValue: { fontSize: 22, fontFamily: 'Georgia', fontWeight: '400', color: Colors.black },
  taxNote: { fontSize: 10, color: Colors.grey400, letterSpacing: 0.2 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const CartScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { cart, cartTotal, removeFromCart, updateCartQuantity } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const shipping  = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const discount  = promoApplied ? cartTotal * 0.2 : 0;
  const total     = cartTotal - discount + shipping;
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  // Height of sticky checkout bar so scroll content clears it
  const checkoutBarH = 56 + 32 + (insets.bottom > 0 ? insets.bottom + 8 : 20);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <Text style={styles.headerTitle}>My Bag</Text>
          {itemCount > 0 && (
            <View style={styles.countPill}>
              <Text style={styles.countText}>{itemCount}</Text>
            </View>
          )}
        </View>
      </View>

      {cart.length === 0 ? (
        <EmptyBag navigation={navigation} />
      ) : (
        <>
          {/* Shipping progress */}
          <ShippingBar total={cartTotal} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scroll, { paddingBottom: checkoutBarH + 16 }]}
          >
            {/* Items */}
            <View style={styles.itemsBlock}>
              {cart.map(item => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onRemove={removeFromCart}
                  onQuantityChange={updateCartQuantity}
                  onProductPress={() => navigation.navigate('ProductDetail', { product: item })}
                />
              ))}
            </View>

            {/* Continue shopping link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Categories')}
              style={styles.continueLink}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={12} color={Colors.grey500} />
              <Text style={styles.continueLinkText}>Continue Shopping</Text>
            </TouchableOpacity>

            {/* Promo */}
            <PromoSection
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              promoApplied={promoApplied}
              setPromoApplied={setPromoApplied}
              promoError={promoError}
              setPromoError={setPromoError}
            />

            {/* Summary */}
            <OrderSummary
              subtotal={cartTotal}
              discount={discount}
              shipping={shipping}
              total={total}
              promoApplied={promoApplied}
            />

            {/* Trust badges */}
            <View style={styles.trustRow}>
              {[
                { icon: 'lock', text: 'Secure Checkout' },
                { icon: 'refresh-cw', text: '30-Day Returns' },
                { icon: 'truck', text: 'Express Delivery' },
              ].map(badge => (
                <View key={badge.text} style={styles.trustBadge}>
                  <Feather name={badge.icon} size={13} color={Colors.grey400} />
                  <Text style={styles.trustText}>{badge.text}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Sticky checkout bar */}
          <View style={[styles.checkoutBar, { paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 20 }]}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Checkout')}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutLabel}>CHECKOUT</Text>
              <View style={styles.checkoutRight}>
                <Text style={styles.checkoutTotal}>£{total.toFixed(2)}</Text>
                <Feather name="arrow-right" size={14} color={Colors.white} />
              </View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.grey100 },

  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerInner: {
    height: 52,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    color: Colors.black,
    letterSpacing: 0.3,
  },
  countPill: {
    backgroundColor: Colors.black,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countText: { color: Colors.white, fontSize: 10, fontWeight: '600' },

  scroll: { backgroundColor: Colors.grey100 },

  itemsBlock: {
    backgroundColor: Colors.grey100,
    marginBottom: 0,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingTop: 12,
  },

  continueLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 13,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.grey100,
    marginBottom: 8,
  },
  continueLinkText: { fontSize: 12, color: Colors.grey500, letterSpacing: 0.3 },

  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    marginTop: 10,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  trustBadge: { alignItems: 'center', gap: 5 },
  trustText: { fontSize: 9, color: Colors.grey400, letterSpacing: 0.3, textAlign: 'center' },

  // Sticky checkout
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  checkoutBtn: {
    backgroundColor: Colors.black,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  checkoutLabel: {
    color: Colors.white,
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: '600',
  },
  checkoutRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkoutTotal: {
    color: Colors.goldLight,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Georgia',
  },
});

export default CartScreen;
