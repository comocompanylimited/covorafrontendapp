import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const STEPS = [
  { icon: 'package', title: 'Find your order', desc: 'Go to My Orders and select the item you want to return.' },
  { icon: 'refresh-cw', title: 'Request a return', desc: 'Tap "Return Item" and select a reason for your return.' },
  { icon: 'truck', title: 'Ship it back', desc: 'Print your prepaid label and drop off at any post office.' },
  { icon: 'check-circle', title: 'Get your refund', desc: 'Refunds are processed within 5–7 business days.' },
];

const ReturnsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="chevron-left" size={22} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Returns & Exchanges</Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Easy 30-Day Returns</Text>
        <Text style={styles.sub}>Not happy with your order? We make returns simple and stress-free.</Text>

        <View style={styles.stepsCard}>
          {STEPS.map((step, i) => (
            <View key={i} style={[styles.step, i < STEPS.length - 1 && styles.stepBorder]}>
              <View style={styles.stepIcon}>
                <Feather name={step.icon} size={18} color={Colors.gold} />
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('MyOrders')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>VIEW MY ORDERS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('ContactSupport')}
          activeOpacity={0.75}
        >
          <Text style={styles.secondaryBtnText}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerInner: {
    height: 52,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Georgia', fontSize: 16, fontWeight: '400', color: Colors.black, letterSpacing: 0.3 },
  content: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 48 },
  heading: { fontFamily: 'Georgia', fontSize: 26, fontWeight: '400', color: Colors.black, marginBottom: 8, marginTop: 8 },
  sub: { fontSize: 13, color: Colors.grey500, lineHeight: 20, marginBottom: 28, letterSpacing: 0.2 },
  stepsCard: {
    borderRadius: 12, overflow: 'hidden', marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  step: {
    flexDirection: 'row',
    padding: 18,
    gap: 16,
    alignItems: 'flex-start',
  },
  stepBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.grey100 },
  stepIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFBF0' },
  stepText: { flex: 1 },
  stepTitle: { fontSize: 13, fontWeight: '500', color: Colors.black, marginBottom: 3, letterSpacing: 0.1 },
  stepDesc: { fontSize: 12, color: Colors.grey500, lineHeight: 18 },
  primaryBtn: {
    backgroundColor: Colors.black,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 12,
  },
  primaryBtnText: { color: Colors.white, fontSize: 10, letterSpacing: 2.5, fontWeight: '500' },
  secondaryBtn: { alignItems: 'center', paddingVertical: 12 },
  secondaryBtnText: { fontSize: 12, color: Colors.grey500, textDecorationLine: 'underline', letterSpacing: 0.2 },
});

export default ReturnsScreen;
