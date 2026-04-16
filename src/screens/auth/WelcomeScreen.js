import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Dimensions, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Shadow } from '../../theme';
import { BrandLogo } from '../../components/common';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80' }}
        style={styles.bg}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      {/* Logo */}
      <View style={[styles.logoArea, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.logoLabel}>PRESENTED BY COMODO STUDIOS</Text>
        <BrandLogo variant="goldOnBlack" width={130} imageStyle={styles.logoImage} />
        <Text style={styles.logo}>COVORA</Text>
        <View style={styles.logoLine} />
        <Text style={styles.logoTagline}>LUXURY WOMEN'S FASHION & BEAUTY</Text>
      </View>

      {/* Bottom CTA */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          style={styles.signInBtn}
          onPress={() => navigation.navigate('SignIn')}
          activeOpacity={0.88}
        >
          <Text style={styles.signInText}>SIGN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate('SignUp')}
          activeOpacity={0.88}
        >
          <Text style={styles.createText}>CREATE AN ACCOUNT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.75}
          style={styles.guestBtn}
        >
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  bg: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  logoArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screenPaddingHorizontal,
  },
  logoLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  logo: {
    color: Colors.white,
    fontFamily: 'Georgia',
    fontSize: 42,
    letterSpacing: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  logoImage: {
    opacity: 0.92,
    marginBottom: -6,
  },
  logoLine: {
    width: 48,
    height: 1,
    backgroundColor: Colors.gold,
    marginBottom: 16,
  },
  logoTagline: {
    color: Colors.grey500,
    fontSize: 9,
    letterSpacing: 3.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    gap: 12,
  },
  signInBtn: {
    backgroundColor: Colors.white,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    ...Shadow.gold,
  },
  signInText: {
    color: Colors.black,
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '600',
  },
  createBtn: {
    backgroundColor: Colors.gold,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  createText: {
    color: Colors.black,
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '600',
  },
  guestBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    letterSpacing: 0.5,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
