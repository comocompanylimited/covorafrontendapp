import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, LayoutAnimation,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const FAQS = [
  {
    category: 'ORDERS',
    items: [
      {
        q: 'How do I track my order?',
        a: 'Once your order has been dispatched, you\'ll receive an email with your tracking number. You can also track your order in the My Orders section of your account.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 1 hour of placement. Please contact our support team immediately via Live Chat or email if you need to make changes.',
      },
      {
        q: 'What if my order arrives damaged?',
        a: 'We\'re sorry to hear this. Please contact our support team within 48 hours of delivery with photos of the damage, and we\'ll arrange a replacement or full refund.',
      },
    ],
  },
  {
    category: 'RETURNS & REFUNDS',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy on all items. Items must be in their original condition with all tags attached. Some items such as personalised products and fragrances may not be eligible for return.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Refunds are processed within 5–7 business days of us receiving your return. The funds may take a further 3–5 business days to appear in your account, depending on your bank.',
      },
    ],
  },
  {
    category: 'PAYMENTS',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards including Visa, Mastercard, American Express, and JCB. We also accept Apple Pay and Google Pay.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. All payment information is encrypted using 256-bit SSL technology. We do not store your full card details on our servers.',
      },
    ],
  },
  {
    category: 'DELIVERY',
    items: [
      {
        q: 'What are the delivery options?',
        a: 'We offer Standard (3–5 days), Express (1–2 days), Next Day, and Nominated Day delivery. Free standard delivery is available on orders over £150.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to over 50 countries. International delivery times and costs vary by destination. Customs and import duties may apply.',
      },
    ],
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(v => !v);
  };

  return (
    <TouchableOpacity style={styles.faqItem} onPress={toggle} activeOpacity={0.8}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{q}</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.grey400} />
      </View>
      {open && <Text style={styles.faqA}>{a}</Text>}
    </TouchableOpacity>
  );
};

const HelpCenterScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HELP CENTRE</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Hero */}
        <View style={styles.hero}>
          <Feather name="help-circle" size={32} color={Colors.gold} />
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSub}>Browse our frequently asked questions below or contact us directly.</Text>
        </View>

        {/* Contact Cards */}
        <View style={styles.contactRow}>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => navigation.navigate('ContactSupport')}
            activeOpacity={0.85}
          >
            <Feather name="message-circle" size={20} color={Colors.gold} />
            <Text style={styles.contactTitle}>Live Chat</Text>
            <Text style={styles.contactDesc}>24/7 Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => navigation.navigate('ContactSupport')}
            activeOpacity={0.85}
          >
            <Feather name="mail" size={20} color={Colors.gold} />
            <Text style={styles.contactTitle}>Email Us</Text>
            <Text style={styles.contactDesc}>Within 24h</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        {FAQS.map(section => (
          <View key={section.category}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            <View style={styles.faqCard}>
              {section.items.map((item, idx) => (
                <View key={item.q}>
                  <FAQItem q={item.q} a={item.a} />
                  {idx < section.items.length - 1 && <View style={styles.faqDivider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.contactBtn}
          onPress={() => navigation.navigate('ContactSupport')}
          activeOpacity={0.85}
        >
          <Text style={styles.contactBtnText}>CONTACT SUPPORT</Text>
          <Feather name="arrow-right" size={14} color={Colors.white} />
        </TouchableOpacity>

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
  hero: {
    alignItems: 'center', paddingVertical: 28,
    borderBottomWidth: 0.5, borderBottomColor: Colors.grey100, marginBottom: 4,
  },
  heroTitle: { fontFamily: 'Georgia', fontSize: 24, color: Colors.textPrimary, marginTop: 12, marginBottom: 8 },
  heroSub: { fontSize: 13, color: Colors.grey500, textAlign: 'center', lineHeight: 20 },
  contactRow: { flexDirection: 'row', gap: 12, marginVertical: 20 },
  contactCard: {
    flex: 1, alignItems: 'center', paddingVertical: 20, gap: 6,
    borderRadius: 12, backgroundColor: Colors.offWhite,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  contactTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  contactDesc: { fontSize: 11, color: Colors.grey400 },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 10, marginTop: 16,
  },
  faqCard: {
    borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  faqItem: { padding: 14 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  faqQ: { flex: 1, fontSize: 13, fontWeight: '500', color: Colors.textPrimary, lineHeight: 20 },
  faqA: { fontSize: 13, color: Colors.grey500, lineHeight: 21, marginTop: 10 },
  faqDivider: { height: 0.5, backgroundColor: Colors.grey100 },
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.black, height: 54, marginTop: 24, borderRadius: 12,
  },
  contactBtnText: { color: Colors.white, fontSize: 11, letterSpacing: 2.5, fontWeight: '700' },
});

export default HelpCenterScreen;

