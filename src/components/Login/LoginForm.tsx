import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Input from '../shared/Input';
import Button from '../shared/Button';

interface LoginFormProps {
  onSubmit: (mobile: string, email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (mobile && email) {
      onSubmit(mobile, email);
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login / Register</Text>
      <Input
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      <Input
        placeholder="Email ID"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button text="Get OTP" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default LoginForm;
function alert(arg0: string) {
  throw new Error('Function not implemented.');
}

