import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';
import { ScreenState } from '../../components/common';

const ICONS = {
  order: 'package',
  sale: 'tag',
  wishlist: 'heart',
  delivery: 'truck',
  arrivals: 'zap',
};

const NotificationsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead, markAllRead } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NOTIFICATIONS</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {notifications.length === 0 ? (
        <ScreenState
          type="empty"
          icon="bell"
          title="No Notifications"
          message="You're all caught up. We will notify you about order updates, arrivals, and private offers."
          compactLogo
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map(notif => (
            <TouchableOpacity
              key={notif.id}
              style={[styles.notifItem, !notif.read && styles.notifUnread]}
              onPress={() => markNotificationRead(notif.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.notifIcon, !notif.read && styles.notifIconUnread]}>
                <Feather
                  name={ICONS[notif.type] || 'bell'}
                  size={18}
                  color={notif.read ? Colors.grey400 : Colors.gold}
                />
              </View>
              <View style={styles.notifContent}>
                <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]}>
                  {notif.title}
                </Text>
                <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
              {!notif.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerInner: {
    height: 56,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 4,
    color: Colors.black,
  },
  markAllBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  markAllText: {
    fontSize: 11,
    color: Colors.gold,
    letterSpacing: 0.3,
    fontWeight: '500',
  },

  // Notification items
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
    gap: 12,
    backgroundColor: Colors.white,
  },
  notifUnread: {
    backgroundColor: '#FFFDF5',
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.grey100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notifIconUnread: {
    backgroundColor: 'rgba(201,168,76,0.1)',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.grey600,
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  notifTitleUnread: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  notifMessage: {
    fontSize: 12,
    color: Colors.grey500,
    lineHeight: 17,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 10,
    color: Colors.grey400,
    letterSpacing: 0.3,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.gold,
    marginTop: 6,
  },

  // Empty
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: Colors.grey200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.grey400,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;
