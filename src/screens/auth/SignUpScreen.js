import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { Input, BrandLogo } from '../../components/common';
import { useApp } from '../../hooks/useAppContext';
import { validateSignUpPayload } from '../../services/authService';

const SignUpScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signUp, emailExists } = useApp();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = validateSignUpPayload(form, emailExists);
    if (!termsAccepted) e.terms = 'Please accept the terms to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signUp({
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        phone:     form.phone,
        password:  form.password,
        name:      `${form.firstName} ${form.lastName}`,
      });
      navigation.navigate('Main');
    }, 1400);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brandBlock}>
            <BrandLogo variant="goldOnLight" width={86} style={styles.authLogo} />
            <Text style={styles.brandLogo}>COVORA</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the COVORA luxury experience</Text>
          </View>

          {/* Social */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
              <Text style={styles.socialIcon}>A</Text>
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>OR</Text>
            <View style={styles.divLine} />
          </View>

          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Input label="First Name" placeholder="First name" value={form.firstName}
                onChangeText={v => set('firstName', v)} error={errors.firstName} autoCapitalize="words" />
            </View>
            <View style={styles.nameField}>
              <Input label="Last Name" placeholder="Last name" value={form.lastName}
                onChangeText={v => set('lastName', v)} error={errors.lastName} autoCapitalize="words" />
            </View>
          </View>

          <Input label="Email Address" placeholder="your@email.com" value={form.email}
            onChangeText={v => set('email', v)} keyboardType="email-address" autoCapitalize="none"
            error={errors.email} />
          <Input label="Phone Number" placeholder="+44 7700 000000" value={form.phone}
            onChangeText={v => set('phone', v)} keyboardType="phone-pad" error={errors.phone} />
          <Input label="Password" placeholder="Minimum 8 characters" value={form.password}
            onChangeText={v => set('password', v)} secureTextEntry error={errors.password}
            hint="Must include uppercase letter and number" />
          <Input label="Confirm Password" placeholder="Repeat your password" value={form.confirm}
            onChangeText={v => set('confirm', v)} secureTextEntry error={errors.confirm}
            returnKeyType="done" onSubmitEditing={handleSignUp} />

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setTermsAccepted(v => !v)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
              {termsAccepted && <Feather name="check" size={11} color={Colors.white} />}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink} onPress={() => navigation.navigate('Terms')}>
                Terms & Conditions
              </Text>
              {' '}and{' '}
              <Text style={styles.termsLink} onPress={() => navigation.navigate('Privacy')}>
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>
          {errors.terms ? <Text style={styles.termsError}>{errors.terms}</Text> : null}

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnLoading]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.submitText}>CREATE ACCOUNT</Text>
            }
          </TouchableOpacity>

          <View style={styles.signInRow}>
            <Text style={styles.signInPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')} activeOpacity={0.75}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { height: 56, paddingHorizontal: Spacing.md, justifyContent: 'center' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: Spacing.screenPaddingHorizontal, paddingBottom: 40 },
  brandBlock: { alignItems: 'center', marginBottom: 28 },
  authLogo: { marginBottom: -6 },
  brandLogo: { fontFamily: 'Georgia', fontSize: 22, letterSpacing: 6, color: Colors.black, marginBottom: 12 },
  title: { fontFamily: 'Georgia', fontSize: 26, fontWeight: '400', color: Colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 13, color: Colors.grey500, letterSpacing: 0.3 },
  socialRow: { gap: 10, marginBottom: 20 },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 52, borderWidth: 1, borderColor: Colors.grey200, gap: 10,
  },
  socialIcon: { fontSize: 16, fontWeight: '700', color: Colors.black, width: 20, textAlign: 'center' },
  socialText: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary, letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  divLine: { flex: 1, height: 0.5, backgroundColor: Colors.grey200 },
  divText: { fontSize: 11, color: Colors.grey400, letterSpacing: 2, fontWeight: '500' },
  nameRow: { flexDirection: 'row', gap: 12 },
  nameField: { flex: 1 },
  termsRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    marginBottom: 4, marginTop: 4,
  },
  checkbox: {
    width: 20, height: 20,
    borderWidth: 1.5, borderColor: Colors.grey300,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  checkboxActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  termsText: { flex: 1, fontSize: 12, color: Colors.grey600, lineHeight: 18 },
  termsLink: { color: Colors.gold, textDecorationLine: 'underline' },
  termsError: { fontSize: 11, color: Colors.error, marginBottom: 12, marginTop: 2 },
  submitBtn: {
    backgroundColor: Colors.black, height: 58,
    alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20,
    borderRadius: 12,
  },
  submitBtnLoading: { backgroundColor: Colors.grey700 },
  submitText: { color: Colors.white, fontSize: 12, letterSpacing: 3, fontWeight: '600' },
  signInRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  signInPrompt: { fontSize: 13, color: Colors.grey500 },
  signInLink: { fontSize: 13, color: Colors.gold, fontWeight: '600', textDecorationLine: 'underline' },
});

export default SignUpScreen;
