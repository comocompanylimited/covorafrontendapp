import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Shadow } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { BrandLogo } from '../../components/common';

const OrderConfirmationScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { orderNumber } = route.params || {};
  const { orders } = useApp();

  const order = orders.find(o => o.number === orderNumber) || orders[0];
  const orderAddress = order?.address || order?.shippingAddress || {};

  const checkAnim  = useRef(new Animated.Value(0)).current;
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(checkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const checkScale = checkAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1.2, 1] });

  const STATUS_STEPS = [
    { label: 'Order Placed',   icon: 'check-circle', done: true },
    { label: 'Processing',     icon: 'clock',         done: false },
    { label: 'Dispatched',     icon: 'package',       done: false },
    { label: 'Delivered',      icon: 'home',          done: false },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Success Hero */}
        <View style={styles.hero}>
          <BrandLogo variant="goldOnLight" width={84} style={styles.heroLogo} />
          <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}>
            <Feather name="check" size={36} color={Colors.white} />
          </Animated.View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Text style={styles.heroTitle}>Order Confirmed</Text>
            <Text style={styles.heroSub}>Thank you for your purchase</Text>
            <View style={styles.orderNumBadge}>
              <Text style={styles.orderNumLabel}>ORDER NUMBER</Text>
              <Text style={styles.orderNum}>{order?.number}</Text>
            </View>
              <Text style={styles.heroNote}>
                A confirmation email has been sent to{'\n'}
                {orderAddress.fullName ? `${orderAddress.fullName}'s email` : 'your email address'}.
              </Text>
              <Text style={styles.heroCampaign}>Luxury delivered with signature COVORA care.</Text>
            </Animated.View>
        </View>

        {/* Order Status Timeline */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.sectionTitle}>ORDER STATUS</Text>
          <View style={styles.timeline}>
            {STATUS_STEPS.map((step, i) => (
              <View key={step.label} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, i === 0 && styles.timelineDotActive, step.done && styles.timelineDotDone]}>
                    <Feather name={step.icon} size={12} color={i === 0 ? Colors.white : Colors.grey400} />
                  </View>
                  {i < STATUS_STEPS.length - 1 && (
                    <View style={[styles.timelineLine, i === 0 && styles.timelineLineActive]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineLabel, i === 0 && styles.timelineLabelActive]}>{step.label}</Text>
                  {i === 0 && <Text style={styles.timelineDate}>{order?.date}</Text>}
                  {i === 1 && <Text style={styles.timelineDate}>Estimated: {order?.estimatedDelivery || '3–5 business days'}</Text>}
                </View>
              </View>
            ))}
          </View>

          {/* Delivery Info */}
          <Text style={styles.sectionTitle}>DELIVERING TO</Text>
          <View style={styles.infoCard}>
            <Feather name="map-pin" size={14} color={Colors.gold} />
            <View style={styles.infoText}>
              <Text style={styles.infoName}>{orderAddress.fullName}</Text>
              <Text style={styles.infoLine}>{orderAddress.line1}{orderAddress.line2 ? `, ${orderAddress.line2}` : ''}</Text>
              <Text style={styles.infoLine}>{orderAddress.city}, {orderAddress.postcode}</Text>
            </View>
          </View>

          {/* Order Summary */}
          <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>£{order?.subtotal?.toFixed(2)}</Text>
            </View>
            {order?.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: Colors.success }]}>Discount</Text>
                <Text style={[styles.summaryValue, { color: Colors.success }]}>-£{order?.discount?.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, order?.shipping === 0 && { color: Colors.success }]}>
                {order?.shipping === 0 ? 'FREE' : `£${order?.shipping?.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>£{(order?.tax || 0).toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotalRow]}>
              <Text style={styles.summaryTotalLabel}>Total Paid</Text>
              <Text style={styles.summaryTotalValue}>£{order?.total?.toFixed(2)}</Text>
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.navigate('OrderDetail', { orderId: order?.id })}
            activeOpacity={0.85}
          >
            <Feather name="package" size={16} color={Colors.black} />
            <Text style={styles.trackBtnText}>TRACK MY ORDER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate('Main')}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>CONTINUE SHOPPING</Text>
            <Feather name="arrow-right" size={14} color={Colors.gold} />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Need help with your order?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ContactSupport')} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { paddingBottom: 60 },
  hero: {
    alignItems: 'center', paddingTop: 48, paddingBottom: 32,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    backgroundColor: Colors.offWhite,
    borderBottomWidth: 0.5, borderBottomColor: Colors.grey100,
  },
  heroLogo: {
    marginBottom: -8,
    opacity: 0.95,
  },
  checkCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.black,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.black, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 10,
  },
  heroTitle: { fontFamily: 'Georgia', fontSize: 30, color: Colors.textPrimary, textAlign: 'center', marginBottom: 6 },
  heroSub: { fontSize: 14, color: Colors.grey500, textAlign: 'center', marginBottom: 20 },
  orderNumBadge: {
    borderWidth: 1, borderColor: Colors.gold,
    paddingHorizontal: 20, paddingVertical: 10, marginBottom: 16, alignItems: 'center',
    backgroundColor: 'rgba(201,168,76,0.06)',
  },
  orderNumLabel: { fontSize: 8, fontWeight: '600', color: Colors.grey400, letterSpacing: 2.5, marginBottom: 4 },
  orderNum: { fontFamily: 'Georgia', fontSize: 20, color: Colors.textPrimary, letterSpacing: 2 },
  heroNote: { fontSize: 12, color: Colors.grey500, textAlign: 'center', lineHeight: 18 },
  heroCampaign: {
    marginTop: 10,
    fontSize: 11,
    color: Colors.grey500,
    letterSpacing: 0.4,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 12, marginTop: 24,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
  },
  timeline: { paddingHorizontal: Spacing.screenPaddingHorizontal },
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', marginRight: 14 },
  timelineDot: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1.5, borderColor: Colors.grey200,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white,
  },
  timelineDotActive: { backgroundColor: Colors.black, borderColor: Colors.black },
  timelineDotDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  timelineLine: { width: 1.5, flex: 1, backgroundColor: Colors.grey200, minHeight: 28 },
  timelineLineActive: { backgroundColor: Colors.black },
  timelineContent: { flex: 1, paddingBottom: 20, paddingTop: 4 },
  timelineLabel: { fontSize: 13, color: Colors.grey500, fontWeight: '500' },
  timelineLabelActive: { color: Colors.textPrimary, fontWeight: '700' },
  timelineDate: { fontSize: 11, color: Colors.grey400, marginTop: 2 },
  infoCard: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    borderWidth: 0.5, borderColor: Colors.grey100, padding: 14,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  infoText: { flex: 1 },
  infoName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  infoLine: { fontSize: 12, color: Colors.grey500, lineHeight: 18 },
  summaryCard: {
    borderWidth: 0.5, borderColor: Colors.grey100, padding: 16,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: Colors.grey600 },
  summaryValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  summaryTotalRow: { marginTop: 8, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.grey100, marginBottom: 0 },
  summaryTotalLabel: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  summaryTotalValue: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  trackBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1.5, borderColor: Colors.black, height: 54,
    marginHorizontal: Spacing.screenPaddingHorizontal, marginTop: 24,
    borderRadius: 12,
  },
  trackBtnText: { fontSize: 11, letterSpacing: 2.5, fontWeight: '700', color: Colors.black },
  continueBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, marginHorizontal: Spacing.screenPaddingHorizontal, marginTop: 10,
  },
  continueBtnText: { fontSize: 11, letterSpacing: 2, fontWeight: '600', color: Colors.gold },
  footer: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
    marginTop: 8, paddingBottom: 8,
  },
  footerText: { fontSize: 12, color: Colors.grey500 },
  footerLink: { fontSize: 12, color: Colors.gold, textDecorationLine: 'underline', fontWeight: '500' },
});

export default OrderConfirmationScreen;
