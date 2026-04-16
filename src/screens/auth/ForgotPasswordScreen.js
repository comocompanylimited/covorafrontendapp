import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { Input } from '../../components/common';

const ForgotPasswordScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSend = () => {
    if (!email.trim()) { setError('Please enter your email address'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
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

        <View style={styles.content}>
          {sent ? (
            <View style={styles.successState}>
              <View style={styles.successIcon}>
                <Feather name="mail" size={32} color={Colors.gold} />
              </View>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successText}>
                We've sent a verification code to{'\n'}
                <Text style={styles.successEmail}>{email}</Text>
              </Text>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={() => navigation.navigate('VerifyCode', { email })}
                activeOpacity={0.85}
              >
                <Text style={styles.continueBtnText}>ENTER VERIFICATION CODE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSent(false)}
                style={styles.resendBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.iconBlock}>
                <View style={styles.iconCircle}>
                  <Feather name="lock" size={28} color={Colors.gold} />
                </View>
              </View>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter the email address associated with your COVORA account and we'll send you a reset code.
              </Text>
              <Input
                label="Email Address"
                placeholder="your@email.com"
                value={email}
                onChangeText={v => { setEmail(v); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={error}
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnLoading]}
                onPress={handleSend}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitText}>SEND RESET CODE</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backTextBtn} activeOpacity={0.7}>
                <Text style={styles.backTextBtnText}>Back to Sign In</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { height: 56, paddingHorizontal: Spacing.md, justifyContent: 'center' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, paddingHorizontal: Spacing.screenPaddingHorizontal, paddingTop: 20 },
  iconBlock: { alignItems: 'center', marginBottom: 24 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: 'Georgia', fontSize: 26, fontWeight: '400', color: Colors.textPrimary, marginBottom: 12 },
  subtitle: { fontSize: 14, color: Colors.grey500, lineHeight: 22, marginBottom: 32 },
  submitBtn: {
    backgroundColor: Colors.black, height: 58,
    alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 16, borderRadius: 12,
  },
  submitBtnLoading: { backgroundColor: Colors.grey700 },
  submitText: { color: Colors.white, fontSize: 12, letterSpacing: 3, fontWeight: '600' },
  backTextBtn: { alignItems: 'center', paddingVertical: 12 },
  backTextBtnText: { fontSize: 13, color: Colors.grey500, textDecorationLine: 'underline' },
  // Success
  successState: { alignItems: 'center', paddingTop: 40 },
  successIcon: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  successTitle: { fontFamily: 'Georgia', fontSize: 26, fontWeight: '400', color: Colors.textPrimary, marginBottom: 12 },
  successText: { fontSize: 14, color: Colors.grey500, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  successEmail: { color: Colors.textPrimary, fontWeight: '600' },
  continueBtn: {
    backgroundColor: Colors.black, width: '100%', height: 58,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderRadius: 12,
  },
  continueBtnText: { color: Colors.white, fontSize: 11, letterSpacing: 2.5, fontWeight: '600' },
  resendBtn: { paddingVertical: 12 },
  resendText: { fontSize: 13, color: Colors.gold, textDecorationLine: 'underline' },
});

export default ForgotPasswordScreen;
