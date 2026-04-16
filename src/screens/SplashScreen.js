import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Colors } from '../theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const TOTAL_SPLASH_MS = 4200;

  const hasFinishedRef = useRef(false);

  // COMODO STUDIOS
  const studioOpacity = useRef(new Animated.Value(0)).current;

  // COVORA wordmark
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const wordmarkScale = useRef(new Animated.Value(1.04)).current;

  // Gold line
  const lineWidth = useRef(new Animated.Value(0)).current;
  const lineOpacity = useRef(new Animated.Value(0)).current;

  // Tagline
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(8)).current;

  // Exit
  const containerOpacity = useRef(new Animated.Value(1)).current;

  const finishSplash = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    StatusBar.setHidden(false);
    onFinish && onFinish();
  }, [onFinish]);

  useEffect(() => {
    StatusBar.setHidden(true);

    const sequence = Animated.sequence([
      // Phase 1: Studio credit appears softly
      Animated.timing(studioOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.delay(600),
      Animated.timing(studioOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.delay(200),

      // Phase 2: COVORA wordmark + gold line appear
      Animated.parallel([
        Animated.timing(wordmarkOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(wordmarkScale, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),

      Animated.delay(200),

      // Phase 3: Gold accent line draws in
      Animated.parallel([
        Animated.timing(lineOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(lineWidth, { toValue: 44, duration: 500, useNativeDriver: false }),
      ]),

      Animated.delay(150),

      // Phase 4: Tagline rises in
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(taglineY, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]),

      // Hold
      Animated.delay(1000),

      // Phase 5: Fade out
      Animated.timing(containerOpacity, { toValue: 0, duration: 480, useNativeDriver: true }),
    ]);

    const fallback = setTimeout(finishSplash, TOTAL_SPLASH_MS + 600);

    sequence.start(({ finished }) => {
      if (finished) finishSplash();
    });

    return () => {
      clearTimeout(fallback);
      sequence.stop();
      StatusBar.setHidden(false);
    };
  }, [finishSplash]);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <StatusBar hidden />

      {/* COMODO STUDIOS */}
      <Animated.View style={[styles.studioWrap, { opacity: studioOpacity }]}>
        <Text style={styles.studioName}>COMODO STUDIOS</Text>
      </Animated.View>

      {/* COVORA */}
      <Animated.View
        style={[
          styles.brandWrap,
          {
            opacity: wordmarkOpacity,
            transform: [{ scale: wordmarkScale }],
          },
        ]}
      >
        <Text style={styles.wordmark}>COVORA</Text>

        <Animated.View style={{ opacity: lineOpacity }}>
          <Animated.View style={[styles.goldLine, { width: lineWidth }]} />
        </Animated.View>

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineY }],
            },
          ]}
        >
          LUXURY WOMEN'S FASHION & BEAUTY
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pureBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Studio
  studioWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  studioName: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    letterSpacing: 7,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: 'Georgia',
  },

  // Brand
  brandWrap: {
    alignItems: 'center',
  },
  wordmark: {
    color: Colors.white,
    fontSize: 44,
    letterSpacing: 14,
    fontWeight: '300',
    fontFamily: 'Georgia',
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  goldLine: {
    height: 1,
    backgroundColor: Colors.gold,
    marginBottom: 18,
  },
  tagline: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 8,
    letterSpacing: 3.5,
    fontWeight: '400',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

export default SplashScreen;
