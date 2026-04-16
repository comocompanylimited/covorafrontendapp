import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Shadow } from '../../theme';

const { height } = Dimensions.get('window');

const PRICE_RANGES = [
  { label: 'Under £100', min: 0, max: 100 },
  { label: '£100 – £250', min: 100, max: 250 },
  { label: '£250 – £500', min: 250, max: 500 },
  { label: '£500 – £1,000', min: 500, max: 1000 },
  { label: 'Over £1,000', min: 1000, max: Infinity },
];

const RATINGS = [
  { label: '4.5 & above', value: 4.5 },
  { label: '4.0 & above', value: 4.0 },
  { label: '3.5 & above', value: 3.5 },
];

const SIZES_CLOTHING = ['XS', 'S', 'M', 'L', 'XL'];
const SIZES_SHOES = ['35', '36', '37', '38', '39', '40', '41'];
const COLORS = [
  { label: 'Black', hex: '#1A1A1A' },
  { label: 'White', hex: '#F5F0E8' },
  { label: 'Gold', hex: '#C9A84C' },
  { label: 'Nude', hex: '#C4A882' },
  { label: 'Burgundy', hex: '#8B1A2C' },
  { label: 'Grey', hex: '#8B8B8B' },
  { label: 'Sage', hex: '#A8B5A0' },
  { label: 'Camel', hex: '#8B7355' },
];

const FilterModal = ({ visible, onClose, onApply, initialFilters = {} }) => {
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState({
    priceRange: initialFilters.priceRange || null,
    sizes: initialFilters.sizes || [],
    colors: initialFilters.colors || [],
    minRating: initialFilters.minRating || null,
    onlyNew: initialFilters.onlyNew || false,
    onlySale: initialFilters.onlySale || false,
  });

  const toggleSize = (size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color],
    }));
  };

  const setPriceRange = (range) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange?.label === range.label ? null : range,
    }));
  };

  const setRating = (val) => {
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === val ? null : val,
    }));
  };

  const resetFilters = () => {
    setFilters({ priceRange: null, sizes: [], colors: [], minRating: null, onlyNew: false, onlySale: false });
  };

  const activeCount = [
    filters.priceRange,
    filters.sizes.length > 0,
    filters.colors.length > 0,
    filters.minRating,
    filters.onlyNew,
    filters.onlySale,
  ].filter(Boolean).length;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>FILTER</Text>
            {activeCount > 0 && (
              <TouchableOpacity onPress={resetFilters}>
                <Text style={styles.resetText}>Reset all ({activeCount})</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

            {/* Price Range */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>PRICE RANGE</Text>
              {PRICE_RANGES.map((range) => (
                <TouchableOpacity
                  key={range.label}
                  style={styles.optionRow}
                  onPress={() => setPriceRange(range)}
                  activeOpacity={0.8}
                >
                  <View style={[
                    styles.radio,
                    filters.priceRange?.label === range.label && styles.radioSelected,
                  ]}>
                    {filters.priceRange?.label === range.label && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <Text style={[
                    styles.optionLabel,
                    filters.priceRange?.label === range.label && styles.optionLabelActive,
                  ]}>
                    {range.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sizes */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>SIZE</Text>
              <View style={styles.chipsRow}>
                {SIZES_CLOTHING.map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[styles.chip, filters.sizes.includes(size) && styles.chipSelected]}
                    onPress={() => toggleSize(size)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, filters.sizes.includes(size) && styles.chipTextSelected]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[styles.chipsRow, { marginTop: 8 }]}>
                {SIZES_SHOES.slice(0, 4).map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[styles.chip, styles.chipSmall, filters.sizes.includes(size) && styles.chipSelected]}
                    onPress={() => toggleSize(size)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, styles.chipTextSmall, filters.sizes.includes(size) && styles.chipTextSelected]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Colours */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>COLOUR</Text>
              <View style={styles.colorRow}>
                {COLORS.map(color => (
                  <TouchableOpacity
                    key={color.label}
                    style={styles.colorItem}
                    onPress={() => toggleColor(color.hex)}
                    activeOpacity={0.85}
                  >
                    <View style={[
                      styles.colorSwatch,
                      { backgroundColor: color.hex },
                      filters.colors.includes(color.hex) && styles.colorSwatchSelected,
                    ]}>
                      {filters.colors.includes(color.hex) && (
                        <Feather name="check" size={10} color={color.hex === '#F5F0E8' ? Colors.black : Colors.white} />
                      )}
                    </View>
                    <Text style={[
                      styles.colorLabel,
                      filters.colors.includes(color.hex) && styles.colorLabelActive,
                    ]}>
                      {color.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>MINIMUM RATING</Text>
              {RATINGS.map((r) => (
                <TouchableOpacity
                  key={r.label}
                  style={styles.optionRow}
                  onPress={() => setRating(r.value)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radio, filters.minRating === r.value && styles.radioSelected]}>
                    {filters.minRating === r.value && <View style={styles.radioDot} />}
                  </View>
                  <View style={styles.ratingOptionInner}>
                    <Feather name="star" size={12} color={Colors.gold} />
                    <Text style={[styles.optionLabel, filters.minRating === r.value && styles.optionLabelActive]}>
                      {r.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick filters */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>QUICK FILTERS</Text>
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setFilters(p => ({ ...p, onlyNew: !p.onlyNew }))}
                activeOpacity={0.8}
              >
                <Text style={styles.optionLabel}>New Arrivals Only</Text>
                <View style={[styles.toggle, filters.onlyNew && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, filters.onlyNew && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setFilters(p => ({ ...p, onlySale: !p.onlySale }))}
                activeOpacity={0.8}
              >
                <Text style={styles.optionLabel}>On Sale</Text>
                <View style={[styles.toggle, filters.onlySale && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, filters.onlySale && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.applySection}>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => { onApply(filters); onClose(); }}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>
                APPLY FILTERS{activeCount > 0 ? ` (${activeCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: height * 0.88,
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
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: 3,
    color: Colors.black,
  },
  resetText: {
    fontSize: 11,
    color: Colors.gold,
    letterSpacing: 0.5,
    fontWeight: '500',
    marginRight: 16,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.grey400,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.gold,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gold,
  },
  optionLabel: {
    fontSize: 14,
    color: Colors.grey600,
    letterSpacing: 0.2,
  },
  optionLabelActive: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  ratingOptionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minWidth: 52,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  chipSmall: {
    minWidth: 44,
    height: 40,
    paddingHorizontal: 10,
  },
  chipSelected: {
    borderColor: Colors.black,
    backgroundColor: Colors.black,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.grey700,
    letterSpacing: 0.5,
  },
  chipTextSmall: {
    fontSize: 11,
  },
  chipTextSelected: {
    color: Colors.white,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorItem: {
    alignItems: 'center',
    gap: 5,
    width: 44,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  colorLabel: {
    fontSize: 9,
    color: Colors.grey400,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  colorLabelActive: {
    color: Colors.gold,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
  },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.grey200,
    padding: 3,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.gold,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    ...Shadow.sm,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  applySection: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: Colors.grey100,
  },
  applyBtn: {
    backgroundColor: Colors.black,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: Colors.white,
    fontSize: 12,
    letterSpacing: 2.5,
    fontWeight: '500',
  },
});

export default FilterModal;
