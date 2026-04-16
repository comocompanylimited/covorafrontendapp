import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useApp } from '../../hooks/useAppContext';

const SettingsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signOut } = useApp();

  const [faceId, setFaceId] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            signOut();
            navigation.navigate('Main');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Account', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const SettingRow = ({ icon, label, value, onPress, isToggle, toggleValue, onToggle, danger }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={isToggle ? undefined : onPress}
      activeOpacity={isToggle ? 1 : 0.7}
    >
      <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
        <Feather name={icon} size={15} color={danger ? Colors.error : Colors.grey500} />
      </View>
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: Colors.grey200, true: Colors.gold }}
          thumbColor={Colors.white}
        />
      ) : (
        <View style={styles.settingRight}>
          {value ? <Text style={styles.settingValue}>{value}</Text> : null}
          <Feather name="chevron-right" size={14} color={Colors.grey300} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.sectionTitle}>SECURITY</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="shield" label="Face ID / Biometrics" isToggle toggleValue={faceId} onToggle={setFaceId} />
          <View style={styles.divider} />
          <SettingRow icon="lock" label="Change Password" onPress={() => navigation.navigate('ForgotPassword')} />
        </View>

        <Text style={styles.sectionTitle}>DISPLAY</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="moon" label="Dark Mode" isToggle toggleValue={darkMode} onToggle={setDarkMode} />
          <View style={styles.divider} />
          <SettingRow icon="globe" label="Language" value="English" onPress={() => navigation.navigate('Preferences')} />
          <View style={styles.divider} />
          <SettingRow icon="dollar-sign" label="Currency" value="GBP" onPress={() => navigation.navigate('Preferences')} />
        </View>

        <Text style={styles.sectionTitle}>LEGAL</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="file-text" label="Terms & Conditions" onPress={() => navigation.navigate('Terms')} />
          <View style={styles.divider} />
          <SettingRow icon="shield" label="Privacy Policy" onPress={() => navigation.navigate('Privacy')} />
          <View style={styles.divider} />
          <SettingRow icon="info" label="About COVORA" onPress={() => navigation.navigate('About')} />
        </View>

        <Text style={styles.sectionTitle}>APP INFO</Text>
        <View style={styles.sectionCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>100</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Made by</Text>
            <Text style={styles.infoValue}>COMODO STUDIOS</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="log-out" label="Sign Out" onPress={handleSignOut} />
          <View style={styles.divider} />
          <SettingRow icon="trash-2" label="Delete Account" onPress={handleDeleteAccount} danger />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    height: 56, paddingHorizontal: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 0.5, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Georgia', fontSize: 16, letterSpacing: 3, color: Colors.black },
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 10, marginTop: 20,
  },
  sectionCard: {
    backgroundColor: Colors.white, borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
  },
  settingIcon: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: Colors.grey100,
    alignItems: 'center', justifyContent: 'center',
  },
  settingIconDanger: { backgroundColor: 'rgba(198,40,40,0.08)' },
  settingLabel: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  settingLabelDanger: { color: Colors.error },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontSize: 12, color: Colors.grey400 },
  divider: { height: 0.5, backgroundColor: Colors.grey100, marginLeft: 58 },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14,
  },
  infoLabel: { fontSize: 13, color: Colors.grey500 },
  infoValue: { fontSize: 12, color: Colors.grey400, fontWeight: '500' },
});

export default SettingsScreen;
