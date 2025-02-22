import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

const Input: React.FC<TextInputProps> = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#888"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
});

export default Input;
