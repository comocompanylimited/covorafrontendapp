import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, Spacing, TextStyles } from '../../theme';

const SectionTitle = ({
  title,
  subtitle,
  onSeeAll,
  seeAllText = 'See All',
  light = false,
  center = false,
  style,
  accentTitle = false,
}) => {
  return (
    <View style={[styles.container, center && styles.centered, style]}>
      <View style={styles.titleBlock}>
        {accentTitle && <View style={styles.accentLine} />}
        <Text
          style={[
            styles.title,
            light && styles.titleLight,
            center && styles.titleCenter,
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, light && styles.subtitleLight]}>
            {subtitle}
          </Text>
        )}
      </View>

      {onSeeAll && !center && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllBtn} activeOpacity={0.7}>
          <Text style={[styles.seeAllText, light && styles.seeAllTextLight]}>
            {seeAllText}
          </Text>
          <Feather
            name="chevron-right"
            size={14}
            color={light ? Colors.grey400 : Colors.grey600}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPaddingHorizontal,
    marginBottom: Spacing.md,
  },
  centered: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accentLine: {
    width: 2,
    height: 18,
    backgroundColor: Colors.gold,
    marginRight: Spacing.sm,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  titleLight: {
    color: Colors.white,
  },
  titleCenter: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.grey500,
    letterSpacing: 0.5,
    marginTop: 2,
    marginLeft: 2,
  },
  subtitleLight: {
    color: Colors.grey400,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.grey600,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  seeAllTextLight: {
    color: Colors.grey400,
  },
});

export default SectionTitle;
