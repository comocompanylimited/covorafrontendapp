import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';

const ReferFriendScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const referralCode = 'COVORA-REF';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Shop luxury women's fashion on COVORA and use my code ${referralCode} to get $20 off your first order!`,
        title: 'COVORA Referral',
      });
    } catch (_) {}
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Feather name="chevron-left" size={22} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refer a Friend</Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.heroCard}>
          <Feather name="users" size={36} color={Colors.gold} style={{ marginBottom: 16 }} />
          <Text style={styles.heroTitle}>Give $20, Get $20</Text>
          <Text style={styles.heroSub}>
            Share COVORA with a friend. They get $20 off their first order, and you earn $20 store credit when they shop.
          </Text>
        </View>

        {/* Referral Code */}
        <Text style={styles.sectionTitle}>YOUR REFERRAL CODE</Text>
        <View style={styles.codeCard}>
          <Text style={styles.code}>{referralCode}</Text>
          <TouchableOpacity onPress={handleShare} style={styles.copyBtn} activeOpacity={0.8}>
            <Feather name="copy" size={14} color={Colors.black} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
          <Feather name="share-2" size={14} color={Colors.white} />
          <Text style={styles.shareBtnText}>SHARE WITH FRIENDS</Text>
        </TouchableOpacity>

        {/* Steps */}
        <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
        <View style={styles.stepsCard}>
          {[
            { n: '1', text: 'Share your unique referral code or link.' },
            { n: '2', text: 'Your friend signs up and makes their first purchase.' },
            { n: '3', text: 'You both receive $20 store credit — automatically.' },
          ].map((step, i, arr) => (
            <View key={i} style={[styles.step, i < arr.length - 1 && styles.stepBorder]}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{step.n}</Text></View>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.white },
  header: { backgroundColor: Colors.white, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  headerInner: { height: 52, paddingHorizontal: Spacing.screenPaddingHorizontal, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Georgia', fontSize: 16, fontWeight: '400', color: Colors.black },
  content: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 48 },
  heroCard: {
    backgroundColor: Colors.black,
    padding: 32,
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.28)',
  },
  heroTitle: { color: Colors.white, fontFamily: 'Georgia', fontSize: 26, fontWeight: '400', marginBottom: 10, textAlign: 'center' },
  heroSub: { color: 'rgba(255,255,255,0.55)', fontSize: 12, textAlign: 'center', lineHeight: 19, letterSpacing: 0.2 },
  sectionTitle: { fontSize: 9, fontWeight: '600', color: Colors.grey400, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 12 },
  codeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
  },
  code: { fontFamily: 'Georgia', fontSize: 20, color: Colors.black, letterSpacing: 3 },
  copyBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  shareBtn: {
    backgroundColor: Colors.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    marginBottom: 28,
    borderRadius: 12,
  },
  shareBtnText: { color: Colors.white, fontSize: 10, letterSpacing: 2.5, fontWeight: '500' },
  stepsCard: {
    borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  step: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 },
  stepBorder: { borderBottomWidth: 0.5, borderBottomColor: Colors.grey100 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: Colors.black, fontSize: 11, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 13, color: Colors.black, lineHeight: 18 },
});

export default ReferFriendScreen;
