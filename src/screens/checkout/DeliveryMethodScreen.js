import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Shadow } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

const STEPS = ['Bag', 'Shipping', 'Payment', 'Review'];

const LEGACY_DELIVERY_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    desc: '3–5 business days',
    price: 0,
    priceLabel: 'FREE',
    icon: 'package',
  },
  {
    id: 'express',
    name: 'Express Delivery',
    desc: '1–2 business days',
    price: 7.99,
    priceLabel: '£7.99',
    icon: 'zap',
  },
  {
    id: 'next_day',
    name: 'Next Day Delivery',
    desc: 'Order before 2pm',
    price: 12.99,
    priceLabel: '£12.99',
    icon: 'clock',
  },
  {
    id: 'nominated',
    name: 'Nominated Day',
    desc: 'Choose your delivery date',
    price: 9.99,
    priceLabel: '£9.99',
    icon: 'calendar',
  },
];

const DELIVERY_METHODS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    desc: '3-5 business days',
    price: 0,
    priceLabel: 'FREE',
    icon: 'package',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    desc: '1-2 business days',
    price: 7.99,
    priceLabel: '£7.99',
    icon: 'zap',
  },
  {
    id: 'luxury_priority',
    name: 'Luxury Priority Shipping',
    desc: 'Next day with white-glove handling',
    price: 19.99,
    priceLabel: '£19.99',
    icon: 'star',
  },
];

const DeliveryMethodScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { checkoutDelivery, setCheckoutDelivery, checkoutAddress } = useApp();

  const [selectedId, setSelectedId] = useState(checkoutDelivery?.id || 'standard');

  const handleContinue = () => {
    const option = DELIVERY_METHODS.find(o => o.id === selectedId);
    setCheckoutDelivery(option);
    navigation.navigate('PaymentMethod');
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
              <View style={[styles.stepDot, i === 1 && styles.stepDotActive, i === 0 && styles.stepDotDone]}>
                {i === 0
                  ? <Feather name="check" size={12} color={Colors.white} />
                  : <Text style={[styles.stepNum, i === 1 && styles.stepNumActive]}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, i === 1 && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < 3 && <View style={[styles.stepLine, i === 0 && styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Shipping to */}
        {checkoutAddress && (
          <View style={styles.shipToCard}>
            <View style={styles.shipToLeft}>
              <Feather name="map-pin" size={14} color={Colors.gold} />
              <View>
                <Text style={styles.shipToLabel}>SHIPPING TO</Text>
                <Text style={styles.shipToName}>{checkoutAddress.fullName}</Text>
                <Text style={styles.shipToAddr}>{checkoutAddress.line1}, {checkoutAddress.city} {checkoutAddress.postcode}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Text style={styles.changeBtn}>Change</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>DELIVERY OPTIONS</Text>

        {DELIVERY_METHODS.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionCard, selectedId === option.id && styles.optionCardSelected]}
            onPress={() => setSelectedId(option.id)}
            activeOpacity={0.85}
          >
            <View style={[styles.optionIcon, selectedId === option.id && styles.optionIconSelected]}>
              <Feather name={option.icon} size={18} color={selectedId === option.id ? Colors.white : Colors.grey400} />
            </View>
            <View style={styles.optionInfo}>
              <Text style={[styles.optionName, selectedId === option.id && styles.optionNameSelected]}>{option.name}</Text>
              <Text style={styles.optionDesc}>{option.desc}</Text>
            </View>
            <View style={styles.optionRight}>
              <Text style={[styles.optionPrice, option.price === 0 && styles.optionPriceFree]}>
                {option.priceLabel}
              </Text>
              <View style={[styles.radio, selectedId === option.id && styles.radioActive]}>
                {selectedId === option.id && <View style={styles.radioDot} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.noteCard}>
          <Feather name="info" size={14} color={Colors.gold} />
          <Text style={styles.noteText}>All orders are tracked and insured. You'll receive an email confirmation with your tracking number once your order is dispatched.</Text>
        </View>

      </ScrollView>

      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.88}>
          <Text style={styles.ctaBtnText}>CONTINUE TO PAYMENT</Text>
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
  stepDotDone: { borderColor: Colors.black, backgroundColor: Colors.black },
  stepNum: { fontSize: 11, fontWeight: '700', color: Colors.grey400 },
  stepNumActive: { color: Colors.black },
  stepLabel: { fontSize: 9, color: Colors.grey400, letterSpacing: 1 },
  stepLabelActive: { color: Colors.gold, fontWeight: '600' },
  stepLine: { flex: 1, height: 0.5, backgroundColor: Colors.grey200 },
  stepLineDone: { backgroundColor: Colors.black },
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 100 },
  shipToCard: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    backgroundColor: Colors.offWhite, padding: 14, marginBottom: 4,
    borderWidth: 0.5, borderColor: Colors.grey100,
  },
  shipToLeft: { flexDirection: 'row', gap: 10, flex: 1 },
  shipToLabel: { fontSize: 8, fontWeight: '700', color: Colors.grey400, letterSpacing: 2, marginBottom: 3 },
  shipToName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  shipToAddr: { fontSize: 12, color: Colors.grey500, marginTop: 2 },
  changeBtn: { fontSize: 12, color: Colors.gold, textDecorationLine: 'underline', fontWeight: '500' },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 12, marginTop: 20,
  },
  optionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: Colors.grey200, padding: 16, marginBottom: 10,
  },
  optionCardSelected: { borderColor: Colors.gold, backgroundColor: 'rgba(201,168,76,0.04)' },
  optionIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.grey100,
    alignItems: 'center', justifyContent: 'center',
  },
  optionIconSelected: { backgroundColor: Colors.black },
  optionInfo: { flex: 1 },
  optionName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  optionNameSelected: { color: Colors.black },
  optionDesc: { fontSize: 12, color: Colors.grey500 },
  optionRight: { alignItems: 'flex-end', gap: 8 },
  optionPrice: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  optionPriceFree: { color: Colors.success },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.grey300,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.gold },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.gold },
  noteCard: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: 'rgba(201,168,76,0.06)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)',
    padding: 12, marginTop: 8,
  },
  noteText: { flex: 1, fontSize: 12, color: Colors.grey600, lineHeight: 18 },
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
});

export default DeliveryMethodScreen;
