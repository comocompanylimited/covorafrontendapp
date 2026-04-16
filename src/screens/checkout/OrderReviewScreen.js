import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, ActivityIndicator, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Shadow } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { calculateOrderTotals } from '../../services/cartOrderService';
import { submitOrder } from '../../services/commerceService';

const STEPS = ['Bag', 'Shipping', 'Payment', 'Review'];

const SummaryRow = ({ label, value, isTotal, isDiscount }) => (
  <View style={[styles.summaryRow, isTotal && styles.summaryTotalRow]}>
    <Text style={[styles.summaryLabel, isTotal && styles.summaryTotalLabel, isDiscount && { color: Colors.success }]}>
      {label}
    </Text>
    <Text style={[styles.summaryValue, isTotal && styles.summaryTotalValue, isDiscount && { color: Colors.success }]}>
      {value}
    </Text>
  </View>
);

const OrderReviewScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    cart, cartTotal, user,
    checkoutAddress, checkoutDelivery, checkoutPayment,
    checkoutPromo, checkoutPromoApplied,
    placeOrder,
  } = useApp();

  const [placing, setPlacing] = useState(false);

  const {
    discount,
    subtotal,
    shipping,
    tax,
    total,
  } = calculateOrderTotals({
    cartTotal,
    promoApplied: checkoutPromoApplied,
    deliveryPrice: checkoutDelivery?.price,
  });

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const result = await submitOrder(
        cart,
        { checkoutAddress, checkoutDelivery, checkoutPayment, checkoutPromo, checkoutPromoApplied },
        user
      );
      if (result.ok) {
        placeOrder(result.order);
        navigation.replace('OrderConfirmation', { orderNumber: result.order.number || result.order.id });
      }
    } catch {
      const orderNumber = `COV-${Math.floor(1000 + Math.random() * 9000)}`;
      placeOrder({
        id: orderNumber,
        number: orderNumber,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'Processing',
        statusStep: 1,
        items: cart.map(i => ({ ...i })),
        subtotal,
        discount,
        shipping,
        tax,
        total,
        address: checkoutAddress,
        delivery: checkoutDelivery,
        payment: checkoutPayment,
        promoCode: checkoutPromoApplied ? checkoutPromo : null,
        estimatedDelivery: '3–5 business days',
        trackingNumber: null,
      });
      navigation.replace('OrderConfirmation', { orderNumber });
    } finally {
      setPlacing(false);
    }
  };

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
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepItem}>
              <View style={[styles.stepDot, i === 3 && styles.stepDotActive, i < 3 && styles.stepDotDone]}>
                {i < 3
                  ? <Feather name="check" size={12} color={Colors.white} />
                  : <Text style={[styles.stepNum, styles.stepNumActive]}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, i === 3 && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < 3 && <View style={[styles.stepLine, styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Shipping Summary */}
        <Text style={styles.sectionTitle}>SHIPPING TO</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoCardLeft}>
            <Feather name="map-pin" size={14} color={Colors.gold} />
            <View style={styles.infoCardText}>
              <Text style={styles.infoName}>{checkoutAddress?.fullName}</Text>
              <Text style={styles.infoLine}>{checkoutAddress?.line1}{checkoutAddress?.line2 ? `, ${checkoutAddress.line2}` : ''}</Text>
              <Text style={styles.infoLine}>{checkoutAddress?.city}, {checkoutAddress?.postcode}</Text>
              <Text style={styles.infoLine}>{checkoutAddress?.country}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ShippingAddress')} activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Method */}
        <Text style={styles.sectionTitle}>DELIVERY</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoCardLeft}>
            <Feather name="package" size={14} color={Colors.gold} />
            <View style={styles.infoCardText}>
              <Text style={styles.infoName}>{checkoutDelivery?.name || 'Standard Delivery'}</Text>
              <Text style={styles.infoLine}>{checkoutDelivery?.desc || '3–5 business days'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('DeliveryMethod')} activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Payment */}
        <Text style={styles.sectionTitle}>PAYMENT</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoCardLeft}>
            <Feather name="credit-card" size={14} color={Colors.gold} />
            <View style={styles.infoCardText}>
              <Text style={styles.infoName}>{checkoutPayment?.brand} •••• {checkoutPayment?.last4}</Text>
              <Text style={styles.infoLine}>{checkoutPayment?.cardHolder}</Text>
              <Text style={styles.infoLine}>Expires {checkoutPayment?.expiry}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')} activeOpacity={0.7}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>

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

        {/* Order Summary */}
        <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
        <View style={styles.summaryCard}>
          <SummaryRow label="Subtotal" value={`£${cartTotal.toFixed(2)}`} />
          {checkoutPromoApplied && (
            <SummaryRow label={`Discount (${checkoutPromo} – 20%)`} value={`-£${discount.toFixed(2)}`} isDiscount />
          )}
          <SummaryRow
            label="Delivery"
            value={shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}
          />
          <SummaryRow label="Estimated Total" value={`£${total.toFixed(2)}`} isTotal />
        </View>

        <Text style={styles.taxNote}>Includes estimated tax: £{tax.toFixed(2)}</Text>

        {/* Terms note */}
        <Text style={styles.termsNote}>
          By placing this order you agree to our{' '}
          <Text style={styles.termsLink} onPress={() => navigation.navigate('Terms')}>Terms & Conditions</Text>
          {' '}and{' '}
          <Text style={styles.termsLink} onPress={() => navigation.navigate('Privacy')}>Privacy Policy</Text>.
        </Text>

      </ScrollView>

      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={styles.ctaTotal}>£{total.toFixed(2)}</Text>
        <TouchableOpacity
          style={[styles.ctaBtn, placing && styles.ctaBtnLoading]}
          onPress={handlePlaceOrder}
          disabled={placing}
          activeOpacity={0.88}
        >
          {placing
            ? <ActivityIndicator color={Colors.white} />
            : <>
                <Feather name="lock" size={14} color={Colors.white} />
                <Text style={styles.ctaBtnText}>PLACE ORDER</Text>
              </>
          }
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
  stepDotDone: { borderColor: Colors.black, backgroundColor: Colors.black },
  stepNum: { fontSize: 11, fontWeight: '700', color: Colors.grey400 },
  stepNumActive: { color: Colors.black },
  stepLabel: { fontSize: 9, color: Colors.grey400, letterSpacing: 1 },
  stepLabelActive: { color: Colors.gold, fontWeight: '600' },
  stepLine: { flex: 1, height: 0.5, backgroundColor: Colors.grey200 },
  stepLineDone: { backgroundColor: Colors.black },
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 10, marginTop: 20,
  },
  infoCard: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    borderWidth: 0.5, borderColor: Colors.grey100, padding: 14,
  },
  infoCardLeft: { flexDirection: 'row', gap: 10, flex: 1 },
  infoCardText: { flex: 1 },
  infoName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  infoLine: { fontSize: 12, color: Colors.grey500, lineHeight: 18 },
  editBtn: { fontSize: 12, color: Colors.gold, textDecorationLine: 'underline', fontWeight: '500' },
  orderItem: {
    flexDirection: 'row', marginBottom: Spacing.sm, backgroundColor: Colors.white,
    borderWidth: 0.5, borderColor: Colors.grey100,
  },
  orderItemImg: { width: 80, height: 96, backgroundColor: Colors.grey100 },
  orderItemInfo: { flex: 1, padding: 10, justifyContent: 'center' },
  orderItemBrand: { fontSize: 9, fontWeight: '500', color: Colors.grey400, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 },
  orderItemName: { fontFamily: 'Georgia', fontSize: 12, color: Colors.textPrimary, lineHeight: 17, marginBottom: 3 },
  orderItemMeta: { fontSize: 11, color: Colors.grey400, marginBottom: 4 },
  orderItemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  orderItemPrice: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  orderItemQty: { fontSize: 12, color: Colors.grey500 },
  summaryCard: { borderWidth: 0.5, borderColor: Colors.grey100, padding: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: Colors.grey600 },
  summaryValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  summaryTotalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.grey100, marginBottom: 0 },
  summaryTotalLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  summaryTotalValue: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  termsNote: { fontSize: 11, color: Colors.grey400, lineHeight: 18, textAlign: 'center', marginTop: 16 },
  taxNote: { fontSize: 12, color: Colors.grey500, marginTop: 10, textAlign: 'right' },
  termsLink: { color: Colors.gold, textDecorationLine: 'underline' },
  ctaBar: {
    backgroundColor: Colors.white, paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.border, ...Shadow.lg,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  ctaTotal: { fontFamily: 'Georgia', fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  ctaBtn: {
    flex: 1, backgroundColor: Colors.black, height: 58,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderRadius: 12,
  },
  ctaBtnLoading: { backgroundColor: Colors.grey700 },
  ctaBtnText: { color: Colors.white, fontSize: 12, letterSpacing: 2.5, fontWeight: '600' },
});

export default OrderReviewScreen;
