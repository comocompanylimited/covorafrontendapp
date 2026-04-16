import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

const SavedPaymentsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { paymentMethods, removePaymentMethod, setDefaultPayment } = useApp();

  const handleDelete = (id) => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removePaymentMethod(id) },
      ]
    );
  };

  const brandIcon = (brand) => {
    switch (brand?.toLowerCase()) {
      case 'visa':       return 'VISA';
      case 'mastercard': return 'MC';
      case 'amex':       return 'AMEX';
      default:           return brand?.toUpperCase()?.slice(0, 4) || '****';
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.cardItem, item.isDefault && styles.cardItemDefault]}>
      <View style={styles.cardTop}>
        <View style={styles.cardBrandBox}>
          <Text style={styles.cardBrandText}>{brandIcon(item.brand)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.cardLabelRow}>
            <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardHolder}>{item.nickname || item.cardHolder}</Text>
          {item.nickname ? <Text style={styles.cardSub}>Cardholder: {item.cardHolder}</Text> : null}
          <Text style={styles.cardExpiry}>Expires {item.expiry}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('AddEditPayment', { payment: item })}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={14} color={Colors.grey500} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)} activeOpacity={0.7}>
            <Feather name="trash-2" size={14} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultBtn}
          onPress={() => setDefaultPayment(item.id)}
          activeOpacity={0.75}
        >
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PAYMENT METHODS</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddEditPayment', {})}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={22} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {paymentMethods.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="credit-card" size={40} color={Colors.grey200} />
          <Text style={styles.emptyTitle}>No saved cards</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('AddEditPayment', {})}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyBtnText}>ADD CARD</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={paymentMethods}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.secureNote}>
              <Feather name="lock" size={12} color={Colors.grey400} />
              <Text style={styles.secureText}>Your card details are encrypted and stored securely</Text>
            </View>
          }
        />
      )}
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
  addBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 40 },
  cardItem: {
    backgroundColor: Colors.white, padding: 16,
    borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  cardItemDefault: { borderWidth: 1, borderColor: Colors.gold },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cardBrandBox: {
    width: 52, height: 36, borderWidth: 1, borderColor: Colors.grey200,
    borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.offWhite,
  },
  cardBrandText: { fontSize: 9, fontWeight: '800', color: Colors.textPrimary, letterSpacing: 0.5 },
  cardInfo: { flex: 1 },
  cardLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  cardNumber: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, letterSpacing: 1 },
  defaultBadge: { backgroundColor: Colors.black, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  defaultBadgeText: { fontSize: 8, color: Colors.white, letterSpacing: 1, fontWeight: '600' },
  cardHolder: { fontSize: 12, color: Colors.grey500, marginBottom: 1 },
  cardSub: { fontSize: 11, color: Colors.grey400, marginBottom: 1 },
  cardExpiry: { fontSize: 12, color: Colors.grey400 },
  actions: {},
  actionBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  setDefaultBtn: { marginTop: 12, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.grey100 },
  setDefaultText: { fontSize: 12, color: Colors.gold, fontWeight: '600', textDecorationLine: 'underline' },
  secureNote: {
    flexDirection: 'row', gap: 8, alignItems: 'center',
    paddingTop: 12, paddingHorizontal: 4,
  },
  secureText: { fontSize: 11, color: Colors.grey400, lineHeight: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyTitle: { fontFamily: 'Georgia', fontSize: 20, color: Colors.textPrimary },
  emptyBtn: { backgroundColor: Colors.black, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 10 },
  emptyBtnText: { color: Colors.white, fontSize: 11, letterSpacing: 2.5, fontWeight: '500' },
});

export default SavedPaymentsScreen;
