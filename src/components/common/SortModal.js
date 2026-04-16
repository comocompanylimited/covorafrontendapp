import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../theme';

export const SORT_OPTIONS = [
  { id: 'featured',   label: 'Featured',           icon: 'star' },
  { id: 'newest',     label: 'Newest First',        icon: 'zap' },
  { id: 'price_asc',  label: 'Price: Low to High',  icon: 'trending-up' },
  { id: 'price_desc', label: 'Price: High to Low',  icon: 'trending-down' },
  { id: 'rating',     label: 'Top Rated',           icon: 'award' },
  { id: 'bestseller', label: 'Best Selling',        icon: 'shopping-bag' },
];

const SortModal = ({ visible, onClose, activeSort, onSelect }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>SORT BY</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={Colors.black} />
            </TouchableOpacity>
          </View>

          {SORT_OPTIONS.map((option) => {
            const isActive = activeSort === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionRow, isActive && styles.optionRowActive]}
                onPress={() => { onSelect(option.id); onClose(); }}
                activeOpacity={0.8}
              >
                <View style={[styles.optionIcon, isActive && styles.optionIconActive]}>
                  <Feather
                    name={option.icon}
                    size={16}
                    color={isActive ? Colors.black : Colors.grey400}
                  />
                </View>
                <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                  {option.label}
                </Text>
                {isActive && (
                  <Feather name="check" size={16} color={Colors.gold} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.white,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 3,
    backgroundColor: Colors.grey200,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 3,
    color: Colors.black,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
    gap: 14,
  },
  optionRowActive: {
    backgroundColor: '#FFFDF5',
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconActive: {
    backgroundColor: Colors.gold,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.grey600,
    letterSpacing: 0.2,
  },
  optionLabelActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});

export default SortModal;
