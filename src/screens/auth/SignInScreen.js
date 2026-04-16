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
import { validateSignInPayload } from '../../services/authService';

const SignInScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signInWithCredentials } = useApp();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = validateSignInPayload({ email, password });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignIn = () => {
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const result = signInWithCredentials(email, password);
      if (result.ok) {
        navigation.navigate('Main');
      } else {
        setServerError('Incorrect email or password. Try sophia@example.com / Password1');
      }
    }, 1200);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

        {/* Header */}
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
          {/* Brand */}
          <View style={styles.brandBlock}>
            <BrandLogo variant="goldOnLight" width={86} style={styles.authLogo} />
            <Text style={styles.brandLogo}>COVORA</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your luxury account</Text>
          </View>

          {/* Social placeholders */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} activeOpacity={0.85}>
              <Text style={styles.socialIcon}>A</Text>
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, styles.googleBtn]} activeOpacity={0.85}>
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>OR</Text>
            <View style={styles.divLine} />
          </View>

          {/* Server error */}
          {serverError ? (
            <View style={styles.serverError}>
              <Feather name="alert-circle" size={14} color={Colors.error} />
              <Text style={styles.serverErrorText}>{serverError}</Text>
            </View>
          ) : null}

          {/* Form */}
          <Input
            label="Email Address"
            placeholder="your@email.com"
            value={email}
            onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: '' })); }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: '' })); }}
            secureTextEntry
            error={errors.password}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnLoading]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitText}>SIGN IN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.75}>
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>Demo: sophia@example.com / Password1</Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    height: 56,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  scroll: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingBottom: 40,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 32,
  },
  authLogo: { marginBottom: -6 },
  brandLogo: {
    fontFamily: 'Georgia',
    fontSize: 24,
    letterSpacing: 8,
    color: Colors.black,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 26,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: { fontSize: 13, color: Colors.grey500, letterSpacing: 0.3 },
  socialRow: { gap: 10, marginBottom: 24 },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: Colors.grey200,
    borderRadius: 10,
    gap: 10,
    backgroundColor: Colors.white,
  },
  googleBtn: { borderColor: Colors.grey200 },
  socialIcon: { fontSize: 16, fontWeight: '700', color: Colors.black, width: 20, textAlign: 'center' },
  socialText: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary, letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  divLine: { flex: 1, height: 0.5, backgroundColor: Colors.grey200 },
  divText: { fontSize: 11, color: Colors.grey400, letterSpacing: 2, fontWeight: '500' },
  serverError: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: Colors.error,
    padding: 12,
    marginBottom: 16,
  },
  serverErrorText: { flex: 1, fontSize: 12, color: Colors.error, lineHeight: 18 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 24 },
  forgotText: { fontSize: 12, color: Colors.gold, letterSpacing: 0.3, textDecorationLine: 'underline' },
  submitBtn: {
    backgroundColor: Colors.black,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 12,
  },
  submitBtnLoading: { backgroundColor: Colors.grey700 },
  submitText: { color: Colors.white, fontSize: 12, letterSpacing: 3, fontWeight: '600' },
  registerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  registerPrompt: { fontSize: 13, color: Colors.grey500 },
  registerLink: { fontSize: 13, color: Colors.gold, fontWeight: '600', textDecorationLine: 'underline' },
  hint: { fontSize: 10, color: Colors.grey400, textAlign: 'center', letterSpacing: 0.3 },
});

export default SignInScreen;
