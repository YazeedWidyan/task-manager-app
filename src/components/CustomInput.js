import React from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import {colors} from '../theme/theme';
import CustomText from './CustomText';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  style,
  ...props
}) => {
  return (
    <View>
      {label && (
        <CustomText size={16} color="text" style={styles.label}>
          {label}
        </CustomText>
      )}
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error && (
        <CustomText size={14} color="error" style={styles.error}>
          {error}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    borderColor: colors.borderColor,
    color: colors.text,
    fontSize: 16,
    backgroundColor: colors.inputBackground,
  },
  label: {
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomInput;
