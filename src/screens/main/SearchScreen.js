import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Shadow } from '../../theme';
import { CATEGORIES } from '../../data/mockProducts';
import { useApp } from '../../hooks/useAppContext';
import { ScreenState, SkeletonBlock } from '../../components/common';
import { searchCatalog } from '../../services/productService';

const { width } = Dimensions.get('window');

const TRENDING_SEARCHES = ['Silk Dress', 'Gold Jewellery', 'Luxury Bags', 'Skincare', 'Heels', 'Cashmere', 'Fragrance', 'Blazer'];
const INITIAL_RECENT = ['Perfume', 'Silk Blazer', 'Loafers'];

// â”€â”€â”€ Search Result Item â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ResultItem = ({ item, onPress, onWishlistToggle, isWishlisted }) => (
  <TouchableOpacity style={resultStyles.item} onPress={onPress} activeOpacity={0.9}>
    <Image source={{ uri: item.image }} style={resultStyles.image} resizeMode="cover" />
    <View style={resultStyles.info}>
      <Text style={resultStyles.brand} numberOfLines={1}>{item.brand}</Text>
      <Text style={resultStyles.name} numberOfLines={2}>{item.name}</Text>
      <View style={resultStyles.priceRow}>
        <Text style={resultStyles.price}>£{item.price.toFixed(2)}</Text>
        {item.originalPrice && (
          <Text style={resultStyles.originalPrice}>£{item.originalPrice.toFixed(2)}</Text>
        )}
        {item.discount && (
          <View style={resultStyles.discountBadge}>
            <Text style={resultStyles.discountText}>-{item.discount}%</Text>
          </View>
        )}
      </View>
      {item.rating > 0 && (
        <View style={resultStyles.ratingRow}>
          <Feather name="star" size={10} color={Colors.gold} />
          <Text style={resultStyles.rating}>{item.rating?.toFixed(1)}</Text>
          <Text style={resultStyles.reviewCount}>({item.reviewCount})</Text>
        </View>
      )}
    </View>
    <TouchableOpacity
      onPress={() => onWishlistToggle(item)}
      style={resultStyles.wishBtn}
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
    >
      <Feather
        name="heart"
        size={18}
        color={isWishlisted ? Colors.gold : Colors.grey300}
      />
    </TouchableOpacity>
  </TouchableOpacity>
);

const resultStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 140,
    backgroundColor: Colors.grey100,
  },
  info: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  brand: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.grey400,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Georgia',
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 19,
    marginBottom: 8,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  price: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  originalPrice: {
    fontSize: 11,
    color: Colors.grey400,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: { color: Colors.white, fontSize: 9, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  rating: { fontSize: 11, color: Colors.grey600, fontWeight: '500' },
  reviewCount: { fontSize: 10, color: Colors.grey400 },
  wishBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
});

