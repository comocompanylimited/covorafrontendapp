import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing and using the COVORA application, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.',
  },
  {
    title: '2. Account Registration',
    body: 'To access certain features of the app, you must register for an account. You must provide accurate and complete information and keep your account information up-to-date. You are responsible for maintaining the confidentiality of your account credentials.',
  },
  {
    title: '3. Products & Pricing',
    body: 'All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are shown in the selected currency and are inclusive of VAT where applicable. We reserve the right to modify prices at any time without prior notice.',
  },
  {
    title: '4. Orders & Payment',
    body: 'By placing an order, you are making an offer to purchase. We reserve the right to accept or decline your order for any reason. Payment must be received in full before goods are dispatched. We accept all major credit and debit cards.',
  },
  {
    title: '5. Returns & Refunds',
    body: 'You have the right to return most items within 30 days of delivery. Items must be returned in their original, unused condition with all tags attached. Refunds will be processed to the original payment method within 5–7 business days of receiving your return.',
  },
  {
    title: '6. Intellectual Property',
    body: 'All content on this app, including but not limited to text, graphics, logos, images, and software, is the property of COVORA Limited or its content suppliers and is protected by UK and international copyright laws.',
  },
  {
    title: '7. Limitation of Liability',
    body: 'COVORA Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or goodwill, arising out of or in connection with your use of the service.',
  },
  {
    title: '8. Governing Law',
    body: 'These terms shall be governed by and construed in accordance with the laws of England and Wales, and you submit to the exclusive jurisdiction of the courts of England and Wales for any disputes.',
  },
];

const TermsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TERMS & CONDITIONS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.lastUpdated}>Last updated: January 2025</Text>
        <Text style={styles.intro}>
          Please read these Terms and Conditions carefully before using the COVORA app operated by COVORA Limited.
        </Text>

        {SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Â© 2025 COVORA Limited. All rights reserved.</Text>
          <Text style={styles.footerText}>Registered in England & Wales</Text>
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
  headerTitle: { fontFamily: 'Georgia', fontSize: 14, letterSpacing: 2.5, color: Colors.black },
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 60 },
  lastUpdated: { fontSize: 11, color: Colors.grey400, marginTop: 16, marginBottom: 12 },
  intro: { fontSize: 14, color: Colors.grey600, lineHeight: 24, marginBottom: 24, paddingBottom: 24, borderBottomWidth: 0.5, borderBottomColor: Colors.grey100 },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Georgia', fontSize: 16, color: Colors.textPrimary, marginBottom: 10 },
  sectionBody: { fontSize: 13, color: Colors.grey600, lineHeight: 22 },
  footer: { borderTopWidth: 0.5, borderTopColor: Colors.grey100, paddingTop: 20, alignItems: 'center', gap: 4 },
  footerText: { fontSize: 11, color: Colors.grey300 },
});

export default TermsScreen;

