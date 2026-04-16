import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { submitSupportRequest } from '../../services/supportService';

const TOPICS = ['Order Issue', 'Returns & Refunds', 'Payment', 'Delivery', 'Product Question', 'Account', 'Other'];

const ContactSupportScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!topic) e.topic = 'Please select a topic';
    if (!message.trim() || message.trim().length < 20) e.message = 'Please describe your issue (min 20 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await submitSupportRequest({ email, topic, message });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CONTACT US</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.successState}>
          <View style={styles.successIcon}>
            <Feather name="check-circle" size={36} color={Colors.gold} />
          </View>
          <Text style={styles.successTitle}>Message Sent</Text>
          <Text style={styles.successText}>
            Thank you for reaching out. Our support team will respond to {email} within 24 hours.
          </Text>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>BACK TO APP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Feather name="chevron-left" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CONTACT US</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Contact Channels */}
          <View style={styles.channelsRow}>
            <View style={styles.channelCard}>
              <Feather name="clock" size={16} color={Colors.gold} />
              <Text style={styles.channelLabel}>Response</Text>
              <Text style={styles.channelValue}>{'< 24 hours'}</Text>
            </View>
            <View style={styles.channelCard}>
              <Feather name="message-circle" size={16} color={Colors.gold} />
              <Text style={styles.channelLabel}>Live Chat</Text>
              <Text style={styles.channelValue}>24/7</Text>
            </View>
            <View style={styles.channelCard}>
              <Feather name="phone" size={16} color={Colors.gold} />
              <Text style={styles.channelLabel}>Phone</Text>
              <Text style={styles.channelValue}>Mon–Fri</Text>
            </View>
          </View>

          {/* Form */}
          <Text style={styles.sectionTitle}>SEND A MESSAGE</Text>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <TextInput
              style={[styles.fieldInput, errors.email && styles.fieldInputError]}
              placeholder="your@email.com"
              placeholderTextColor={Colors.grey400}
              value={email}
              onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: '' })); }}
              keyboardType="email-address"
              autoCapitalize="none"
              selectionColor={Colors.gold}
            />
            {errors.email ? <Text style={styles.fieldError}>{errors.email}</Text> : null}
          </View>

          <Text style={styles.fieldLabel}>Topic</Text>
          {errors.topic ? <Text style={styles.fieldError}>{errors.topic}</Text> : null}
          <View style={styles.topicsWrap}>
            {TOPICS.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.topicChip, topic === t && styles.topicChipActive]}
                onPress={() => { setTopic(t); setErrors(e => ({ ...e, topic: '' })); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.topicText, topic === t && styles.topicTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.fieldWrap, { marginTop: 16 }]}>
            <Text style={styles.fieldLabel}>Message</Text>
            <TextInput
              style={[styles.messageInput, errors.message && styles.fieldInputError]}
              placeholder="Describe your issue or question in detail..."
              placeholderTextColor={Colors.grey400}
              value={message}
              onChangeText={v => { setMessage(v); setErrors(e => ({ ...e, message: '' })); }}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              selectionColor={Colors.gold}
            />
            <Text style={styles.charCount}>{message.length} / 500</Text>
            {errors.message ? <Text style={styles.fieldError}>{errors.message}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.sendBtn, loading && styles.sendBtnLoading]}
            onPress={handleSend}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <>
                  <Text style={styles.sendBtnText}>SEND MESSAGE</Text>
                  <Feather name="send" size={14} color={Colors.white} />
                </>
            }
          </TouchableOpacity>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    height: 56, paddingHorizontal: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 0.5, borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Georgia', fontSize: 16, letterSpacing: 3, color: Colors.black },
  scroll: { padding: Spacing.screenPaddingHorizontal, paddingBottom: 60 },
  channelsRow: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 4 },
  channelCard: {
    flex: 1, alignItems: 'center', paddingVertical: 16, gap: 4,
    borderRadius: 10, backgroundColor: Colors.offWhite,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  channelLabel: { fontSize: 10, color: Colors.grey400, letterSpacing: 0.5 },
  channelValue: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary },
  sectionTitle: {
    fontSize: 9, fontWeight: '600', color: Colors.grey400,
    letterSpacing: 2.5, marginBottom: 12, marginTop: 20,
  },
  fieldWrap: { marginBottom: 4 },
  fieldLabel: { fontSize: 10, fontWeight: '600', color: Colors.grey500, letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' },
  fieldInput: {
    height: 48, borderWidth: 1, borderColor: Colors.grey200,
    borderRadius: 8, paddingHorizontal: Spacing.md, fontSize: 13, color: Colors.textPrimary, marginBottom: 14,
  },
  fieldInputError: { borderColor: Colors.error },
  fieldError: { fontSize: 11, color: Colors.error, marginTop: 2, marginBottom: 6 },
  topicsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  topicChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.grey200, borderRadius: 20,
  },
  topicChipActive: { borderColor: Colors.black, backgroundColor: Colors.black },
  topicText: { fontSize: 12, fontWeight: '500', color: Colors.grey600 },
  topicTextActive: { color: Colors.white },
  messageInput: {
    borderWidth: 1, borderColor: Colors.grey200,
    borderRadius: 8, padding: Spacing.md, fontSize: 13, color: Colors.textPrimary,
    height: 140,
  },
  charCount: { fontSize: 10, color: Colors.grey300, textAlign: 'right', marginTop: 4 },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.black, height: 58, marginTop: 16, borderRadius: 12,
  },
  sendBtnLoading: { backgroundColor: Colors.grey700 },
  sendBtnText: { color: Colors.white, fontSize: 12, letterSpacing: 2.5, fontWeight: '600' },
  successState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  successTitle: { fontFamily: 'Georgia', fontSize: 28, color: Colors.textPrimary, marginBottom: 12 },
  successText: { fontSize: 14, color: Colors.grey500, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  doneBtn: {
    backgroundColor: Colors.black, height: 54,
    paddingHorizontal: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12,
  },
  doneBtnText: { color: Colors.white, fontSize: 12, letterSpacing: 2.5, fontWeight: '600' },
});

export default ContactSupportScreen;

