import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, TextStyles, Spacing, BorderRadius } from '../../theme';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  error,
  hint,
  icon,
  iconPosition = 'left',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  inputStyle,
  onFocus,
  onBlur,
  returnKeyType,
  onSubmitEditing,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setFocused(true);
    onFocus && onFocus();
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur && onBlur();
  };

  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          focused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>
            {icon}
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            icon && iconPosition === 'left' && styles.inputWithLeftIcon,
            (icon && iconPosition === 'right' || isPassword) && styles.inputWithRightIcon,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors.grey400}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          selectionColor={Colors.gold}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={18}
              color={focused ? Colors.gold : Colors.grey500}
            />
          </TouchableOpacity>
        )}

        {icon && iconPosition === 'right' && !isPassword && (
          <View style={styles.iconRight}>
            {icon}
          </View>
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {hint && !error && (
        <Text style={styles.hintText}>{hint}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...TextStyles.label,
    color: Colors.grey700,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grey200,
    borderRadius: 10,
    backgroundColor: Colors.white,
    minHeight: 52,
  },
  inputContainerFocused: {
    borderColor: Colors.gold,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  inputContainerDisabled: {
    backgroundColor: Colors.grey100,
    borderColor: Colors.grey200,
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: Spacing.xs,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  iconLeft: {
    paddingLeft: Spacing.md,
  },
  iconRight: {
    paddingRight: Spacing.md,
  },
  errorText: {
    ...TextStyles.caption,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: 2,
  },
  hintText: {
    ...TextStyles.caption,
    color: Colors.grey500,
    marginTop: Spacing.xs,
    marginLeft: 2,
  },
});

export default Input;
