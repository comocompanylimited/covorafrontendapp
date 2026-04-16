import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

// ─── Menu Data ────────────────────────────────────────────────────────────────
const MENU_SECTIONS = [
  {
    title: 'My Orders',
    items: [
      { icon: 'package',        label: 'My Orders',           route: 'MyOrders' },
      { icon: 'refresh-cw',     label: 'Returns & Exchanges', route: 'Returns' },
      { icon: 'credit-card',    label: 'Store Credit',        route: 'StoreCredit' },
      { icon: 'gift',           label: 'Gift Cards',          route: 'GiftCards' },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: 'map-pin',        label: 'Saved Addresses',     route: 'SavedAddresses' },
      { icon: 'credit-card',    label: 'Payment Methods',     route: 'SavedPayments' },
      { icon: 'bell',           label: 'Notifications',       route: 'NotificationPrefs' },
      { icon: 'star',           label: 'Favourite Brands',    route: 'FavouriteBrands' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'sliders',        label: 'Style Preferences',   route: 'Preferences' },
      { icon: 'settings',       label: 'Settings',            route: 'Settings' },
      { icon: 'users',          label: 'Refer a Friend',      route: 'ReferFriend' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle',    label: 'Help Centre',         route: 'HelpCenter' },
      { icon: 'message-circle', label: 'Contact Us',          route: 'ContactSupport' },
      { icon: 'edit-2',          label: 'Share Your Ideas',    route: 'ContactSupport' },
      { icon: 'info',           label: 'About COVORA',        route: 'About' },
      { icon: 'shield',         label: 'Privacy Policy',      route: 'Privacy' },
      { icon: 'file-text',      label: 'Terms & Conditions',  route: 'Terms' },
    ],
  },
];

// ─── Row Item ─────────────────────────────────────────────────────────────────
const MenuItem = ({ item, onPress, gold }) => (
  <TouchableOpacity style={itemStyles.row} onPress={onPress} activeOpacity={0.75}>
    <View style={[itemStyles.iconWrap, gold && itemStyles.iconWrapGold]}>
      <Feather name={item.icon} size={16} color={gold ? Colors.gold : Colors.grey600} />
    </View>
    <Text style={[itemStyles.label, gold && itemStyles.labelGold]}>{item.label}</Text>
    <Feather name="chevron-right" size={14} color={Colors.grey300} />
  </TouchableOpacity>
);

const itemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey100,
    backgroundColor: Colors.white,
    gap: 12,
  },
  iconWrap: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapGold: {},
  label: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: Colors.black,
    letterSpacing: 0.1,
  },
  labelGold: {
    color: Colors.gold,
  },
});

// ─── Stat Pill ────────────────────────────────────────────────────────────────
const StatPill = ({ value, label, onPress }) => (
  <TouchableOpacity style={statStyles.pill} onPress={onPress} activeOpacity={0.7}>
    <Text style={statStyles.value}>{value}</Text>
    <Text style={statStyles.label}>{label}</Text>
  </TouchableOpacity>
);

