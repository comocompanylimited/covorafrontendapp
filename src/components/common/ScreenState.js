import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../theme';
import BrandLogo from './BrandLogo';

const ScreenState = ({
  type = 'empty', // empty | error | success
  title,
  message,
  icon = 'circle',
  ctaLabel,
  onCtaPress,
  compactLogo = false,
}) => (
  <View style={styles.container}>
    <BrandLogo
      variant={type === 'empty' ? 'goldOnLight' : 'goldOnBlack'}
      width={compactLogo ? 74 : 100}
      style={styles.logo}
      imageStyle={type === 'empty' ? {} : styles.logoDark}
    />
    <View style={[styles.iconWrap, type === 'error' && styles.iconWrapError, type === 'success' && styles.iconWrapSuccess]}>
      <Feather name={icon} size={22} color={type === 'error' ? Colors.error : type === 'success' ? Colors.success : Colors.gold} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {ctaLabel && onCtaPress ? (
      <TouchableOpacity style={styles.btn} onPress={onCtaPress} activeOpacity={0.85}>
        <Text style={styles.btnText}>{ctaLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  logo: {
    marginBottom: 10,
  },
  logoDark: {
    borderRadius: 8,
  },
  iconWrap: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
    backgroundColor: 'rgba(201,168,76,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  iconWrapError: {
    borderColor: 'rgba(198,40,40,0.25)',
    backgroundColor: 'rgba(198,40,40,0.06)',
  },
  iconWrapSuccess: {
    borderColor: 'rgba(46,125,50,0.25)',
    backgroundColor: 'rgba(46,125,50,0.06)',
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: Colors.grey500,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  btnText: {
    color: Colors.white,
    fontSize: 11,
    letterSpacing: 2.2,
    fontWeight: '600',
  },
});

export default ScreenState;
