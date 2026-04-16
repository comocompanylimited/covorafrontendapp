import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

const CATEGORIES = ['Dresses', 'Shoes', 'Bags', 'Jewellery', 'Clothing', 'Skincare', 'Beauty', 'Fragrance', 'Activewear'];
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SHOE_SIZES = ['35', '36', '37', '38', '39', '40', '41', '42'];
const CURRENCIES = [{ code: 'GBP', label: 'British Pound (£)' }, { code: 'EUR', label: 'Euro (â‚¬)' }, { code: 'USD', label: 'US Dollar ($)' }];

const PreferencesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { stylePrefs, updateStylePrefs } = useApp();

  const toggleCategory = (cat) => {
    const current = stylePrefs.favouriteCategories || [];
    const next = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    updateStylePrefs({ favouriteCategories: next });
  };

  const toggleClothingSize = (size) => {
    const current = stylePrefs.savedSizes?.clothing || [];
    const next = current.includes(size) ? current.filter(s => s !== size) : [...current, size];
    updateStylePrefs({ savedSizes: { ...stylePrefs.savedSizes, clothing: next } });
  };

  const toggleShoeSize = (size) => {
    const current = stylePrefs.savedSizes?.shoes || [];
    const next = current.includes(size) ? current.filter(s => s !== size) : [...current, size];
    updateStylePrefs({ savedSizes: { ...stylePrefs.savedSizes, shoes: next } });
  };

  const setCurrency = (code) => updateStylePrefs({ currency: code });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PREFERENCES</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.sectionTitle}>FAVOURITE CATEGORIES</Text>
        <Text style={styles.sectionDesc}>We'll personalise your feed based on your picks</Text>
        <View style={styles.chipsWrap}>
          {CATEGORIES.map(cat => {
            const active = (stylePrefs.favouriteCategories || []).includes(cat);
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
                {active && <Feather name="check" size={10} color={Colors.white} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>CLOTHING SIZE</Text>
        <View style={styles.chipsWrap}>
          {CLOTHING_SIZES.map(size => {
            const active = (stylePrefs.savedSizes?.clothing || []).includes(size);
            return (
              <TouchableOpacity
                key={size}
                style={[styles.sizeChip, active && styles.chipActive]}
                onPress={() => toggleClothingSize(size)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{size}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>SHOE SIZE (EU)</Text>
        <View style={styles.chipsWrap}>
          {SHOE_SIZES.map(size => {
            const active = (stylePrefs.savedSizes?.shoes || []).includes(size);
            return (
              <TouchableOpacity
                key={size}
                style={[styles.sizeChip, active && styles.chipActive]}
                onPress={() => toggleShoeSize(size)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{size}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>CURRENCY</Text>
        <View style={styles.sectionCard}>
          {CURRENCIES.map((c, i) => (
            <TouchableOpacity
              key={c.code}
              style={[styles.currencyRow, i < CURRENCIES.length - 1 && styles.currencyRowBorder]}
              onPress={() => setCurrency(c.code)}
              activeOpacity={0.8}
            >
              <Text style={styles.currencyLabel}>{c.label}</Text>
              {stylePrefs.currency === c.code && (
                <Feather name="check" size={16} color={Colors.gold} />
              )}
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    height: 56, paddingHorizontal: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 0.5, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Georgia', fontSize: 16, letterSpacing: 3, color: Colors.black },
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 8, marginTop: 20,
  },
  sectionDesc: { fontSize: 12, color: Colors.grey400, marginBottom: 10 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.grey200,
    borderRadius: 20, backgroundColor: Colors.white,
  },
  sizeChip: {
    width: 52, alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.grey200,
    borderRadius: 8, backgroundColor: Colors.white,
  },
  chipActive: { borderColor: Colors.black, backgroundColor: Colors.black },
  chipText: { fontSize: 12, fontWeight: '500', color: Colors.grey600 },
  chipTextActive: { color: Colors.white },
  sectionCard: {
    backgroundColor: Colors.white, borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  currencyRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14,
  },
  currencyRowBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.grey100 },
  currencyLabel: { fontSize: 13, color: Colors.textPrimary },
});

export default PreferencesScreen;

