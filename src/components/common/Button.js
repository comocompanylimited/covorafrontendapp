import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
} from 'react-native';
import { Colors, TextStyles, Spacing, BorderRadius } from '../../theme';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary | secondary | outline | ghost | gold
  size = 'md',         // sm | md | lg
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = true,
}) => {
  const pressScale = useRef(new Animated.Value(1)).current;
  const pressOpacity = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.timing(pressScale, { toValue: 0.982, duration: 120, useNativeDriver: true }),
      Animated.timing(pressOpacity, { toValue: 0.92, duration: 120, useNativeDriver: true }),
    ]).start();
  };
  const onPressOut = () => {
    Animated.parallel([
      Animated.timing(pressScale, { toValue: 1, duration: 170, useNativeDriver: true }),
      Animated.timing(pressOpacity, { toValue: 1, duration: 170, useNativeDriver: true }),
    ]).start();
  };

  const getContainerStyle = () => {
    const base = [styles.base, styles[`size_${size}`]];
    if (fullWidth) base.push(styles.fullWidth);
    if (disabled || loading) base.push(styles.disabled);

    switch (variant) {
      case 'primary':
        base.push(styles.primaryContainer, styles.shadowMd);
        break;
      case 'secondary':
        base.push(styles.secondaryContainer, styles.shadowMd);
        break;
      case 'outline':
        base.push(styles.outlineContainer);
        break;
      case 'ghost':
        base.push(styles.ghostContainer);
        break;
      case 'gold':
        base.push(styles.goldContainer, styles.shadowGold);
        break;
      case 'white':
        base.push(styles.whiteContainer);
        break;
      default:
        base.push(styles.primaryContainer);
    }

    return base;
  };

  const getTextStyle = () => {
    const base = [styles.text, styles[`textSize_${size}`]];

    switch (variant) {
      case 'primary':
        base.push(styles.primaryText);
        break;
      case 'secondary':
        base.push(styles.secondaryText);
        break;
      case 'outline':
        base.push(styles.outlineText);
        break;
      case 'ghost':
        base.push(styles.ghostText);
        break;
      case 'gold':
        base.push(styles.goldText);
        break;
      case 'white':
        base.push(styles.whiteText);
        break;
      default:
        base.push(styles.primaryText);
    }

    return base;
  };

  const getLoaderColor = () => {
    switch (variant) {
      case 'primary': return Colors.white;
      case 'secondary': return Colors.white;
      case 'outline': return Colors.black;
      case 'ghost': return Colors.black;
      case 'gold': return Colors.black;
      case 'white': return Colors.black;
      default: return Colors.white;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }], opacity: pressOpacity }}>
      <TouchableOpacity
        style={[getContainerStyle(), style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.96}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
      {loading ? (
        <ActivityIndicator color={getLoaderColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.none,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },

  // Sizes
  size_sm: {
    height: 42,
    paddingHorizontal: Spacing.md,
  },
  size_md: {
    height: 54,
    paddingHorizontal: Spacing.xl,
  },
  size_lg: {
    height: 62,
    paddingHorizontal: Spacing['2xl'],
  },

  // Variants
  primaryContainer: {
    backgroundColor: Colors.black,
  },
  secondaryContainer: {
    backgroundColor: Colors.grey800,
  },
  outlineContainer: {
    backgroundColor: Colors.transparent,
    borderWidth: 1,
    borderColor: Colors.grey300,
  },
  ghostContainer: {
    backgroundColor: Colors.transparent,
  },
  goldContainer: {
    backgroundColor: Colors.gold,
  },
  whiteContainer: {
    backgroundColor: Colors.white,
  },

  // Text sizes
  text: {
    ...TextStyles.button,
  },
  textSize_sm: {
    fontSize: 10,
    letterSpacing: 1.8,
  },
  textSize_md: {
    fontSize: 12,
    letterSpacing: 2.3,
  },
  textSize_lg: {
    fontSize: 13,
    letterSpacing: 2.8,
  },

  // Text colors
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.black,
  },
  ghostText: {
    color: Colors.black,
  },
  goldText: {
    color: Colors.black,
  },
  whiteText: {
    color: Colors.black,
  },

  // Content layout
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  shadowGold: {
    shadowColor: '#C9A84C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
});

export default Button;
