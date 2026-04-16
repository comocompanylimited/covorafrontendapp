import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../theme';

const NotFoundScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.subtitle}>
          The page you're looking for doesn't exist or has been moved.
        </Text>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.85}
        >
          <Text style={styles.homeBtnText}>GO TO HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => navigation.navigate('Main', { screen: 'Categories' })}
          activeOpacity={0.85}
        >
          <Text style={styles.shopBtnText}>BROWSE PRODUCTS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    height: 56,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 44,
  },
  code: {
    fontFamily: 'Georgia',
    fontSize: 80,
    fontWeight: '400',
    color: Colors.grey200,
    letterSpacing: 4,
    lineHeight: 88,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '400',
    color: Colors.black,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.grey500,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.2,
    marginBottom: 40,
  },
  homeBtn: {
    backgroundColor: Colors.black,
    paddingHorizontal: 40,
    paddingVertical: 14,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  homeBtnText: {
    color: Colors.white,
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: '600',
  },
  shopBtn: {
    borderWidth: 1,
    borderColor: Colors.grey200,
    paddingHorizontal: 40,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  shopBtnText: {
    color: Colors.black,
    fontSize: 10,
    letterSpacing: 2.5,
    fontWeight: '500',
  },
});

export default NotFoundScreen;
