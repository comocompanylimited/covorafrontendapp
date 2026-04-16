import 'react-native-gesture-handler';
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { Colors, Spacing } from '../theme';
import { useApp } from '../hooks/useAppContext';

// ── Tab screens
import HomeScreen from '../screens/main/HomeScreen';
import CategoriesScreen from '../screens/main/CategoriesScreen';
import WishlistScreen from '../screens/main/WishlistScreen';
import CartScreen from '../screens/main/CartScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// ── Stack screens
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import SearchScreen from '../screens/main/SearchScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import CategoryLandingScreen from '../screens/main/CategoryLandingScreen';

// ── Auth screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyCodeScreen from '../screens/auth/VerifyCodeScreen';

// ── Checkout screens
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import ShippingAddressScreen from '../screens/checkout/ShippingAddressScreen';
import DeliveryMethodScreen from '../screens/checkout/DeliveryMethodScreen';
import PaymentMethodScreen from '../screens/checkout/PaymentMethodScreen';
import OrderReviewScreen from '../screens/checkout/OrderReviewScreen';
import OrderConfirmationScreen from '../screens/checkout/OrderConfirmationScreen';

// ── Order screens
import MyOrdersScreen from '../screens/orders/MyOrdersScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';

// ── Account screens
import EditProfileScreen from '../screens/account/EditProfileScreen';
import SavedAddressesScreen from '../screens/account/SavedAddressesScreen';
import AddEditAddressScreen from '../screens/account/AddEditAddressScreen';
import SavedPaymentsScreen from '../screens/account/SavedPaymentsScreen';
import AddEditPaymentScreen from '../screens/account/AddEditPaymentScreen';
import PreferencesScreen from '../screens/account/PreferencesScreen';
import NotificationPrefsScreen from '../screens/account/NotificationPrefsScreen';
import SettingsScreen from '../screens/account/SettingsScreen';
import ReturnsScreen from '../screens/account/ReturnsScreen';
import StoreCreditScreen from '../screens/account/StoreCreditScreen';
import GiftCardsScreen from '../screens/account/GiftCardsScreen';
import ReferFriendScreen from '../screens/account/ReferFriendScreen';
import FavouriteBrandsScreen from '../screens/account/FavouriteBrandsScreen';

// ── Not Found
import NotFoundScreen from '../screens/NotFoundScreen';

// ── Info screens
import AboutScreen from '../screens/info/AboutScreen';
import PrivacyPolicyScreen from '../screens/info/PrivacyPolicyScreen';
import TermsScreen from '../screens/info/TermsScreen';
import HelpCenterScreen from '../screens/info/HelpCenterScreen';
import ContactSupportScreen from '../screens/info/ContactSupportScreen';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

// ─── Floating Tab Bar ─────────────────────────────────────────────────────────
//
// 6-tab dark glass pill. Each tab carries a `routeIndex` pointing to its
// actual route in the Tab.Navigator (null for stack-only tabs like Search).
//
const TABS = [
  { name: 'Home',       icon: 'home',         label: 'Home',    routeIndex: 0 },
  { name: 'Search',     icon: 'search',        label: 'Search',  routeIndex: null, isStack: true },
  { name: 'Categories', icon: 'grid',          label: 'Shop',    routeIndex: 1 },
  { name: 'Cart',       icon: 'shopping-bag',  label: 'Bag',     routeIndex: 2, badgeKey: 'cartCount' },
  { name: 'Wishlist',   icon: 'heart',         label: 'Saved',   routeIndex: 3, badgeKey: 'wishlistCount' },
  { name: 'Profile',    icon: 'user',          label: 'Account', routeIndex: 4 },
];

const ICON_SIZE   = 19;   // clean and readable across 6 tabs
const LABEL_SIZE  = 7.5;  // compact — 6 tabs need breathing room
const PILL_RADIUS = 32;   // pill-shaped capsule
const H_MARGIN    = 12;   // narrower margins — keeps pill wide enough for 6 tabs
const GOLD        = '#C9A84C';

// Icon colors — white on dark glass
const ICON_ACTIVE   = '#FFFFFF';
const ICON_INACTIVE = 'rgba(255,255,255,0.38)';

const CustomTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const { cartCount, wishlistCount } = useApp();
  const badges = { cartCount, wishlistCount };

  // One animated value per visual tab slot (0 = rest, 1 = active)
  const progress = useRef(TABS.map((t, i) => new Animated.Value(t.routeIndex === 0 ? 1 : 0))).current;

  useEffect(() => {
    TABS.forEach((tab, i) => {
      if (tab.routeIndex === null) return; // Search — never animates active
      Animated.spring(progress[i], {
        toValue: state.index === tab.routeIndex ? 1 : 0,
        tension: 200,
        friction: 18,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  // Sit pill just above (or flush with) the home indicator — much lower than before
  const pillBottom = Math.max(insets.bottom, 0) + 4;

  return (
    <View style={[S.floating, { bottom: pillBottom }]}>
      {/* Shadow halo — separate View so shadow is NOT clipped by overflow:hidden */}
      <View style={S.shadow}>
        {Platform.OS === 'ios' ? (
          // Dark frosted glass on iOS
          <BlurView intensity={55} tint="dark" style={S.pill}>
            <PillContent state={state} navigation={navigation} badges={badges} progress={progress} />
          </BlurView>
        ) : (
          // Rich dark semi-transparent on Android
          <View style={[S.pill, S.pillAndroid]}>
            <PillContent state={state} navigation={navigation} badges={badges} progress={progress} />
          </View>
        )}
        {/* Hairline rim — gives glass the appearance of a physical edge */}
        <View pointerEvents="none" style={S.border} />
      </View>
    </View>
  );
};

const PillContent = ({ state, navigation, badges, progress }) => (
  <View style={S.row}>
    {TABS.map((tab, index) => {
      const focused = tab.routeIndex !== null && state.index === tab.routeIndex;
      const badge   = tab.badgeKey ? badges[tab.badgeKey] : 0;
      const anim    = progress[index];

      const bubbleOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
      const bubbleScale   = anim.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] });
      const iconScale     = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
      const labelOpacity  = anim.interpolate({ inputRange: [0, 1], outputRange: [0.38, 1] });

      const onPress = () => {
        if (tab.isStack) {
          // Stack screens bubble up through the navigator tree
          navigation.navigate(tab.name);
          return;
        }
        const event = navigation.emit({
          type: 'tabPress',
          target: state.routes[tab.routeIndex]?.key,
          canPreventDefault: true,
        });
        if (!focused && !event.defaultPrevented) navigation.navigate(tab.name);
      };

      return (
        <TouchableOpacity key={tab.name} style={S.tab} onPress={onPress} activeOpacity={1}>

          {/* Premium glass bubble — scales in with a spring, clips inside the pill */}
          <Animated.View
            style={[
              S.bubble,
              {
                opacity:   bubbleOpacity,
                transform: [{ scale: bubbleScale }],
              },
            ]}
          />

          {/* Icon — springs up slightly when active */}
          <Animated.View style={[S.iconWrap, { transform: [{ scale: iconScale }] }]}>
            <Feather
              name={tab.icon}
              size={ICON_SIZE}
              color={focused ? ICON_ACTIVE : ICON_INACTIVE}
            />
            {badge > 0 && (
              <View style={S.badge}>
                <Text style={S.badgeText}>{badge > 9 ? '9+' : badge}</Text>
              </View>
            )}
          </Animated.View>

          {/* Label */}
          <Animated.Text
            style={[
              S.label,
              {
                opacity:    labelOpacity,
                color:      focused ? ICON_ACTIVE : ICON_INACTIVE,
                fontWeight: focused ? '600' : '400',
                letterSpacing: focused ? 0.4 : 0.2,
              },
            ]}
          >
            {tab.label}
          </Animated.Text>

          {/* Gold micro-accent line — only on active */}
          {focused && <View style={S.dot} />}

        </TouchableOpacity>
      );
    })}
  </View>
);

const S = StyleSheet.create({
  // ── Absolutely-positioned overlay — consumes zero layout space
  floating: {
    position: 'absolute',
    left:  H_MARGIN,
    right: H_MARGIN,
  },

  // ── Outer shadow halo — must NOT have overflow:hidden or shadow is clipped
  shadow: {
    borderRadius:  PILL_RADIUS,
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius:  28,
    elevation:     24,
  },

  // ── Dark glass pill shell
  pill: {
    borderRadius: PILL_RADIUS,
    overflow: 'hidden',   // clips bubble + blur to pill shape
  },
  pillAndroid: {
    backgroundColor: 'rgba(20, 18, 16, 0.86)',
  },

  // ── Hairline bright rim — gives depth to the glass edge
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: PILL_RADIUS,
    borderWidth:  0.5,
    borderColor:  'rgba(255,255,255,0.13)',
  },

  // ── Tab row inside the pill
  row: {
    flexDirection:    'row',
    paddingVertical:  4,    // slimmer than before (was 6)
    paddingHorizontal: 2,
  },

  // ── Individual tab cell
  tab: {
    flex: 1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: 2,   // was 3
    gap: 2,
  },

  // ── Premium glass bubble — white translucent oval, springs in on activation
  // Rendered inside overflow:hidden so no shadow — instead relies on
  // translucent white over dark blur for the depth effect.
  bubble: {
    position:        'absolute',
    top:             3,
    bottom:          3,
    left:            3,
    right:           3,
    borderRadius:    18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth:     0.5,
    borderColor:     'rgba(255,255,255,0.30)',
  },

  iconWrap: { position: 'relative' },

  label: {
    fontSize: LABEL_SIZE,
  },

  // ── Thin gold accent rule — premium finishing touch
  dot: {
    width:           14,
    height:          1.5,
    borderRadius:    1,
    backgroundColor: GOLD,
    marginTop:       1,
  },

  // ── Count badge — gold for brand consistency
  badge: {
    position:         'absolute',
    top:              -4,
    right:            -7,
    backgroundColor:  GOLD,
    borderRadius:     5,
    minWidth:         12,
    height:           12,
    alignItems:       'center',
    justifyContent:   'center',
    paddingHorizontal: 2,
    borderWidth:      1.5,
    borderColor:      'rgba(0,0,0,0.25)',
  },
  badgeText: { color: '#FFFFFF', fontSize: 6.5, fontWeight: '700' },
});

// ─── Tab Navigator ────────────────────────────────────────────────────────────
const TabNavigator = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: 'transparent',
        borderTopWidth:   0,
        elevation:        0,
        shadowOpacity:    0,
        shadowColor:      'transparent',
      },
    }}
  >
    <Tab.Screen name="Home"       component={HomeScreen} />
    <Tab.Screen name="Categories" component={CategoriesScreen} />
    <Tab.Screen name="Cart"       component={CartScreen} />
    <Tab.Screen name="Wishlist"   component={WishlistScreen} />
    <Tab.Screen name="Profile"    component={ProfileScreen} />
  </Tab.Navigator>
);

