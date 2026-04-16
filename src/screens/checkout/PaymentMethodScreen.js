import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Shadow } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

const STEPS = ['Bag', 'Shipping', 'Payment', 'Review'];

const cardBrandIcon = (brand) => {
  switch (brand?.toLowerCase()) {
    case 'visa':       return 'VISA';
    case 'mastercard': return 'MC';
    case 'amex':       return 'AMEX';
    default:           return brand?.toUpperCase()?.slice(0, 4) || '****';
  }
};

const PaymentMethodScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { paymentMethods, checkoutPayment, setCheckoutPayment, addPaymentMethod } = useApp();

  const [mode, setMode] = useState(checkoutPayment ? 'select' : paymentMethods.length > 0 ? 'select' : 'new');
  const [selectedId, setSelectedId] = useState(
    checkoutPayment?.id || paymentMethods.find(p => p.isDefault)?.id || paymentMethods[0]?.id || null
  );

  const [form, setForm] = useState({ nickname: '', cardHolder: '', cardNumber: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [saveCard, setSaveCard] = useState(true);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const validate = () => {
    const e = {};
    if (!form.nickname.trim()) e.nickname = 'Card nickname is required';
    if (!form.cardHolder.trim()) e.cardHolder = 'Cardholder name is required';
    const digits = form.cardNumber.replace(/\s/g, '');
    if (!digits || digits.length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
    if (!form.expiry || form.expiry.length < 5) e.expiry = 'Enter a valid expiry date';
    if (!form.cvv || form.cvv.length < 3) e.cvv = 'Enter a valid CVV';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (mode === 'select') {
      const payment = paymentMethods.find(p => p.id === selectedId);
      if (!payment) return;
      setCheckoutPayment(payment);
      navigation.navigate('OrderReview');
    } else {
      if (!validate()) return;
      const digits = form.cardNumber.replace(/\s/g, '');
      const newCard = {
        id: `pay_${Date.now()}`,
        brand: 'Visa',
        last4: digits.slice(-4),
        nickname: form.nickname,
        cardHolder: form.cardHolder,
        expiry: form.expiry,
        isDefault: paymentMethods.length === 0,
      };
      if (saveCard) addPaymentMethod(newCard);
      setCheckoutPayment(newCard);
      navigation.navigate('OrderReview');
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
              <View style={[styles.stepDot, i === 2 && styles.stepDotActive, (i === 0 || i === 1) && styles.stepDotDone]}>
                {i < 2
                  ? <Feather name="check" size={12} color={Colors.white} />
                  : <Text style={[styles.stepNum, i === 2 && styles.stepNumActive]}>{i + 1}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, i === 2 && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < 3 && <View style={[styles.stepLine, i < 2 && styles.stepLineDone]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Saved Cards */}
        {paymentMethods.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>SAVED CARDS</Text>
            {paymentMethods.map(pm => (
              <TouchableOpacity
                key={pm.id}
                style={[styles.cardItem, selectedId === pm.id && mode === 'select' && styles.cardItemSelected]}
                onPress={() => { setSelectedId(pm.id); setMode('select'); }}
                activeOpacity={0.85}
              >
                <View style={[styles.radio, selectedId === pm.id && mode === 'select' && styles.radioActive]}>
                  {selectedId === pm.id && mode === 'select' && <View style={styles.radioDot} />}
                </View>
                <View style={styles.cardBrandBox}>
                  <Text style={styles.cardBrandText}>{cardBrandIcon(pm.brand)}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.cardLabelRow}>
                    <Text style={styles.cardNumber}>•••• •••• •••• {pm.last4}</Text>
                    {pm.isDefault && <View style={styles.defaultBadge}><Text style={styles.defaultBadgeText}>DEFAULT</Text></View>}
                  </View>
                  <Text style={styles.cardHolder}>{pm.nickname || pm.cardHolder}</Text>
                  {pm.nickname ? <Text style={styles.cardSub}>Cardholder: {pm.cardHolder}</Text> : null}
                  <Text style={styles.cardExpiry}>Expires {pm.expiry}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.newCardToggle}
              onPress={() => setMode(mode === 'new' ? 'select' : 'new')}
              activeOpacity={0.85}
            >
              <Feather name={mode === 'new' ? 'minus-circle' : 'plus-circle'} size={16} color={mode === 'new' ? Colors.error : Colors.gold} />
              <Text style={[styles.newCardToggleText, mode === 'new' && { color: Colors.error }]}>
                {mode === 'new' ? 'Cancel New Card' : 'Add New Card'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* New Card Form */}
        {mode === 'new' && (
          <>
            <Text style={styles.sectionTitle}>NEW CARD</Text>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Card Nickname</Text>
              <TextInput
                style={[styles.fieldInput, errors.nickname && styles.fieldInputError]}
                placeholder="e.g. Personal Visa"
                placeholderTextColor={Colors.grey400}
                value={form.nickname}
                onChangeText={v => set('nickname', v)}
                selectionColor={Colors.gold}
              />
              {errors.nickname ? <Text style={styles.fieldError}>{errors.nickname}</Text> : null}
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Cardholder Name</Text>
              <TextInput
                style={[styles.fieldInput, errors.cardHolder && styles.fieldInputError]}
                placeholder="As shown on card"
                placeholderTextColor={Colors.grey400}
                value={form.cardHolder}
                onChangeText={v => set('cardHolder', v)}
                autoCapitalize="characters"
                selectionColor={Colors.gold}
              />
              {errors.cardHolder ? <Text style={styles.fieldError}>{errors.cardHolder}</Text> : null}
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Card Number</Text>
              <TextInput
                style={[styles.fieldInput, errors.cardNumber && styles.fieldInputError]}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={Colors.grey400}
                value={form.cardNumber}
                onChangeText={v => set('cardNumber', formatCardNumber(v))}
                keyboardType="number-pad"
                maxLength={19}
                selectionColor={Colors.gold}
              />
              {errors.cardNumber ? <Text style={styles.fieldError}>{errors.cardNumber}</Text> : null}
            </View>

            <View style={styles.cardRow}>
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Expiry Date</Text>
                <TextInput
                  style={[styles.fieldInput, errors.expiry && styles.fieldInputError]}
                  placeholder="MM/YY"
                  placeholderTextColor={Colors.grey400}
                  value={form.expiry}
                  onChangeText={v => set('expiry', formatExpiry(v))}
                  keyboardType="number-pad"
                  maxLength={5}
                  selectionColor={Colors.gold}
                />
                {errors.expiry ? <Text style={styles.fieldError}>{errors.expiry}</Text> : null}
              </View>
              <View style={{ width: 12 }} />
              <View style={[styles.fieldWrap, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>CVV</Text>
                <TextInput
                  style={[styles.fieldInput, errors.cvv && styles.fieldInputError]}
                  placeholder="•••"
                  placeholderTextColor={Colors.grey400}
                  value={form.cvv}
                  onChangeText={v => set('cvv', v.replace(/\D/g, '').slice(0, 4))}
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                  selectionColor={Colors.gold}
                />
                {errors.cvv ? <Text style={styles.fieldError}>{errors.cvv}</Text> : null}
              </View>
            </View>

            <View style={styles.saveRow}>
              <View>
                <Text style={styles.saveLabel}>Save this card</Text>
                <Text style={styles.saveSub}>Reuse in future orders</Text>
              </View>
              <Switch
                value={saveCard}
                onValueChange={setSaveCard}
                trackColor={{ false: Colors.grey200, true: Colors.gold }}
                thumbColor={Colors.white}
              />
            </View>
          </>
        )}

        {/* Security Note */}
        <View style={styles.secureNote}>
          <Feather name="lock" size={13} color={Colors.grey400} />
          <Text style={styles.secureText}>Your payment details are encrypted with 256-bit SSL security</Text>
        </View>

        {/* Accepted Cards */}
        <View style={styles.acceptedCards}>
          {['VISA', 'MC', 'AMEX', 'JCB'].map(c => (
            <View key={c} style={styles.cardChip}>
              <Text style={styles.cardChipText}>{c}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>ALTERNATIVE PAYMENT</Text>
        <View style={styles.altPayRow}>
          <TouchableOpacity style={styles.altPayBtn} activeOpacity={0.85}>
            <Feather name="smartphone" size={16} color={Colors.black} />
            <Text style={styles.altPayText}>Apple Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.altPayBtn} activeOpacity={0.85}>
            <Feather name="clock" size={16} color={Colors.black} />
            <Text style={styles.altPayText}>Klarna / Afterpay</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={[styles.ctaBar, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.88}>
          <Feather name="lock" size={14} color={Colors.white} />
          <Text style={styles.ctaBtnText}>REVIEW ORDER</Text>
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
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 12, marginTop: 20,
  },
  cardItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: Colors.grey200, padding: 14, marginBottom: 10,
  },
  cardItemSelected: { borderColor: Colors.gold, backgroundColor: 'rgba(201,168,76,0.04)' },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.grey300,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.gold },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.gold },
  cardBrandBox: {
    width: 44, height: 30, borderWidth: 1, borderColor: Colors.grey200,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.offWhite,
  },
  cardBrandText: { fontSize: 9, fontWeight: '800', color: Colors.textPrimary, letterSpacing: 0.5 },
  cardInfo: { flex: 1 },
  cardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  cardNumber: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, letterSpacing: 1 },
  defaultBadge: { backgroundColor: Colors.black, paddingHorizontal: 6, paddingVertical: 2 },
  defaultBadgeText: { fontSize: 8, color: Colors.white, letterSpacing: 1, fontWeight: '600' },
  cardHolder: { fontSize: 11, color: Colors.grey500, marginBottom: 1 },
  cardSub: { fontSize: 10, color: Colors.grey400, marginBottom: 1 },
  cardExpiry: { fontSize: 11, color: Colors.grey400 },
  newCardToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14,
  },
  newCardToggleText: { fontSize: 13, fontWeight: '600', color: Colors.gold, letterSpacing: 0.3 },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 10, fontWeight: '600', color: Colors.grey500, letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' },
  fieldInput: {
    height: 48, borderWidth: 1, borderColor: Colors.grey200,
    paddingHorizontal: Spacing.md, fontSize: 13, color: Colors.textPrimary,
  },
  fieldInputError: { borderColor: Colors.error },
  fieldError: { fontSize: 11, color: Colors.error, marginTop: 4 },
  cardRow: { flexDirection: 'row' },
  saveRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderTopWidth: 0.5, borderTopColor: Colors.grey100, marginTop: 4, marginBottom: 8,
  },
  saveLabel: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  saveSub: { fontSize: 11, color: Colors.grey400, marginTop: 2 },
  secureNote: {
    flexDirection: 'row', gap: 8, alignItems: 'center',
    paddingTop: 16, borderTopWidth: 0.5, borderTopColor: Colors.grey100, marginTop: 4,
  },
  secureText: { flex: 1, fontSize: 11, color: Colors.grey400, lineHeight: 16 },
  acceptedCards: {
    flexDirection: 'row', gap: 8, marginTop: 12,
  },
  altPayRow: { gap: 10, marginTop: 10 },
  altPayBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.grey200,
    backgroundColor: Colors.offWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  altPayText: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  cardChip: {
    borderWidth: 1, borderColor: Colors.grey200,
    paddingHorizontal: 10, paddingVertical: 6, backgroundColor: Colors.offWhite,
  },
  cardChipText: { fontSize: 9, fontWeight: '700', color: Colors.grey500, letterSpacing: 1 },
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

export default PaymentMethodScreen;
