import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, Image, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, Shadow } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { fetchOrderHistory } from '../../services/commerceService';

const STATUS_COLORS = {
  Processing:         { bg: 'rgba(255,167,38,0.12)',  text: '#E65100' },
  Confirmed:          { bg: 'rgba(255,193,7,0.15)',   text: '#8D6E00' },
  Shipped:            { bg: 'rgba(33,150,243,0.10)',  text: '#1565C0' },
  Dispatched:         { bg: 'rgba(33,150,243,0.10)',  text: '#1565C0' },
  'Out for delivery': { bg: 'rgba(255,152,0,0.12)',   text: '#E65100' },
  Delivered:          { bg: 'rgba(46,125,50,0.10)',   text: Colors.success },
  Cancelled:          { bg: 'rgba(198,40,40,0.10)',   text: Colors.error },
  Returned:           { bg: 'rgba(100,100,100,0.10)', text: Colors.grey600 },
};

const FILTER_TABS = ['All', 'Processing', 'Shipped', 'Delivered'];

// ── Order Card ────────────────────────────────────────────────────────────────
const OrderCard = ({ order, onPress }) => {
  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.Processing;
  const itemCount   = order.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.orderNumber}>{order.number}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{order.status}</Text>
        </View>
      </View>

      {/* Items thumbnails + meta */}
      <View style={styles.cardBody}>
        <View style={styles.thumbRow}>
          {order.items?.slice(0, 3).map((item, idx) => (
            <View key={item.id || idx} style={[styles.thumb, idx > 0 && styles.thumbOverlap]}>
              <Image source={{ uri: item.image }} style={styles.thumbImg} resizeMode="cover" />
            </View>
          ))}
          {order.items?.length > 3 && (
            <View style={[styles.thumb, styles.thumbOverlap, styles.thumbMore]}>
              <Text style={styles.thumbMoreText}>+{order.items.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardMeta}>
          <Text style={styles.itemCount}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
          <Text style={styles.orderTotal}>£{(order.total ?? 0).toFixed(2)}</Text>
        </View>
      </View>

      {/* Tracking */}
      {order.trackingNumber ? (
        <View style={styles.trackingRow}>
          <Feather name="truck" size={11} color={Colors.grey400} />
          <Text style={styles.trackingText}>Tracking: {order.trackingNumber}</Text>
        </View>
      ) : order.status === 'Processing' ? (
        <View style={styles.trackingRow}>
          <Feather name="clock" size={11} color={Colors.grey400} />
          <Text style={styles.trackingText}>Tracking number will be assigned shortly</Text>
        </View>
      ) : null}

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.viewDetail}>View Details</Text>
        <Feather name="chevron-right" size={14} color={Colors.grey400} />
      </View>
    </TouchableOpacity>
  );
};

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyOrders = ({ filter, onShop }) => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIcon}>
      <Feather name="package" size={28} color={Colors.grey300} />
    </View>
    <Text style={styles.emptyTitle}>
      {filter === 'All' ? 'No Orders Yet' : `No ${filter} Orders`}
    </Text>
    <Text style={styles.emptySub}>
      {filter === 'All'
        ? 'Your order history will appear here once you place your first order.'
        : `You have no ${filter.toLowerCase()} orders at the moment.`}
    </Text>
    {filter === 'All' && (
      <TouchableOpacity style={styles.shopBtn} onPress={onShop} activeOpacity={0.85}>
        <Text style={styles.shopBtnText}>START SHOPPING</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ── Main Screen ───────────────────────────────────────────────────────────────
const MyOrdersScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { orders: localOrders, isAuthenticated } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState(localOrders);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchOrderHistory(localOrders);
        if (!cancelled) setOrders(result);
      } catch {
        if (!cancelled) setOrders(localOrders);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setOrders(localOrders);
  }, [localOrders]);

  const filtered = activeFilter === 'All'
    ? orders
    : orders.filter(o => {
        if (activeFilter === 'Shipped') return o.status === 'Shipped' || o.status === 'Dispatched';
        return o.status === activeFilter;
      });

  const filterCounts = FILTER_TABS.reduce((acc, tab) => {
    if (tab === 'All') { acc[tab] = orders.length; return acc; }
    if (tab === 'Shipped') {
      acc[tab] = orders.filter(o => o.status === 'Shipped' || o.status === 'Dispatched').length;
      return acc;
    }
    acc[tab] = orders.filter(o => o.status === tab).length;
    return acc;
  }, {});

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MY ORDERS</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Sign-in banner (soft prompt, not a hard gate) */}
      {!isAuthenticated && (
        <TouchableOpacity
          style={styles.authBanner}
          onPress={() => navigation.navigate('SignIn')}
          activeOpacity={0.88}
        >
          <Feather name="user" size={15} color={Colors.gold} />
          <Text style={styles.authBannerText}>Sign in to sync your order history</Text>
          <Feather name="chevron-right" size={14} color={Colors.gold} />
        </TouchableOpacity>
      )}

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map(tab => {
          const count = filterCounts[tab] || 0;
          const active = activeFilter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, active && styles.filterTabActive]}
              onPress={() => setActiveFilter(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
                {tab}
              </Text>
              {count > 0 && (
                <View style={[styles.filterBadge, active && styles.filterBadgeActive]}>
                  <Text style={[styles.filterBadgeText, active && styles.filterBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Orders list or empty state */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.gold} />
        </View>
      ) : filtered.length === 0 ? (
        <EmptyOrders
          filter={activeFilter}
          onShop={() => navigation.navigate('Main', { screen: 'Categories' })}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: Math.max(insets.bottom, 16) + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.offWhite },

  header: {
    height: 56,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 16,
    letterSpacing: 3,
    color: Colors.black,
  },

  authBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(201,168,76,0.08)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(201,168,76,0.25)',
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 11,
  },
  authBannerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.grey700,
    letterSpacing: 0.2,
  },

  filterRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.grey200,
    borderRadius: 20,
  },
  filterTabActive: { borderColor: Colors.black, backgroundColor: Colors.black },
  filterTabText: { fontSize: 10, fontWeight: '600', color: Colors.grey500, letterSpacing: 1.5 },
  filterTabTextActive: { color: Colors.white },
  filterBadge: {
    backgroundColor: Colors.grey100,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeActive: { backgroundColor: 'rgba(255,255,255,0.22)' },
  filterBadgeText: { fontSize: 9, fontWeight: '700', color: Colors.grey500 },
  filterBadgeTextActive: { color: Colors.white },

  list: {
    padding: Spacing.screenPaddingHorizontal,
  },

  // Order card
  card: {
    backgroundColor: Colors.white,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
  },
  cardHeaderLeft: { gap: 2 },
  orderNumber: {
    fontFamily: 'Georgia',
    fontSize: 15,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  orderDate: { fontSize: 11, color: Colors.grey400 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },

  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  thumbRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: {
    width: 54,
    height: 68,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.grey100,
    overflow: 'hidden',
  },
  thumbOverlap: { marginLeft: -14 },
  thumbImg: { width: '100%', height: '100%' },
  thumbMore: {
    backgroundColor: Colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbMoreText: { fontSize: 11, fontWeight: '700', color: Colors.grey500 },
  cardMeta: { alignItems: 'flex-end', gap: 4 },
  itemCount: { fontSize: 11, color: Colors.grey500 },
  orderTotal: {
    fontFamily: 'Georgia',
    fontSize: 20,
    color: Colors.textPrimary,
  },

  trackingRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  trackingText: { fontSize: 11, color: Colors.grey400 },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderTopWidth: 0.5,
    borderTopColor: Colors.grey100,
  },
  viewDetail: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary, letterSpacing: 0.5 },

  // Empty state
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 44,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    color: Colors.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: Colors.grey500,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  shopBtn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 36,
    paddingVertical: 13,
    borderRadius: 8,
  },
  shopBtnText: { color: Colors.white, fontSize: 10, letterSpacing: 2.5, fontWeight: '500' },
});

export default MyOrdersScreen;
