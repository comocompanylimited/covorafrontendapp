import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const AMOUNTS = [25, 50, 100, 150, 200, 250];

const GiftCardsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState('');

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="chevron-left" size={22} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gift Cards</Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Give the Gift of Style</Text>
        <Text style={styles.sub}>COVORA gift cards are the perfect present for fashion lovers.</Text>

        {/* Buy a Gift Card */}
        <Text style={styles.sectionTitle}>BUY A GIFT CARD</Text>
        <View style={styles.amountsGrid}>
          {AMOUNTS.map(amount => (
            <TouchableOpacity
              key={amount}
              style={[styles.amountChip, selected === amount && styles.amountChipActive]}
              onPress={() => setSelected(amount)}
              activeOpacity={0.8}
            >
              <Text style={[styles.amountText, selected === amount && styles.amountTextActive]}>
                ${amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, !selected && styles.primaryBtnDisabled]}
          activeOpacity={selected ? 0.85 : 1}
        >
          <Text style={styles.primaryBtnText}>
            {selected ? `PURCHASE $${selected} GIFT CARD` : 'SELECT AN AMOUNT'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Redeem */}
        <Text style={styles.sectionTitle}>REDEEM A GIFT CARD</Text>
        <View style={styles.redeemRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter gift card code"
            placeholderTextColor={Colors.grey400}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[styles.redeemBtn, !code && styles.redeemBtnDisabled]}
            activeOpacity={code ? 0.85 : 1}
          >
            <Text style={styles.redeemBtnText}>APPLY</Text>
          </TouchableOpacity>
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
  content: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 48 },
  heading: { fontFamily: 'Georgia', fontSize: 24, fontWeight: '400', color: Colors.black, marginBottom: 6, marginTop: 8 },
  sub: { fontSize: 13, color: Colors.grey500, lineHeight: 20, marginBottom: 28 },
  sectionTitle: { fontSize: 9, fontWeight: '600', color: Colors.grey400, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 14 },
  amountsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  amountChip: {
    width: '30%',
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 10,
    alignItems: 'center',
  },
  amountChipActive: { borderColor: Colors.black, backgroundColor: Colors.black },
  amountText: { fontSize: 16, fontFamily: 'Georgia', color: Colors.black },
  amountTextActive: { color: Colors.white },
  primaryBtn: { backgroundColor: Colors.black, paddingVertical: 14, alignItems: 'center', marginBottom: 8, borderRadius: 12 },
  primaryBtnDisabled: { backgroundColor: Colors.grey200 },
  primaryBtnText: { color: Colors.white, fontSize: 10, letterSpacing: 2.5, fontWeight: '500' },
  divider: { height: 0.5, backgroundColor: Colors.border, marginVertical: 28 },
  redeemRow: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: Colors.black,
    letterSpacing: 1,
  },
  redeemBtn: { backgroundColor: Colors.black, paddingHorizontal: 18, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  redeemBtnDisabled: { backgroundColor: Colors.grey200 },
  redeemBtnText: { color: Colors.white, fontSize: 9, letterSpacing: 2, fontWeight: '500' },
});

export default GiftCardsScreen;