// ─── Root Stack Navigator ─────────────────────────────────────────────────────
const AppNavigator = () => (
  <RootStack.Navigator
    initialRouteName="Main"
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: Colors.white },
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      transitionSpec: {
        open: { animation: 'timing', config: { duration: 320 } },
        close: { animation: 'timing', config: { duration: 260 } },
      },
    }}
  >
    <RootStack.Screen name="Main"            component={TabNavigator} />
    <RootStack.Screen
      name="ProductDetail"
      component={ProductDetailScreen}
      options={{
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    />
    <RootStack.Screen name="CategoryLanding" component={CategoryLandingScreen} />
    <RootStack.Screen
      name="Search"
      component={SearchScreen}
      options={{
        ...TransitionPresets.ModalSlideFromBottomIOS,
        presentation: 'modal',
        cardStyle: { backgroundColor: Colors.white },
      }}
    />
    <RootStack.Screen name="Notifications"   component={NotificationsScreen} />

    {/* Auth */}
    <RootStack.Screen name="Welcome"         component={WelcomeScreen} />
    <RootStack.Screen name="SignIn"          component={SignInScreen} />
    <RootStack.Screen name="SignUp"          component={SignUpScreen} />
    <RootStack.Screen name="ForgotPassword"  component={ForgotPasswordScreen} />
    <RootStack.Screen name="VerifyCode"      component={VerifyCodeScreen} />

    {/* Checkout */}
    <RootStack.Screen name="Checkout"            component={CheckoutScreen} />
    <RootStack.Screen name="ShippingAddress"     component={ShippingAddressScreen} />
    <RootStack.Screen name="DeliveryMethod"      component={DeliveryMethodScreen} />
    <RootStack.Screen name="PaymentMethod"       component={PaymentMethodScreen} />
    <RootStack.Screen name="OrderReview"         component={OrderReviewScreen} />
    <RootStack.Screen name="OrderConfirmation"   component={OrderConfirmationScreen} />

    {/* Orders */}
    <RootStack.Screen name="MyOrders"        component={MyOrdersScreen} />
    <RootStack.Screen name="OrderDetail"     component={OrderDetailScreen} />

    {/* Account */}
    <RootStack.Screen name="EditProfile"         component={EditProfileScreen} />
    <RootStack.Screen name="SavedAddresses"      component={SavedAddressesScreen} />
    <RootStack.Screen name="AddEditAddress"      component={AddEditAddressScreen} />
    <RootStack.Screen name="SavedPayments"       component={SavedPaymentsScreen} />
    <RootStack.Screen name="AddEditPayment"      component={AddEditPaymentScreen} />
    <RootStack.Screen name="Preferences"         component={PreferencesScreen} />
    <RootStack.Screen name="NotificationPrefs"   component={NotificationPrefsScreen} />
    <RootStack.Screen name="Settings"            component={SettingsScreen} />
    <RootStack.Screen name="Returns"             component={ReturnsScreen} />
    <RootStack.Screen name="StoreCredit"         component={StoreCreditScreen} />
    <RootStack.Screen name="GiftCards"           component={GiftCardsScreen} />
    <RootStack.Screen name="ReferFriend"         component={ReferFriendScreen} />
    <RootStack.Screen name="FavouriteBrands"     component={FavouriteBrandsScreen} />

    {/* Info */}
    <RootStack.Screen name="About"           component={AboutScreen} />
    <RootStack.Screen name="Privacy"         component={PrivacyPolicyScreen} />
    <RootStack.Screen name="Terms"           component={TermsScreen} />
    <RootStack.Screen name="HelpCenter"      component={HelpCenterScreen} />
    <RootStack.Screen name="ContactSupport"  component={ContactSupportScreen} />

    {/* 404 */}
    <RootStack.Screen name="NotFound"        component={NotFoundScreen} />
  </RootStack.Navigator>
);

export default AppNavigator;
