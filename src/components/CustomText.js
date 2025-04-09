import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {colors} from '../theme/theme';

const FONTS = {
  poppins: 'Poppins',
  poppinsMedium: 'Poppins-Medium',
};

const CustomText = ({
  size = 16,
  font = 'poppins',
  color = 'text',
  style,
  ...props
}) => {
  const fontFamily = FONTS[font];

  return (
    <Text
      {...props}
      style={[
        styles.text,
        {fontFamily, fontSize: size, color: colors[color]},
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16, // Default size, overridden by prop
  },
});

export default CustomText;
