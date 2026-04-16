import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput, Switch, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Shadow } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

const STEPS = ['Bag', 'Shipping', 'Payment', 'Review'];

const ShippingAddressScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { addresses, checkoutAddress, setCheckoutAddress, addAddress } = useApp();

  const [mode, setMode] = useState(checkoutAddress ? 'select' : addresses.length > 0 ? 'select' : 'new');
  const [selectedId, setSelectedId] = useState(checkoutAddress?.id || addresses.find(a => a.isDefault)?.id || addresses[0]?.id || null);

  const [form, setForm] = useState({ fullName: '', phone: '', line1: '', line2: '', city: '', postcode: '', country: 'United Kingdom' });
  const [errors, setErrors] = useState({});
  const [saveAddress, setSaveAddress] = useState(true);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.trim())    e.phone    = 'Phone number is required';
    if (!form.line1.trim())    e.line1    = 'Address is required';
    if (!form.city.trim())     e.city     = 'City is required';
    if (!form.postcode.trim()) e.postcode = 'Postcode is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (mode === 'select') {
      const addr = addresses.find(a => a.id === selectedId);
      if (!addr) return;
      setCheckoutAddress(addr);
      navigation.navigate('DeliveryMethod');
    } else {
      if (!validate()) return;
      const newAddr = {
        id: `addr_${Date.now()}`,
        label: 'Home',
        fullName: form.fullName,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        postcode: form.postcode,
        country: form.country,
        isDefault: addresses.length === 0,
      };
      if (saveAddress) addAddress(newAddr);
      setCheckoutAddress(newAddr);
      navigation.navigate('DeliveryMethod');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Saved Addresses */}
          {addresses.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>SAVED ADDRESSES</Text>
              {addresses.map(addr => (
                <TouchableOpacity
                  key={addr.id}
                  style={[styles.addressCard, selectedId === addr.id && mode === 'select' && styles.addressCardSelected]}
                  onPress={() => { setSelectedId(addr.id); setMode('select'); }}
                  activeOpacity={0.85}
                >
                  <View style={styles.addressCardLeft}>
                    <View style={[styles.radio, selectedId === addr.id && mode === 'select' && styles.radioActive]}>
                      {selectedId === addr.id && mode === 'select' && <View style={styles.radioDot} />}
                    </View>
                    <View style={styles.addressInfo}>
                      <View style={styles.addressLabelRow}>
                        <Text style={styles.addressLabel}>{addr.label}</Text>
                        {addr.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>DEFAULT</Text></View>}
                      </View>
                      <Text style={styles.addressName}>{addr.fullName}</Text>
                      <Text style={styles.addressLine}>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</Text>
                      <Text style={styles.addressLine}>{addr.city}, {addr.postcode}</Text>
                      <Text style={styles.addressLine}>{addr.country}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.newAddressToggle, mode === 'new' && styles.newAddressToggleActive]}
                onPress={() => setMode(mode === 'new' ? 'select' : 'new')}
                activeOpacity={0.85}
              >
                <Feather name={mode === 'new' ? 'minus-circle' : 'plus-circle'} size={16} color={mode === 'new' ? Colors.error : Colors.gold} />
                <Text style={[styles.newAddressToggleText, mode === 'new' && { color: Colors.error }]}>
                  {mode === 'new' ? 'Cancel New Address' : 'Add New Address'}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* New Address Form */}
          {mode === 'new' && (
            <>
              <Text style={styles.sectionTitle}>NEW ADDRESS</Text>

              <Field label="Full Name" placeholder="Jane Smith" value={form.fullName}
                onChangeText={v => set('fullName', v)} error={errors.fullName} autoCapitalize="words" />
              <Field label="Phone Number" placeholder="+44 7700 000000" value={form.phone}
                onChangeText={v => set('phone', v)} keyboardType="phone-pad" error={errors.phone} />
              <Field label="Address Line 1" placeholder="123 High Street" value={form.line1}
                onChangeText={v => set('line1', v)} error={errors.line1} autoCapitalize="words" />
              <Field label="Address Line 2 (optional)" placeholder="Flat / Suite / Building" value={form.line2}
                onChangeText={v => set('line2', v)} autoCapitalize="words" />

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field label="City" placeholder="London" value={form.city}
                    onChangeText={v => set('city', v)} error={errors.city} autoCapitalize="words" />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                  <Field label="Postcode" placeholder="SW1A 1AA" value={form.postcode}
                    onChangeText={v => set('postcode', v.toUpperCase())} error={errors.postcode} autoCapitalize="characters" />
                </View>
              </View>

              <Field label="Country" placeholder="United Kingdom" value={form.country}
                onChangeText={v => set('country', v)} autoCapitalize="words" />

              <View style={styles.saveRow}>
                <View>
                  <Text style={styles.saveLabel}>Save to my addresses</Text>
                  <Text style={styles.saveSub}>Reuse in future orders</Text>
                </View>
                <Switch
                  value={saveAddress}
                  onValueChange={setSaveAddress}
                  trackColor={{ false: Colors.grey200, true: Colors.gold }}
                  thumbColor={Colors.white}
                />
              </View>
            </>
          )}

        </ScrollView>

        <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.88}>
            <Text style={styles.ctaBtnText}>CONTINUE TO DELIVERY</Text>
            <Feather name="arrow-right" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const Field = ({ label, error, ...props }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.fieldInput, error && styles.fieldInputError]}
      placeholderTextColor={Colors.grey400}
      selectionColor={Colors.gold}
      {...props}
    />
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>
);

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
    letterSpacing: 2.5, marginBottom: 12, marginTop: 20,
  },
  addressCard: {
    borderWidth: 1, borderColor: Colors.grey200,
    padding: 14, marginBottom: 10,
  },
  addressCardSelected: { borderColor: Colors.gold, backgroundColor: 'rgba(201,168,76,0.04)' },
  addressCardLeft: { flexDirection: 'row', gap: 12 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.grey300,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  radioActive: { borderColor: Colors.gold },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.gold },
  addressInfo: { flex: 1 },
  addressLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  addressLabel: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 1, textTransform: 'uppercase' },
  defaultBadge: {
    backgroundColor: Colors.black, paddingHorizontal: 6, paddingVertical: 2,
  },
  defaultBadgeText: { fontSize: 8, color: Colors.white, letterSpacing: 1, fontWeight: '600' },
  addressName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  addressLine: { fontSize: 12, color: Colors.grey500, lineHeight: 18 },
  newAddressToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 14, marginTop: 4,
  },
  newAddressToggleText: { fontSize: 13, fontWeight: '600', color: Colors.gold, letterSpacing: 0.3 },
  row: { flexDirection: 'row' },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 10, fontWeight: '600', color: Colors.grey500, letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' },
  fieldInput: {
    height: 48, borderWidth: 1, borderColor: Colors.grey200,
    paddingHorizontal: Spacing.md, fontSize: 13, color: Colors.textPrimary,
  },
  fieldInputError: { borderColor: Colors.error },
  fieldError: { fontSize: 11, color: Colors.error, marginTop: 4 },
  saveRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderTopWidth: 0.5, borderTopColor: Colors.grey100, marginTop: 4,
  },
  saveLabel: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  saveSub: { fontSize: 11, color: Colors.grey400, marginTop: 2 },
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

export default ShippingAddressScreen;
