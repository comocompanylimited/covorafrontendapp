import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

const NOTIF_SECTIONS = [
  {
    title: 'ORDER UPDATES',
    items: [
      { key: 'orderUpdates',   label: 'Order Confirmations',   desc: 'Receive confirmations when orders are placed' },
      { key: 'orderShipped',   label: 'Order Dispatched',      desc: 'Get notified when your order ships' },
      { key: 'orderDelivered', label: 'Order Delivered',       desc: 'Confirm delivery of your order' },
    ],
  },
  {
    title: 'OFFERS & MARKETING',
    items: [
      { key: 'promotions',   label: 'Promotions & Offers',   desc: 'Exclusive discounts and promo codes' },
      { key: 'newArrivals',  label: 'New Arrivals',          desc: 'Be the first to see new collections' },
      { key: 'backInStock',  label: 'Back in Stock',         desc: 'Wishlist items back in stock alerts' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { key: 'priceDrops',     label: 'Price Drops',        desc: 'Price reductions on wishlist items' },
      { key: 'accountUpdates', label: 'Account Activity',   desc: 'Security and account-related updates' },
    ],
  },
];

const NotificationPrefsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { notifPrefs, updateNotifPrefs } = useApp();

  const toggle = (key) => {
    updateNotifPrefs({ [key]: !notifPrefs[key] });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NOTIFICATIONS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.intro}>Choose which notifications you'd like to receive from COVORA.</Text>

        {NOTIF_SECTIONS.map(section => (
          <View key={section.title}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <View
                  key={item.key}
                  style={[styles.prefRow, idx < section.items.length - 1 && styles.prefRowBorder]}
                >
                  <View style={styles.prefLeft}>
                    <Text style={styles.prefLabel}>{item.label}</Text>
                    <Text style={styles.prefDesc}>{item.desc}</Text>
                  </View>
                  <Switch
                    value={!!notifPrefs[item.key]}
                    onValueChange={() => toggle(item.key)}
                    trackColor={{ false: Colors.grey200, true: Colors.gold }}
                    thumbColor={Colors.white}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.note}>
          <Feather name="info" size={13} color={Colors.grey400} />
          <Text style={styles.noteText}>
            Push notifications can also be managed in your device settings. Some transactional notifications cannot be disabled.
          </Text>
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
  intro: { fontSize: 13, color: Colors.grey500, lineHeight: 20, marginTop: 16, marginBottom: 4 },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 10, marginTop: 20,
  },
  sectionCard: {
    backgroundColor: Colors.white, borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  prefRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  prefRowBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.grey100 },
  prefLeft: { flex: 1 },
  prefLabel: { fontSize: 13, fontWeight: '500', color: Colors.textPrimary, marginBottom: 2 },
  prefDesc: { fontSize: 11, color: Colors.grey400, lineHeight: 16 },
  note: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    marginTop: 20, padding: 14,
    backgroundColor: Colors.white, borderRadius: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  noteText: { flex: 1, fontSize: 11, color: Colors.grey400, lineHeight: 17 },
});

export default NotificationPrefsScreen;
