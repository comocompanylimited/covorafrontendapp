import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const ALL_BRANDS = [
  'Acne Studios', 'A.P.C.', 'Bottega Veneta', 'Burberry', 'Celine',
  'Chloé', 'Dior', 'Gucci', 'Isabel Marant', 'Jacquemus',
  'Loewe', 'Miu Miu', 'Off-White', 'Prada', 'Saint Laurent',
  'Self Portrait', 'Stella McCartney', 'The Row', 'Totême', 'Valentino',
];

const FavouriteBrandsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [following, setFollowing] = useState(new Set());

  const toggle = (brand) => {
    setFollowing(prev => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="chevron-left" size={22} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favourite Brands</Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.sub}>Follow your favourite brands to stay updated on new arrivals and exclusives.</Text>

        <View style={styles.list}>
          {ALL_BRANDS.map((brand, i) => {
            const isFav = following.has(brand);
            return (
              <View key={brand} style={[styles.row, i < ALL_BRANDS.length - 1 && styles.rowBorder]}>
                <View style={styles.brandInitial}>
                  <Text style={styles.brandInitialText}>{brand[0]}</Text>
                </View>
                <Text style={styles.brandName}>{brand}</Text>
                <TouchableOpacity
                  style={[styles.followBtn, isFav && styles.followBtnActive]}
                  onPress={() => toggle(brand)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.followBtnText, isFav && styles.followBtnTextActive]}>
                    {isFav ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },
  header: { backgroundColor: Colors.white, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  headerInner: { height: 52, paddingHorizontal: Spacing.screenPaddingHorizontal, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Georgia', fontSize: 16, fontWeight: '400', color: Colors.black },
  content: { paddingBottom: 48 },
  sub: { fontSize: 12, color: Colors.grey500, paddingHorizontal: Spacing.screenPaddingHorizontal, paddingVertical: 14, lineHeight: 18 },
  list: { paddingHorizontal: Spacing.screenPaddingHorizontal },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.grey100 },
  brandInitial: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: Colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandInitialText: { fontSize: 14, fontFamily: 'Georgia', color: Colors.grey600, fontWeight: '400' },
  brandName: { flex: 1, fontSize: 13, fontWeight: '400', color: Colors.black, letterSpacing: 0.1 },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderWidth: 0.5,
    borderColor: Colors.black,
    borderRadius: 20,
  },
  followBtnActive: { backgroundColor: Colors.black },
  followBtnText: { fontSize: 10, color: Colors.black, letterSpacing: 0.8, fontWeight: '500' },
  followBtnTextActive: { color: Colors.white },
});

export default FavouriteBrandsScreen;
