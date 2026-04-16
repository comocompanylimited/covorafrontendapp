import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, phone number, delivery address, and payment information.\n\nWe also collect information automatically when you use our app, including device information, IP address, and browsing behaviour within the app.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use the information we collect to:\n\n• Process and fulfil your orders\n• Send order confirmations and shipping updates\n• Provide customer support\n• Personalise your shopping experience\n• Send promotional communications (with your consent)\n• Improve our services and develop new features',
  },
  {
    title: '3. Information Sharing',
    body: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our app, conducting our business, or serving our customers, provided they agree to keep this information confidential.',
  },
  {
    title: '4. Data Security',
    body: 'We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. All payment data is encrypted using 256-bit SSL technology.',
  },
  {
    title: '5. Cookies & Tracking',
    body: 'We use cookies and similar tracking technologies to track activity on our app and hold certain information. You can instruct your device to refuse all cookies or to indicate when a cookie is being sent.',
  },
  {
    title: '6. Your Rights',
    body: 'Under GDPR, you have the right to:\n\n• Access your personal data\n• Rectify inaccurate personal data\n• Request erasure of your personal data\n• Object to processing of your personal data\n• Request restriction of processing\n• Data portability\n\nTo exercise any of these rights, please contact us at privacy@covora.com',
  },
  {
    title: '7. Contact Us',
    body: 'If you have any questions about this Privacy Policy, please contact us at:\n\nprivacy@covora.com\nCOVORA Limited\n123 Fashion Street\nLondon, W1K 2AB\nUnited Kingdom',
  },
];

const PrivacyPolicyScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PRIVACY POLICY</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.lastUpdated}>Last updated: January 2025</Text>
        <Text style={styles.intro}>
          COVORA Limited ("we", "us", or "our") is committed to protecting and respecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
        </Text>

        {SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Â© 2025 COVORA Limited. All rights reserved.</Text>
        </View>
      </ScrollView>
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
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 60 },
  lastUpdated: { fontSize: 11, color: Colors.grey400, marginTop: 16, marginBottom: 12 },
  intro: { fontSize: 14, color: Colors.grey600, lineHeight: 24, marginBottom: 24, paddingBottom: 24, borderBottomWidth: 0.5, borderBottomColor: Colors.grey100 },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Georgia', fontSize: 16, color: Colors.textPrimary, marginBottom: 10 },
  sectionBody: { fontSize: 13, color: Colors.grey600, lineHeight: 22 },
  footer: { borderTopWidth: 0.5, borderTopColor: Colors.grey100, paddingTop: 20, alignItems: 'center' },
  footerText: { fontSize: 11, color: Colors.grey300 },
});

export default PrivacyPolicyScreen;

