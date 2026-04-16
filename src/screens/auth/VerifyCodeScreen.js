import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { Input } from '../../components/common';

const MOCK_CODE = '123456';

const VerifyCodeScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { email = '' } = route.params || {};
  const [code, setCode]               = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [step, setStep]               = useState(1); // 1 = code, 2 = new pw, 3 = success
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);

  const verifyCode = () => {
    if (!code || code.length < 6) { setErrors({ code: 'Enter the 6-digit code' }); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code === MOCK_CODE) { setStep(2); }
      else setErrors({ code: 'Incorrect code. Try 123456' });
    }, 1000);
  };

  const resetPassword = () => {
    const e = {};
    if (!newPassword || newPassword.length < 8) e.newPassword = 'Minimum 8 characters';
    else if (!/[A-Z]/.test(newPassword)) e.newPassword = 'Must include uppercase letter';
    else if (!/[0-9]/.test(newPassword)) e.newPassword = 'Must include a number';
    if (newPassword !== confirmPw) e.confirmPw = 'Passwords do not match';
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>RESET PASSWORD</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {step === 1 && (
            <>
              <View style={styles.iconCircle}>
                <Feather name="shield" size={28} color={Colors.gold} />
              </View>
              <Text style={styles.title}>Enter Verification Code</Text>
              <Text style={styles.subtitle}>We sent a 6-digit code to{'\n'}<Text style={{ color: Colors.textPrimary, fontWeight: '600' }}>{email}</Text></Text>
              <Input label="Verification Code" placeholder="Enter 6-digit code"
                value={code} onChangeText={v => { setCode(v); setErrors({}); }}
                keyboardType="number-pad" error={errors.code}
                hint="Demo code: 123456" returnKeyType="done" onSubmitEditing={verifyCode} />
              <TouchableOpacity style={[styles.btn, loading && styles.btnLoading]} onPress={verifyCode} disabled={loading} activeOpacity={0.85}>
                {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnText}>VERIFY CODE</Text>}
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <View style={styles.iconCircle}>
                <Feather name="lock" size={28} color={Colors.gold} />
              </View>
              <Text style={styles.title}>New Password</Text>
              <Text style={styles.subtitle}>Create a new password for your account.</Text>
              <Input label="New Password" placeholder="Minimum 8 characters" value={newPassword}
                onChangeText={v => { setNewPassword(v); setErrors(e => ({ ...e, newPassword: '' })); }}
                secureTextEntry error={errors.newPassword} hint="Must include uppercase and number" />
              <Input label="Confirm Password" placeholder="Repeat your password" value={confirmPw}
                onChangeText={v => { setConfirmPw(v); setErrors(e => ({ ...e, confirmPw: '' })); }}
                secureTextEntry error={errors.confirmPw} returnKeyType="done" onSubmitEditing={resetPassword} />
              <TouchableOpacity style={[styles.btn, loading && styles.btnLoading]} onPress={resetPassword} disabled={loading} activeOpacity={0.85}>
                {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnText}>RESET PASSWORD</Text>}
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <View style={styles.successState}>
              <View style={styles.successIcon}>
                <Feather name="check-circle" size={40} color={Colors.gold} />
              </View>
              <Text style={styles.successTitle}>Password Reset</Text>
              <Text style={styles.successText}>Your password has been successfully reset. You can now sign in with your new password.</Text>
              <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('SignIn')} activeOpacity={0.85}>
                <Text style={styles.btnText}>SIGN IN NOW</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    height: 56, paddingHorizontal: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Georgia', fontSize: 14, letterSpacing: 3, color: Colors.black },
  content: { flex: 1, paddingHorizontal: Spacing.screenPaddingHorizontal, paddingTop: 20 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: 24,
  },
  title: { fontFamily: 'Georgia', fontSize: 26, fontWeight: '400', color: Colors.textPrimary, marginBottom: 10 },
  subtitle: { fontSize: 14, color: Colors.grey500, lineHeight: 22, marginBottom: 28 },
  btn: {
    backgroundColor: Colors.black, height: 58,
    alignItems: 'center', justifyContent: 'center', marginTop: 8, borderRadius: 12,
  },
  btnLoading: { backgroundColor: Colors.grey700 },
  btnText: { color: Colors.white, fontSize: 12, letterSpacing: 3, fontWeight: '600' },
  successState: { alignItems: 'center', paddingTop: 40 },
  successIcon: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  successTitle: { fontFamily: 'Georgia', fontSize: 26, fontWeight: '400', color: Colors.textPrimary, marginBottom: 12 },
  successText: { fontSize: 14, color: Colors.grey500, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
});

export default VerifyCodeScreen;
