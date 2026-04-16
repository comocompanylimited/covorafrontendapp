import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Image, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { fetchOrderDetails } from '../../services/commerceService';

const STATUS_STEPS = ['Processing', 'Confirmed', 'Shipped', 'Out for delivery', 'Delivered'];

const STATUS_COLORS = {
  Processing:  { bg: 'rgba(255,167,38,0.12)', text: '#E65100' },
  Confirmed:   { bg: 'rgba(255,193,7,0.15)',  text: '#8D6E00' },
  Shipped:     { bg: 'rgba(33,150,243,0.1)',  text: '#1565C0' },
  'Out for delivery': { bg: 'rgba(255,152,0,0.12)', text: '#E65100' },
  Dispatched:  { bg: 'rgba(33,150,243,0.1)',  text: '#1565C0' },
  Delivered:   { bg: 'rgba(46,125,50,0.1)',   text: Colors.success },
  Cancelled:   { bg: 'rgba(198,40,40,0.1)',   text: Colors.error },
};

const OrderDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { orderId } = route.params || {};
  const { orders: localOrders, addToCart } = useApp();

  const [order, setOrder] = useState(localOrders.find(o => o.id === orderId) || null);
  const [loading, setLoading] = useState(!order && !!orderId);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchOrderDetails(orderId, localOrders);
        if (!cancelled && result) setOrder(result);
        else if (!cancelled) setOrder(localOrders.find(o => o.id === orderId) || localOrders[0] || null);
      } catch {
        if (!cancelled) setOrder(localOrders.find(o => o.id === orderId) || localOrders[0] || null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [orderId]);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ORDER DETAIL</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.gold} />
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ORDER DETAIL</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Order not found</Text>
        </View>
      </View>
    );
  }

  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.Processing;
  const normalizedStatus = order.status === 'Dispatched' ? 'Shipped' : order.status;
  const currentStep = STATUS_STEPS.indexOf(normalizedStatus);
  const orderAddress = order.address || order.shippingAddress || {};
  const orderPayment = order.payment || order.paymentMethod || {};

  const handleReorder = () => {
    order.items?.forEach(item => addToCart({ ...item, quantity: item.quantity || 1 }));
    navigation.navigate('Main', { screen: 'Cart' });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ORDER DETAIL</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Order Header */}
        <View style={styles.orderHead}>
          <View>
            <Text style={styles.orderNumber}>{order.number}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{order.status}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        {order.status !== 'Cancelled' && (
          <>
            <Text style={styles.sectionTitle}>DELIVERY PROGRESS</Text>
            <View style={styles.progressWrap}>
              {STATUS_STEPS.map((step, i) => (
                <View key={step} style={styles.progressItem}>
                  <View style={styles.progressLeft}>
                    <View style={[
                      styles.progressDot,
                      i <= currentStep && styles.progressDotDone,
                      i === currentStep && styles.progressDotCurrent,
                    ]}>
                      {i < currentStep && <Feather name="check" size={10} color={Colors.white} />}
                      {i === currentStep && <View style={styles.progressDotInner} />}
                    </View>
                    {i < STATUS_STEPS.length - 1 && (
                      <View style={[styles.progressLine, i < currentStep && styles.progressLineDone]} />
                    )}
                  </View>
                  <Text style={[
                    styles.progressLabel,
                    i === currentStep && styles.progressLabelActive,
                    i < currentStep && styles.progressLabelDone,
                  ]}>{step}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Tracking */}
        {order.trackingNumber && (
          <View style={styles.trackingCard}>
            <Feather name="truck" size={14} color={Colors.gold} />
            <View>
              <Text style={styles.trackingLabel}>TRACKING NUMBER</Text>
              <Text style={styles.trackingNum}>{order.trackingNumber}</Text>
            </View>
          </View>
        )}

        {/* Items */}
        <Text style={styles.sectionTitle}>ITEMS ({order.items?.length})</Text>
        {order.items?.map((item, idx) => (
          <View key={item.cartItemId || idx} style={styles.orderItem}>
            <Image source={{ uri: item.image }} style={styles.itemImg} resizeMode="cover" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemBrand}>{item.brand}</Text>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              {item.selectedSize && <Text style={styles.itemMeta}>Size: {item.selectedSize}</Text>}
              <View style={styles.itemPriceRow}>
                <Text style={styles.itemPrice}>£{item.price?.toFixed(2)}</Text>
                <Text style={styles.itemQty}>× {item.quantity || 1}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Shipping Info */}
        <Text style={styles.sectionTitle}>SHIPPING TO</Text>
        <View style={styles.infoCard}>
          <Feather name="map-pin" size={14} color={Colors.gold} />
          <View>
            <Text style={styles.infoName}>{orderAddress.fullName}</Text>
            <Text style={styles.infoLine}>{orderAddress.line1}{orderAddress.line2 ? `, ${orderAddress.line2}` : ''}</Text>
            <Text style={styles.infoLine}>{orderAddress.city}, {orderAddress.postcode}</Text>
            <Text style={styles.infoLine}>{orderAddress.country}</Text>
          </View>
        </View>

        {/* Payment */}
        <Text style={styles.sectionTitle}>PAYMENT</Text>
        <View style={styles.infoCard}>
          <Feather name="credit-card" size={14} color={Colors.gold} />
          <View>
            <Text style={styles.infoName}>{orderPayment.brand} •••• {orderPayment.last4}</Text>
            <Text style={styles.infoLine}>Expires {orderPayment.expiry}</Text>
          </View>
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>£{order.subtotal?.toFixed(2)}</Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: Colors.success }]}>Discount</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>-£{order.discount?.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryValue, order.shipping === 0 && { color: Colors.success }]}>
              {order.shipping === 0 ? 'FREE' : `£${order.shipping?.toFixed(2)}`}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>£{(order.tax || 0).toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>£{order.total?.toFixed(2)}</Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.reorderBtn} onPress={handleReorder} activeOpacity={0.85}>
          <Feather name="refresh-cw" size={14} color={Colors.white} />
          <Text style={styles.reorderBtnText}>REORDER</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.supportBtn}
          onPress={() => navigation.navigate('ContactSupport')}
          activeOpacity={0.85}
        >
          <Text style={styles.supportBtnText}>Need help with this order?</Text>
          <Feather name="chevron-right" size={14} color={Colors.grey400} />
        </TouchableOpacity>

      </ScrollView>
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
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 60 },
  orderHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingBottom: 16, borderBottomWidth: 0.5, borderBottomColor: Colors.grey100, marginBottom: 4,
  },
  orderNumber: { fontFamily: 'Georgia', fontSize: 20, color: Colors.textPrimary, letterSpacing: 1 },
  orderDate: { fontSize: 12, color: Colors.grey400, marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 12, marginTop: 20,
  },
  progressWrap: { paddingLeft: 4 },
  progressItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  progressLeft: { alignItems: 'center' },
  progressDot: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.grey200,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white,
  },
  progressDotDone: { backgroundColor: Colors.black, borderColor: Colors.black },
  progressDotCurrent: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  progressDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.white },
  progressLine: { width: 1.5, height: 28, backgroundColor: Colors.grey200 },
  progressLineDone: { backgroundColor: Colors.black },
  progressLabel: { fontSize: 13, color: Colors.grey400, paddingTop: 4, paddingBottom: 24 },
  progressLabelActive: { color: Colors.textPrimary, fontWeight: '700' },
  progressLabelDone: { color: Colors.grey500 },
  trackingCard: {
    flexDirection: 'row', gap: 12, alignItems: 'center',
    backgroundColor: Colors.offWhite, padding: 14,
    borderRadius: 10, marginTop: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  trackingLabel: { fontSize: 8, fontWeight: '700', color: Colors.grey400, letterSpacing: 2, marginBottom: 2 },
  trackingNum: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, letterSpacing: 1 },
  orderItem: {
    flexDirection: 'row', marginBottom: 10,
    borderRadius: 10, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  itemImg: { width: 80, height: 96, backgroundColor: Colors.grey100 },
  itemInfo: { flex: 1, padding: 10, justifyContent: 'center' },
  itemBrand: { fontSize: 9, fontWeight: '500', color: Colors.grey400, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 },
  itemName: { fontFamily: 'Georgia', fontSize: 12, color: Colors.textPrimary, lineHeight: 17, marginBottom: 4 },
  itemMeta: { fontSize: 11, color: Colors.grey400, marginBottom: 4 },
  itemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemPrice: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  itemQty: { fontSize: 12, color: Colors.grey500 },
  infoCard: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    borderWidth: 0.5, borderColor: Colors.grey100, padding: 14,
    borderRadius: 10, backgroundColor: Colors.white,
  },
  infoName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  infoLine: { fontSize: 12, color: Colors.grey500, lineHeight: 18 },
  summaryCard: { borderWidth: 0.5, borderColor: Colors.grey100, padding: 16, borderRadius: 10, backgroundColor: Colors.white },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: Colors.grey600 },
  summaryValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  summaryTotalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.grey100, marginBottom: 0 },
  summaryTotalLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  summaryTotalValue: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  reorderBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.black, height: 54, marginTop: 24, borderRadius: 12,
  },
  reorderBtnText: { color: Colors.white, fontSize: 11, letterSpacing: 2.5, fontWeight: '700' },
  supportBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 16,
  },
  supportBtnText: { fontSize: 13, color: Colors.grey500, textDecorationLine: 'underline' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontFamily: 'Georgia', fontSize: 20, color: Colors.textPrimary },
});

export default OrderDetailScreen;


