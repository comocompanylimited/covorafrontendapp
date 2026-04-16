import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, TextStyles, Spacing, Shadow } from '../../theme';

const Header = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  rightIcon,
  onRightPress,
  rightActions = [], // array of { icon, onPress, badge }
  transparent = false,
  light = false, // light icons (for dark backgrounds)
  showLogo = false,
  style,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const iconColor = light ? Colors.white : Colors.black;
  const titleColor = light ? Colors.white : Colors.textPrimary;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
        transparent && styles.transparent,
        !transparent && Shadow.sm,
        style,
      ]}
    >
      <View style={styles.inner}>
        {/* Left */}
        <View style={styles.left}>
          {showBack ? (
            <TouchableOpacity onPress={handleBack} style={styles.iconBtn} activeOpacity={0.7}>
              <Feather name="chevron-left" size={24} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconBtnPlaceholder} />
          )}
        </View>

        {/* Center */}
        <View style={styles.center}>
          {showLogo ? (
            <Text style={[styles.logoText, light && styles.logoTextLight]}>
              COVORA
            </Text>
          ) : title ? (
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
                {title}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, light && { color: Colors.grey400 }]} numberOfLines={1}>
                  {subtitle}
                </Text>
              )}
            </View>
          ) : null}
        </View>

        {/* Right */}
        <View style={styles.right}>
          {rightActions.length > 0 ? (
            rightActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                style={styles.iconBtn}
                activeOpacity={0.7}
              >
                <Feather name={action.icon} size={22} color={iconColor} />
                {action.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {action.badge > 99 ? '99+' : action.badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : rightIcon ? (
            <TouchableOpacity onPress={onRightPress} style={styles.iconBtn} activeOpacity={0.7}>
              <Feather name={rightIcon} size={22} color={iconColor} />
            </TouchableOpacity>
          ) : rightAction ? (
            rightAction
          ) : (
            <View style={styles.iconBtnPlaceholder} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    zIndex: 100,
  },
  transparent: {
    backgroundColor: Colors.transparent,
    borderBottomWidth: 0,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: Spacing.md,
  },
  left: {
    width: 80,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 80,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPlaceholder: {
    width: 40,
    height: 40,
  },
  logoText: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: 6,
    color: Colors.black,
    textTransform: 'uppercase',
  },
  logoTextLight: {
    color: Colors.white,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 1,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.grey500,
    letterSpacing: 0.5,
    marginTop: 1,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.gold,
    borderRadius: 9999,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.black,
    fontSize: 9,
    fontWeight: '700',
  },
});

export default Header;
