import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

const SavedAddressesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { addresses, removeAddress, setDefaultAddress } = useApp();

  const handleDelete = (id) => {
    Alert.alert(
      'Remove Address',
      'Are you sure you want to remove this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeAddress(id) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.addressCard, item.isDefault && styles.addressCardDefault]}>
      <View style={styles.addressTop}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{item.label}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>DEFAULT</Text>
            </View>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('AddEditAddress', { address: item })}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={14} color={Colors.grey500} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)} activeOpacity={0.7}>
            <Feather name="trash-2" size={14} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.addressName}>{item.fullName}</Text>
      <Text style={styles.addressLine}>{item.line1}{item.line2 ? `, ${item.line2}` : ''}</Text>
      <Text style={styles.addressLine}>{item.city}, {item.postcode}</Text>
      <Text style={styles.addressLine}>{item.country}</Text>
      <Text style={styles.addressPhone}>{item.phone}</Text>

      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultBtn}
          onPress={() => setDefaultAddress(item.id)}
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
        <Text style={styles.headerTitle}>SAVED ADDRESSES</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddEditAddress', {})}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={22} color={Colors.black} />
        </TouchableOpacity>
      </View>

      {addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="map-pin" size={40} color={Colors.grey200} />
          <Text style={styles.emptyTitle}>No saved addresses</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('AddEditAddress', {})}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyBtnText}>ADD ADDRESS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
  addressCard: {
    backgroundColor: Colors.white, padding: 16,
    borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  addressCardDefault: { borderWidth: 1, borderColor: Colors.gold, backgroundColor: 'rgba(201,168,76,0.03)' },
  addressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary, letterSpacing: 1, textTransform: 'uppercase' },
  defaultBadge: { backgroundColor: Colors.black, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  defaultBadgeText: { fontSize: 8, color: Colors.white, letterSpacing: 1, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 4 },
  actionBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  addressName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  addressLine: { fontSize: 12, color: Colors.grey500, lineHeight: 18 },
  addressPhone: { fontSize: 12, color: Colors.grey400, marginTop: 4 },
  setDefaultBtn: { marginTop: 12, paddingTop: 12, borderTopWidth: 0.5, borderTopColor: Colors.grey100 },
  setDefaultText: { fontSize: 12, color: Colors.gold, fontWeight: '600', textDecorationLine: 'underline' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyTitle: { fontFamily: 'Georgia', fontSize: 20, color: Colors.textPrimary },
  emptyBtn: { backgroundColor: Colors.black, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 10 },
  emptyBtnText: { color: Colors.white, fontSize: 11, letterSpacing: 2.5, fontWeight: '500' },
});

export default SavedAddressesScreen;
