import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const AboutScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ABOUT</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Brand Hero */}
        <View style={styles.brandHero}>
          <Text style={styles.brandLogo}>COVORA</Text>
          <View style={styles.goldLine} />
          <Text style={styles.brandTagline}>Curated Luxury. Refined Living.</Text>
        </View>

        <Text style={styles.body}>
          COVORA is a premier luxury fashion destination, founded with a singular vision: to curate the world's finest collections and deliver them to discerning women with an effortless, personalised experience.
        </Text>

        <Text style={styles.body}>
          We believe luxury is not just about the products — it's about the feeling. From your first visit to the moment your order arrives, every touchpoint is crafted to feel exceptional.
        </Text>

        {/* Values */}
        <Text style={styles.sectionTitle}>OUR VALUES</Text>
        {[
          { icon: 'star', title: 'Curation Over Quantity', desc: 'Every product is hand-selected from the world\'s finest brands and designers.' },
          { icon: 'shield', title: 'Authenticity Guaranteed', desc: 'All items are 100% authentic, sourced directly from official brand channels.' },
          { icon: 'heart', title: 'Customer First', desc: 'White-glove service, flexible returns, and a dedicated concierge team.' },
          { icon: 'globe', title: 'Sustainable Luxury', desc: 'Committed to responsible sourcing and reducing our environmental footprint.' },
        ].map(v => (
          <View key={v.title} style={styles.valueCard}>
            <View style={styles.valueIcon}>
              <Feather name={v.icon} size={18} color={Colors.gold} />
            </View>
            <View style={styles.valueText}>
              <Text style={styles.valueTitle}>{v.title}</Text>
              <Text style={styles.valueDesc}>{v.desc}</Text>
            </View>
          </View>
        ))}

        {/* Studio Credit */}
        <View style={styles.studioCard}>
          <View style={styles.studioLine} />
          <Text style={styles.studioLabel}>CRAFTED BY</Text>
          <Text style={styles.studioName}>COMODO STUDIOS</Text>
          <Text style={styles.studioDesc}>Digital experiences for luxury brands</Text>
          <View style={styles.studioLine} />
        </View>

        <View style={styles.versionRow}>
          <Text style={styles.versionText}>COVORA v1.0.0</Text>
          <Text style={styles.versionText}>© 2025 COMODO STUDIOS</Text>
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
  scroll: { paddingBottom: 60 },
  brandHero: {
    alignItems: 'center', paddingVertical: 40,
    backgroundColor: Colors.black,
  },
  brandLogo: { fontFamily: 'Georgia', fontSize: 36, letterSpacing: 12, color: Colors.white, marginBottom: 16 },
  goldLine: { width: 60, height: 1, backgroundColor: Colors.gold, marginBottom: 16 },
  brandTagline: { fontSize: 12, color: Colors.grey400, letterSpacing: 3 },
  body: {
    fontSize: 14, color: Colors.grey600, lineHeight: 24,
    paddingHorizontal: Spacing.screenPaddingHorizontal, marginTop: 20,
  },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 12, marginTop: 28,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
  },
  valueCard: {
    flexDirection: 'row', gap: 14, alignItems: 'flex-start',
    paddingHorizontal: Spacing.screenPaddingHorizontal, marginBottom: 20,
  },
  valueIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  valueText: { flex: 1 },
  valueTitle: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  valueDesc: { fontSize: 12, color: Colors.grey500, lineHeight: 18 },
  studioCard: {
    alignItems: 'center', paddingVertical: 32,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    marginTop: 28, borderRadius: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
    backgroundColor: Colors.white,
  },
  studioLine: { width: 40, height: 0.5, backgroundColor: Colors.gold, marginVertical: 12 },
  studioLabel: { fontSize: 8, fontWeight: '600', color: Colors.grey400, letterSpacing: 3, marginBottom: 6 },
  studioName: { fontFamily: 'Georgia', fontSize: 20, color: Colors.textPrimary, letterSpacing: 4, marginBottom: 6 },
  studioDesc: { fontSize: 11, color: Colors.grey400, letterSpacing: 1 },
  versionRow: { alignItems: 'center', gap: 4, paddingVertical: 24 },
  versionText: { fontSize: 10, color: Colors.grey300, letterSpacing: 1 },
});

export default AboutScreen;
