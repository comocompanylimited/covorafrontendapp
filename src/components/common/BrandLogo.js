import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { BRAND_ASSETS } from '../../constants/brandAssets';

const BrandLogo = ({
  variant = 'goldOnBlack', // goldOnBlack | goldOnLight
  width = 160,
  style,
  imageStyle,
}) => {
  const source = variant === 'goldOnLight'
    ? BRAND_ASSETS.logoGoldOnLight
    : BRAND_ASSETS.logoGoldOnBlack;

  return (
    <View style={[styles.wrap, { width }, style]}>
      <Image source={source} style={[styles.image, imageStyle]} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 0.66,
  },
});

export default BrandLogo;
