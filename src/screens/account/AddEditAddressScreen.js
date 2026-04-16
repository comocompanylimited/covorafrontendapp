import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput, Switch, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { saveAddressDetails } from '../../services/profileService';

const LABELS = ['Home', 'Work', 'Partner', 'Other'];

const AddEditAddressScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { address } = route.params || {};
  const isEdit = !!address?.id;
  const { addAddress, updateAddress, addresses } = useApp();

  const [form, setForm] = useState({
    label:    address?.label    || 'Home',
    fullName: address?.fullName || '',
    phone:    address?.phone    || '',
    line1:    address?.line1    || '',
    line2:    address?.line2    || '',
    city:     address?.city     || '',
    postcode: address?.postcode || '',
    country:  address?.country  || 'United Kingdom',
  });
  const [isDefault, setIsDefault] = useState(address?.isDefault || addresses.length === 0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
    setSaved(false);
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

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    setSaved(false);
    try {
      const payload = await saveAddressDetails({
        id: isEdit ? address?.id : `addr_${Date.now()}`,
        ...form,
        isDefault,
      });
      if (isEdit) {
        updateAddress({ ...address, ...payload });
      } else {
        addAddress(payload);
      }
      setLoading(false);
      setSaved(true);
      setTimeout(() => navigation.goBack(), 450);
    } catch (e) {
      setLoading(false);
      setErrors(prev => ({ ...prev, form: 'Could not save address. Please try again.' }));
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
          <Text style={styles.headerTitle}>{isEdit ? 'EDIT ADDRESS' : 'NEW ADDRESS'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Label */}
          <Text style={styles.sectionTitle}>LABEL</Text>
          <View style={styles.labelRow}>
            {LABELS.map(l => (
              <TouchableOpacity
                key={l}
                style={[styles.labelChip, form.label === l && styles.labelChipActive]}
                onPress={() => set('label', l)}
                activeOpacity={0.8}
              >
                <Text style={[styles.labelChipText, form.label === l && styles.labelChipTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>DETAILS</Text>
          <Field label="Full Name" value={form.fullName} onChangeText={v => set('fullName', v)}
            error={errors.fullName} autoCapitalize="words" />
          <Field label="Phone Number" value={form.phone} onChangeText={v => set('phone', v)}
            keyboardType="phone-pad" error={errors.phone} />
          <Field label="Address Line 1" value={form.line1} onChangeText={v => set('line1', v)}
            error={errors.line1} autoCapitalize="words" />
          <Field label="Address Line 2 (optional)" value={form.line2} onChangeText={v => set('line2', v)}
            autoCapitalize="words" />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Field label="City" value={form.city} onChangeText={v => set('city', v)}
                error={errors.city} autoCapitalize="words" />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Field label="Postcode" value={form.postcode}
                onChangeText={v => set('postcode', v.toUpperCase())}
                error={errors.postcode} autoCapitalize="characters" />
            </View>
          </View>

          <Field label="Country" value={form.country} onChangeText={v => set('country', v)} autoCapitalize="words" />

          <View style={styles.defaultRow}>
            <View>
              <Text style={styles.defaultLabel}>Set as default address</Text>
              <Text style={styles.defaultSub}>Used automatically at checkout</Text>
            </View>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: Colors.grey200, true: Colors.gold }}
              thumbColor={Colors.white}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnLoading]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.saveBtnText}>{isEdit ? 'SAVE CHANGES' : 'ADD ADDRESS'}</Text>
            }
          </TouchableOpacity>
          {saved ? (
            <View style={styles.successBanner}>
              <Feather name="check-circle" size={14} color={Colors.success} />
              <Text style={styles.successText}>Address saved</Text>
            </View>
          ) : null}
          {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

        </ScrollView>
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
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 12, marginTop: 8,
  },
  labelRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  labelChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.grey200, borderRadius: 20,
  },
  labelChipActive: { borderColor: Colors.black, backgroundColor: Colors.black },
  labelChipText: { fontSize: 11, fontWeight: '600', color: Colors.grey500, letterSpacing: 0.5 },
  labelChipTextActive: { color: Colors.white },
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
    paddingVertical: 14, borderTopWidth: 0.5, borderTopColor: Colors.grey100, marginTop: 4, marginBottom: 8,
  },
  defaultLabel: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary },
  defaultSub: { fontSize: 11, color: Colors.grey400, marginTop: 2 },
  saveBtn: {
    backgroundColor: Colors.black, height: 58,
    alignItems: 'center', justifyContent: 'center', marginTop: 8, borderRadius: 12,
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

export default AddEditAddressScreen;
