import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, StatusBar, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Shadow } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { calculateOrderTotals } from '../../services/cartOrderService';

const PROMO_CODE = 'COVORA20';

const CheckoutScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    cart, cartTotal, isAuthenticated, user,
    checkoutPromo, checkoutPromoApplied, setCheckoutPromo,
  } = useApp();

  const [promoInput, setPromoInput] = useState(checkoutPromo);
  const [promoApplied, setPromoApplied] = useState(checkoutPromoApplied);
  const [promoError, setPromoError]     = useState('');

  const { discount, shipping, tax, total } = calculateOrderTotals({
    cartTotal,
    promoApplied,
  });

  const applyPromo = () => {
    if (promoInput.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      setPromoError('');
      setCheckoutPromo(promoInput.trim().toUpperCase(), true);
    } else {
      setPromoApplied(false);
      setPromoError('Invalid code. Try COVORA20');
      setCheckoutPromo('', false);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CHECKOUT</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Feather name="shopping-bag" size={40} color={Colors.grey300} />
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Categories')} activeOpacity={0.85}>
            <Text style={styles.emptyBtnText}>CONTINUE SHOPPING</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHECKOUT</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Steps */}
      <View style={styles.steps}>
        {['Bag', 'Shipping', 'Payment', 'Review'].map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, i === 0 && styles.stepDotActive]}>
                <Text style={[styles.stepNum, i === 0 && styles.stepNumActive]}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepLabel, i === 0 && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < 3 && <View style={styles.stepLine} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Auth prompt */}
        {!isAuthenticated && (
          <TouchableOpacity
            style={styles.authPrompt}
            onPress={() => navigation.navigate('SignIn')}
            activeOpacity={0.88}
          >
            <View style={styles.authPromptLeft}>
              <Feather name="user" size={18} color={Colors.gold} />
              <View>
                <Text style={styles.authPromptTitle}>Sign in for a faster checkout</Text>
                <Text style={styles.authPromptSub}>Access saved addresses & payments</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={Colors.grey400} />
          </TouchableOpacity>
        )}

        {isAuthenticated && (
          <View style={styles.userGreeting}>
            <Feather name="check-circle" size={16} color={Colors.success} />
            <Text style={styles.userGreetingText}>Signed in as {user?.name || user?.email}</Text>
          </View>
        )}

        {/* Order Items */}
        <Text style={styles.sectionTitle}>ORDER ITEMS ({cart.length})</Text>
        {cart.map(item => (
          <View key={item.cartItemId} style={styles.orderItem}>
            <Image source={{ uri: item.image }} style={styles.orderItemImg} resizeMode="cover" />
            <View style={styles.orderItemInfo}>
              <Text style={styles.orderItemBrand}>{item.brand}</Text>
              <Text style={styles.orderItemName} numberOfLines={2}>{item.name}</Text>
              {item.selectedSize && <Text style={styles.orderItemMeta}>Size: {item.selectedSize}</Text>}
              <View style={styles.orderItemPriceRow}>
                <Text style={styles.orderItemPrice}>£{item.price.toFixed(2)}</Text>
                <Text style={styles.orderItemQty}>× {item.quantity}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Promo Code */}
        <Text style={styles.sectionTitle}>PROMO CODE</Text>
        <View style={styles.promoRow}>
          <TextInput
            style={styles.promoInput}
            placeholder="Enter promo code (COVORA20)"
            placeholderTextColor={Colors.grey400}
            value={promoInput}
            onChangeText={v => { setPromoInput(v); setPromoError(''); setPromoApplied(false); }}
            autoCapitalize="characters"
            selectionColor={Colors.gold}
          />
          <TouchableOpacity
            style={[styles.promoBtn, promoApplied && styles.promoBtnApplied]}
            onPress={applyPromo}
            activeOpacity={0.85}
          >
            <Text style={styles.promoBtnText}>{promoApplied ? '✓' : 'APPLY'}</Text>
          </TouchableOpacity>
        </View>
        {promoError ? <Text style={styles.promoError}>{promoError}</Text> : null}
        {promoApplied ? <Text style={styles.promoSuccess}>20% discount applied!</Text> : null}

        {/* Order Summary */}
        <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>£{cartTotal.toFixed(2)}</Text>
          </View>
          {promoApplied && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: Colors.success }]}>Discount (20%)</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>-£{discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryValue, shipping === 0 && { color: Colors.success }]}>
              {shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (estimated)</Text>
            <Text style={styles.summaryValue}>£{tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.summaryTotalLabel}>Estimated Total</Text>
            <Text style={styles.summaryTotalValue}>£{total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('ShippingAddress')}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaBtnText}>CONTINUE TO SHIPPING</Text>
          <Feather name="arrow-right" size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    height: 56, paddingHorizontal: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 0.5, borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Georgia', fontSize: 16, letterSpacing: 3, color: Colors.black },
  steps: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: Colors.grey100,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.grey200,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { borderColor: Colors.gold, backgroundColor: Colors.gold },
  stepNum: { fontSize: 11, fontWeight: '700', color: Colors.grey400 },
  stepNumActive: { color: Colors.black },
  stepLabel: { fontSize: 9, color: Colors.grey400, letterSpacing: 1 },
  stepLabelActive: { color: Colors.gold, fontWeight: '600' },
  stepLine: { flex: 1, height: 0.5, backgroundColor: Colors.grey200 },
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 100 },
  authPrompt: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(201,168,76,0.06)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)',
    padding: 14, marginBottom: 20, gap: 12,
  },
  authPromptLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  authPromptTitle: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  authPromptSub: { fontSize: 11, color: Colors.grey400, marginTop: 2 },
  userGreeting: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 16, paddingVertical: 8,
  },
  userGreetingText: { fontSize: 13, color: Colors.success, fontWeight: '500' },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 12, marginTop: 20,
  },
  orderItem: {
    flexDirection: 'row', marginBottom: Spacing.sm, backgroundColor: Colors.white,
    borderWidth: 0.5, borderColor: Colors.grey100,
  },
  orderItemImg: { width: 90, height: 110, backgroundColor: Colors.grey100 },
  orderItemInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  orderItemBrand: { fontSize: 9, fontWeight: '500', color: Colors.grey400, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 },
  orderItemName: { fontFamily: 'Georgia', fontSize: 13, color: Colors.textPrimary, lineHeight: 18, marginBottom: 4 },
  orderItemMeta: { fontSize: 11, color: Colors.grey400, marginBottom: 6 },
  orderItemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderItemPrice: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  orderItemQty: { fontSize: 12, color: Colors.grey500 },
  promoRow: { flexDirection: 'row', borderWidth: 1, borderColor: Colors.grey200, overflow: 'hidden' },
  promoInput: { flex: 1, paddingHorizontal: Spacing.md, fontSize: 13, color: Colors.textPrimary, height: 48, letterSpacing: 1 },
  promoBtn: { backgroundColor: Colors.black, height: 48, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  promoBtnApplied: { backgroundColor: Colors.success },
  promoBtnText: { color: Colors.white, fontSize: 10, letterSpacing: 2, fontWeight: '600' },
  promoError: { fontSize: 11, color: Colors.error, marginTop: 6 },
  promoSuccess: { fontSize: 11, color: Colors.success, marginTop: 6, fontWeight: '500' },
  summaryCard: { borderWidth: 0.5, borderColor: Colors.grey100, padding: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: Colors.grey600 },
  summaryValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  summaryTotalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.grey100, marginBottom: 0 },
  summaryTotalLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  summaryTotalValue: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  ctaBar: {
    backgroundColor: Colors.white, paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.border, ...Shadow.lg,
  },
  ctaBtn: {
    backgroundColor: Colors.black, height: 58,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderRadius: 12,
  },
  ctaBtnText: { color: Colors.white, fontSize: 12, letterSpacing: 2.5, fontWeight: '600' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyTitle: { fontFamily: 'Georgia', fontSize: 20, color: Colors.textPrimary },
  emptyBtn: { backgroundColor: Colors.black, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 8 },
  emptyBtnText: { color: Colors.white, fontSize: 11, letterSpacing: 2.5, fontWeight: '500' },
});

export default CheckoutScreen;
