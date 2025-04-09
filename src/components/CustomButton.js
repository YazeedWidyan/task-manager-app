import React, {useRef} from 'react';
import {Pressable, Text, StyleSheet, Animated} from 'react-native';
import {colors} from '../theme/theme';

const CustomButton = ({
  title,
  onPress,
  variant = 'primaryOne',
  color,
  style,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    onPress && onPress();
  };

  const variantStyles = {
    primaryOne: {
      backgroundColor: colors.primary,
      textColor: '#FFFFFF',
    },
    secondaryOne: {
      backgroundColor: colors.secondary,
      textColor: '#FFFFFF',
    },
  };

  const {backgroundColor, textColor} =
    variantStyles[variant] || variantStyles.primaryOne;

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}>
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: color || backgroundColor,
            opacity: disabled ? 0.5 : 1,
            transform: [{scale: scaleAnim}],
          },
          style,
        ]}>
        <Text style={[styles.buttonText, {color: textColor}]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Poppins',
  },
});

export default CustomButton;
