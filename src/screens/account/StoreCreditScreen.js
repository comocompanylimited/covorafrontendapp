import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const StoreCreditScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const creditBalance = 0.00;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="chevron-left" size={22} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Store Credit</Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>AVAILABLE CREDIT</Text>
          <Text style={styles.balanceAmount}>${creditBalance.toFixed(2)}</Text>
          <Text style={styles.balanceSub}>Automatically applied at checkout</Text>
        </View>

        <Text style={styles.sectionTitle}>HOW TO EARN</Text>
        <View style={styles.infoCard}>
          {[
            { icon: 'refresh-cw', text: 'Approved returns are credited to your account' },
            { icon: 'users', text: 'Refer a friend and earn $20 store credit' },
            { icon: 'award', text: 'Loyalty rewards convert to store credit' },
          ].map((item, i, arr) => (
            <View key={i} style={[styles.infoRow, i < arr.length - 1 && styles.infoRowBorder]}>
              <Feather name={item.icon} size={16} color={Colors.gold} />
              <Text style={styles.infoText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>TRANSACTION HISTORY</Text>
        <View style={styles.emptyState}>
          <Feather name="inbox" size={32} color={Colors.grey300} />
          <Text style={styles.emptyText}>No transactions yet</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.grey100 },
  header: { backgroundColor: Colors.white, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  headerInner: { height: 52, paddingHorizontal: Spacing.screenPaddingHorizontal, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Georgia', fontSize: 16, fontWeight: '400', color: Colors.black },
  content: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 48 },
  balanceCard: {
    backgroundColor: Colors.black,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
  },
  balanceLabel: { color: Colors.gold, fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 },
  balanceAmount: { color: Colors.white, fontFamily: 'Georgia', fontSize: 40, fontWeight: '300', marginBottom: 8 },
  balanceSub: { color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: 0.2 },
  sectionTitle: { fontSize: 9, fontWeight: '600', color: Colors.grey400, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12, marginTop: 4 },
  infoCard: {
    backgroundColor: Colors.white, borderRadius: 12, overflow: 'hidden', marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  infoRowBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.grey100 },
  infoText: { flex: 1, fontSize: 13, color: Colors.black, letterSpacing: 0.1, lineHeight: 18 },
  emptyState: { backgroundColor: Colors.white, padding: 40, alignItems: 'center', gap: 10, borderRadius: 12 },
  emptyText: { fontSize: 12, color: Colors.grey400 },
});

export default StoreCreditScreen;