// â”€â”€â”€ Category Quick Links â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CategoryQuickLinks = ({ navigation }) => (
  <View style={catStyles.section}>
    <Text style={catStyles.title}>SHOP BY CATEGORY</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={catStyles.scroll}>
      {CATEGORIES.slice(0, 8).map(cat => (
        <TouchableOpacity
          key={cat.id}
          style={catStyles.chip}
          onPress={() => navigation.navigate('CategoryLanding', { categoryId: cat.id, categoryName: cat.name })}
          activeOpacity={0.8}
        >
          <Image source={{ uri: cat.image }} style={catStyles.chipImage} resizeMode="cover" />
          <View style={catStyles.chipOverlay} />
          <Text style={catStyles.chipText}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const catStyles = StyleSheet.create({
  section: {
    paddingTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.grey400,
    letterSpacing: 2.5,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    marginBottom: 12,
  },
  scroll: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    gap: 8,
  },
  chip: {
    width: 90,
    height: 110,
    overflow: 'hidden',
    borderRadius: 10,
    position: 'relative',
    backgroundColor: Colors.grey100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  chipImage: { width: '100%', height: '100%' },
  chipOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  chipText: {
    position: 'absolute',
    bottom: 8,
    left: 6,
    right: 6,
    color: Colors.white,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

// â”€â”€â”€ Main Search Screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SearchScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { toggleWishlist, isInWishlist } = useApp();
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (query.trim().length >= 2) {
        setLoadingResults(true);
        const next = await searchCatalog(query);
        if (active) {
          setResults(next);
          setLoadingResults(false);
        }
      } else {
        setResults([]);
        setLoadingResults(false);
      }
    };
    run();
    return () => { active = false; };
  }, [query]);

  const handleTapSuggestion = useCallback((text) => {
    setQuery(text);
    inputRef.current?.focus();
    // Add to recent
    setRecentSearches(prev => {
      const filtered = prev.filter(r => r.toLowerCase() !== text.toLowerCase());
      return [text, ...filtered].slice(0, 5);
    });
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  }, []);

  const handleProductPress = useCallback((item) => {
    // Save to recent if text present
    if (query.trim().length >= 2) {
      setRecentSearches(prev => {
        const filtered = prev.filter(r => r.toLowerCase() !== query.toLowerCase());
        return [query, ...filtered].slice(0, 5);
      });
    }
    navigation.goBack();
    setTimeout(() => navigation.navigate('ProductDetail', { product: item }), 50);
  }, [query, navigation]);

  const showResults = query.trim().length >= 2;
  const noResults = showResults && results.length === 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Search header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Feather name="search" size={17} color={query.length > 0 ? Colors.black : Colors.grey400} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search for products, brands..."
              placeholderTextColor={Colors.grey400}
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
              selectionColor={Colors.gold}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Feather name="x-circle" size={16} color={Colors.grey400} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn} activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Live results count */}
        {showResults && results.length > 0 && (
          <View style={styles.resultsBar}>
            <Text style={styles.resultsCount}>{results.length} results for "{query}"</Text>
          </View>
        )}
      </View>

      {/* â”€â”€ Content â”€â”€ */}
      {showResults ? (
        // Results
        loadingResults ? (
          <View style={styles.resultsContent}>
            <SkeletonBlock height={130} style={styles.resultSkeleton} />
            <SkeletonBlock height={130} style={styles.resultSkeleton} />
            <SkeletonBlock height={130} style={styles.resultSkeleton} />
          </View>
        ) : <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            noResults ? (
              <ScreenState
                type="empty"
                icon="search"
                title="No Results Found"
                message={`No products match "${query}". Try a different search term.`}
                ctaLabel="CLEAR SEARCH"
                onCtaPress={handleClear}
                compactLogo
              />
            ) : null
          }
          renderItem={({ item }) => (
            <ResultItem
              item={item}
              onPress={() => handleProductPress(item)}
              onWishlistToggle={toggleWishlist}
              isWishlisted={isInWishlist(item.id)}
            />
          )}
        />
      ) : (
        // Discovery state
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
                <TouchableOpacity onPress={() => setRecentSearches([])} activeOpacity={0.7}>
                  <Text style={styles.sectionAction}>Clear</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.recentRow}
                  onPress={() => handleTapSuggestion(item)}
                  activeOpacity={0.8}
                >
                  <Feather name="clock" size={14} color={Colors.grey400} />
                  <Text style={styles.recentText}>{item}</Text>
                  <Feather name="arrow-up-left" size={14} color={Colors.grey300} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Trending */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRENDING SEARCHES</Text>
            <View style={styles.trendingGrid}>
              {TRENDING_SEARCHES.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.trendingChip}
                  onPress={() => handleTapSuggestion(item)}
                  activeOpacity={0.8}
                >
                  <Feather name="trending-up" size={12} color={Colors.gold} />
                  <Text style={styles.trendingText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category quick links */}
          <CategoryQuickLinks navigation={navigation} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey100,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingLeft: 4,
  },
  cancelText: {
    fontSize: 13,
    color: Colors.grey600,
    letterSpacing: 0.3,
  },
  resultsBar: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingBottom: 10,
  },
  resultsCount: {
    fontSize: 11,
    color: Colors.grey400,
    letterSpacing: 0.3,
  },

  // Sections
  section: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.grey400,
    letterSpacing: 2.5,
  },
  sectionAction: {
    fontSize: 11,
    color: Colors.grey400,
    textDecorationLine: 'underline',
  },

  // Recent
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
    gap: 10,
  },
  recentText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },

  // Trending
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.grey200,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  trendingText: {
    fontSize: 12,
    color: Colors.grey700,
    letterSpacing: 0.3,
  },

  // Results
  resultsContent: {
    padding: Spacing.screenPaddingHorizontal,
    paddingBottom: 40,
  },
  resultSkeleton: {
    marginBottom: 12,
    width: '100%',
  },

  // No Results
  noResults: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 12,
  },
  noResultsTitle: {
    fontFamily: 'Georgia',
    fontSize: 22,
    color: Colors.textPrimary,
  },
  noResultsText: {
    fontSize: 13,
    color: Colors.grey400,
    textAlign: 'center',
    lineHeight: 20,
  },
  noResultsBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.black,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  noResultsBtnText: {
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: '500',
    color: Colors.black,
  },
});

export default SearchScreen;

