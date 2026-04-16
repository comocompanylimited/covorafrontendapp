import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput, Switch, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { savePaymentMethodDetails } from '../../services/profileService';

const AddEditPaymentScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { payment } = route.params || {};
  const isEdit = !!payment?.id;
  const { addPaymentMethod, updatePaymentMethod, paymentMethods } = useApp();

  const [form, setForm] = useState({
    nickname:   payment?.nickname   || '',
    cardHolder: payment?.cardHolder || '',
    cardNumber: '',
    expiry:     payment?.expiry    || '',
    cvv:        '',
  });
  const [isDefault, setIsDefault] = useState(payment?.isDefault || paymentMethods.length === 0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
    setSaved(false);
  };

  const formatCardNumber = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry     = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const validate = () => {
    const e = {};
    if (!form.nickname.trim()) e.nickname = 'Card nickname is required';
    if (!form.cardHolder.trim()) e.cardHolder = 'Cardholder name is required';
    if (!isEdit) {
      if (form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
      if (form.expiry.length < 5)  e.expiry  = 'Enter a valid expiry date';
      if (form.cvv.length < 3)     e.cvv     = 'Enter a valid CVV';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    setSaved(false);
    try {
      if (isEdit) {
        const savedPayment = await savePaymentMethodDetails({
          ...payment,
          nickname: form.nickname,
          cardHolder: form.cardHolder,
          isDefault,
        });
        updatePaymentMethod(savedPayment);
      } else {
        const digits = form.cardNumber.replace(/\s/g, '');
        const savedPayment = await savePaymentMethodDetails({
          id: `pay_${Date.now()}`,
          brand: 'Visa',
          last4: digits.slice(-4),
          nickname: form.nickname,
          cardHolder: form.cardHolder,
          expiry: form.expiry,
          isDefault,
        });
        addPaymentMethod(savedPayment);
      }
      setLoading(false);
      setSaved(true);
      setTimeout(() => navigation.goBack(), 450);
    } catch (e) {
      setLoading(false);
      setErrors(prev => ({ ...prev, form: 'Could not save payment method. Please try again.' }));
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
          <Text style={styles.headerTitle}>{isEdit ? 'EDIT CARD' : 'ADD CARD'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {isEdit && (
            <View style={styles.existingCard}>
              <Text style={styles.existingCardNum}>•••• •••• •••• {payment.last4}</Text>
              <Text style={styles.existingCardNote}>Card number cannot be changed</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>CARD DETAILS</Text>

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

          {!isEdit && (
            <>
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

              <View style={styles.row}>
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
                    selectionColor={Colors.gold}
                  />
                  {errors.cvv ? <Text style={styles.fieldError}>{errors.cvv}</Text> : null}
                </View>
              </View>
            </>
          )}

          <View style={styles.defaultRow}>
            <View>
              <Text style={styles.defaultLabel}>Set as default card</Text>
              <Text style={styles.defaultSub}>Used automatically at checkout</Text>
            </View>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: Colors.grey200, true: Colors.gold }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.secureNote}>
            <Feather name="lock" size={12} color={Colors.grey400} />
            <Text style={styles.secureText}>256-bit SSL encryption</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnLoading]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.saveBtnText}>{isEdit ? 'SAVE CHANGES' : 'ADD CARD'}</Text>
            }
          </TouchableOpacity>
          {saved ? (
            <View style={styles.successBanner}>
              <Feather name="check-circle" size={14} color={Colors.success} />
              <Text style={styles.successText}>Payment method saved</Text>
            </View>
          ) : null}
          {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
  existingCard: {
    backgroundColor: Colors.offWhite, padding: 16,
    borderWidth: 0.5, borderColor: Colors.grey100, marginBottom: 8, borderRadius: 10,
  },
  existingCardNum: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, letterSpacing: 2 },
  existingCardNote: { fontSize: 11, color: Colors.grey400, marginTop: 4 },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 12, marginTop: 8,
  },
  row: { flexDirection: 'row' },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 10, fontWeight: '600', color: Colors.grey500, letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' },
  fieldInput: {
    height: 48, borderWidth: 1, borderColor: Colors.grey200,
    borderRadius: 8, paddingHorizontal: Spacing.md, fontSize: 13, color: Colors.textPrimary,
  },
  fieldInputError: { borderColor: Colors.error },
  fieldError: { fontSize: 11, color: Colors.error, marginTop: 4 },
  defaultRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderTopWidth: 0.5, borderTopColor: Colors.grey100, marginTop: 4,
  },
  defaultLabel: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  defaultSub: { fontSize: 11, color: Colors.grey400, marginTop: 2 },
  secureNote: {
    flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 16,
  },
  secureText: { fontSize: 11, color: Colors.grey400 },
  saveBtn: {
    backgroundColor: Colors.black, height: 58,
    alignItems: 'center', justifyContent: 'center', borderRadius: 12,
  },
  saveBtnLoading: { backgroundColor: Colors.grey700 },
  saveBtnText: { color: Colors.white, fontSize: 12, letterSpacing: 2.5, fontWeight: '600' },
  successBanner: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(46,125,50,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(46,125,50,0.25)',
    padding: 12,
    borderRadius: 8,
  },
  successText: { fontSize: 13, color: Colors.success, fontWeight: '500' },
  formError: { fontSize: 12, color: Colors.error, marginTop: 10 },
});

export default AddEditPaymentScreen;

