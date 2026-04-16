import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { saveProfileDetails } from '../../services/profileService';

const EditProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useApp();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    phone:     user?.phone     || '',
  });
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
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim())  e.lastName  = 'Last name is required';
    if (!form.email.trim())     e.email     = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const savedProfile = await saveProfileDetails(form);
      updateProfile(savedProfile);
      setLoading(false);
      setSaved(true);
    } catch (e) {
      setLoading(false);
      setErrors(prev => ({ ...prev, form: 'Could not save profile. Please try again.' }));
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
          <Text style={styles.headerTitle}>EDIT PROFILE</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={loading}>
            {loading
              ? <ActivityIndicator size="small" color={Colors.gold} />
              : <Text style={styles.saveBtnText}>{saved ? '✓ Saved' : 'Save'}</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(form.firstName?.[0] || '').toUpperCase()}{(form.lastName?.[0] || '').toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.changePhotoBtn} activeOpacity={0.75}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>

          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Field label="First Name" value={form.firstName} onChangeText={v => set('firstName', v)}
                error={errors.firstName} autoCapitalize="words" />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Field label="Last Name" value={form.lastName} onChangeText={v => set('lastName', v)}
                error={errors.lastName} autoCapitalize="words" />
            </View>
          </View>

          <Field label="Email Address" value={form.email} onChangeText={v => set('email', v)}
            error={errors.email} keyboardType="email-address" autoCapitalize="none" />

          <Field label="Phone Number" value={form.phone} onChangeText={v => set('phone', v)}
            keyboardType="phone-pad" />

          <Text style={styles.sectionTitle}>PASSWORD</Text>
          <TouchableOpacity style={styles.changePasswordBtn} onPress={() => navigation.navigate('ForgotPassword')} activeOpacity={0.85}>
            <Feather name="lock" size={14} color={Colors.textPrimary} />
            <Text style={styles.changePasswordText}>Change Password</Text>
            <Feather name="chevron-right" size={14} color={Colors.grey400} />
          </TouchableOpacity>

          {saved && (
            <View style={styles.successBanner}>
              <Feather name="check-circle" size={14} color={Colors.success} />
              <Text style={styles.successText}>Profile updated successfully</Text>
            </View>
          )}
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
  saveBtn: { paddingHorizontal: 4, height: 40, justifyContent: 'center' },
  saveBtnText: { fontSize: 13, fontWeight: '600', color: Colors.gold },
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 60 },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.black,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: Colors.white, letterSpacing: 2 },
  changePhotoBtn: { paddingVertical: 4 },
  changePhotoText: { fontSize: 13, color: Colors.gold, textDecorationLine: 'underline', fontWeight: '500' },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 12, marginTop: 8,
  },
  nameRow: { flexDirection: 'row' },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 10, fontWeight: '600', color: Colors.grey500, letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' },
  fieldInput: {
    height: 48, borderWidth: 1, borderColor: Colors.grey200,
    borderRadius: 8, paddingHorizontal: Spacing.md, fontSize: 13, color: Colors.textPrimary,
  },
  fieldInputError: { borderColor: Colors.error },
  fieldError: { fontSize: 11, color: Colors.error, marginTop: 4 },
  changePasswordBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: Colors.grey200, padding: 14, borderRadius: 10,
  },
  changePasswordText: { flex: 1, fontSize: 13, color: Colors.textPrimary, fontWeight: '500' },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(46,125,50,0.08)',
    borderWidth: 1, borderColor: 'rgba(46,125,50,0.25)',
    padding: 12, marginTop: 16, borderRadius: 8,
  },
  successText: { fontSize: 13, color: Colors.success, fontWeight: '500' },
  formError: { fontSize: 12, color: Colors.error, marginTop: 10 },
});

export default EditProfileScreen;