const statStyles = StyleSheet.create({
  pill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  value: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    color: Colors.black,
    marginBottom: 3,
  },
  label: {
    fontSize: 8,
    fontWeight: '500',
    color: Colors.grey400,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user, wishlistCount, cartCount, orders, signOut } = useApp();

  const nav = (route) => {
    if (route === 'Wishlist') {
      navigation.navigate('Wishlist');
    } else {
      navigation.navigate(route);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <Text style={styles.headerTitle}>Account</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsBtn}
            activeOpacity={0.7}
          >
            <Feather name="settings" size={19} color={Colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {isAuthenticated && user ? (
            <>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarInitials}>
                    {(user.firstName?.[0] || user.name?.[0] || 'C').toUpperCase()}
                    {(user.lastName?.[0] || user.name?.split(' ')[1]?.[0] || '').toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.editAvatarBtn}
                  onPress={() => navigation.navigate('EditProfile')}
                  activeOpacity={0.8}
                >
                  <Feather name="camera" size={10} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.verifiedRow}>
                <Feather name="check-circle" size={11} color={Colors.gold} />
                <Text style={styles.verifiedText}>Verified Member</Text>
              </View>
              <TouchableOpacity
                style={styles.editProfileBtn}
                onPress={() => navigation.navigate('EditProfile')}
                activeOpacity={0.8}
              >
                <Text style={styles.editProfileBtnText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={[styles.avatar, styles.avatarGuest]}>
                <Feather name="user" size={28} color={Colors.grey400} />
              </View>
              <Text style={styles.guestTitle}>Welcome</Text>
              <Text style={styles.guestSub}>Sign in for a personalised experience</Text>
              <TouchableOpacity
                style={styles.signInBtn}
                onPress={() => navigation.navigate('SignIn')}
                activeOpacity={0.85}
              >
                <Text style={styles.signInBtnText}>SIGN IN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')} activeOpacity={0.7}>
                <Text style={styles.createText}>Create an Account</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatPill value={orders?.length || 0} label="Orders" onPress={() => navigation.navigate('MyOrders')} />
            <View style={styles.statDivider} />
            <StatPill value={wishlistCount} label="Saved" onPress={() => navigation.navigate('Wishlist')} />
            <View style={styles.statDivider} />
            <StatPill value={cartCount} label="In Bag" onPress={() => navigation.navigate('Cart')} />
          </View>
        </View>

        {/* Rewards Banner */}
        <TouchableOpacity style={styles.rewardsBanner} activeOpacity={0.9} onPress={() => navigation.navigate('About')}>
          <View style={styles.rewardsLeft}>
            <Feather name="award" size={18} color={Colors.gold} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.rewardsTitle}>COVORA Rewards</Text>
              <Text style={styles.rewardsSub}>Earn points on every purchase</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={14} color={Colors.gold} />
        </TouchableOpacity>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, i) => (
                <MenuItem
                  key={item.label}
                  item={item}
                  onPress={() => nav(item.route)}
                />
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        {isAuthenticated && (
          <TouchableOpacity style={styles.signOutRow} onPress={handleSignOut} activeOpacity={0.8}>
            <Feather name="log-out" size={16} color={Colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
          <Text style={styles.footerBrand}>A COMODO STUDIOS BRAND</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.grey100,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerInner: {
    height: 52,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 0.3,
    color: Colors.black,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingBottom: 48,
  },

  // Profile Card
  profileCard: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 0,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    marginBottom: 10,
    marginHorizontal: 0,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGuest: {
    backgroundColor: Colors.grey100,
    borderWidth: 1,
    borderColor: Colors.grey200,
    marginBottom: 14,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 1,
  },
  userName: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    color: Colors.black,
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.grey500,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 14,
  },
  verifiedText: {
    fontSize: 10,
    color: Colors.gold,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  editProfileBtn: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.grey200,
    marginBottom: 20,
    borderRadius: 20,
  },
  editProfileBtnText: {
    fontSize: 10,
    color: Colors.grey600,
    letterSpacing: 1.2,
    fontWeight: '500',
  },
  guestTitle: {
    fontFamily: 'Georgia',
    fontSize: 20,
    color: Colors.black,
    fontWeight: '400',
    marginBottom: 6,
    marginTop: 14,
  },
  guestSub: {
    fontSize: 12,
    color: Colors.grey500,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  signInBtn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 48,
    paddingVertical: 13,
    marginBottom: 10,
    borderRadius: 8,
  },
  signInBtnText: {
    color: Colors.white,
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: '500',
  },
  createText: {
    fontSize: 11,
    color: Colors.grey500,
    textDecorationLine: 'underline',
    letterSpacing: 0.2,
    marginBottom: 20,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: Colors.grey100,
    marginTop: 4,
  },
  statDivider: {
    width: 0.5,
    height: 28,
    backgroundColor: Colors.grey200,
  },

  // Rewards Banner
  rewardsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDFBF4',
    paddingVertical: 16,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    marginBottom: 10,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  rewardsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardsTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.black,
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  rewardsSub: {
    fontSize: 10,
    color: Colors.grey500,
    letterSpacing: 0.2,
  },

  // Menu Sections
  section: {
    marginBottom: 8,
    marginHorizontal: Spacing.screenPaddingHorizontal,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.grey400,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
  sectionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  // Sign Out
  signOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: Spacing.screenPaddingHorizontal,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  signOutText: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '400',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  footerVersion: {
    fontSize: 10,
    color: Colors.grey300,
    marginBottom: 3,
  },
  footerBrand: {
    fontSize: 8,
    color: Colors.grey300,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default ProfileScreen;
