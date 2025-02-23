import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Logo from '../components/Shared/Logo';
import { apiCallWithoutHeader } from '../utils/api';
import toastConfig from '../styles/toastConfig';

interface FormData {
  name: string;
  mobileNumber: string;
  email: string;
  isTermsAccepted: boolean;
}

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    mobileNumber: '',
    email: '',
    isTermsAccepted: false,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
  };

  const validateForm = (): string | null => {
    const { name, mobileNumber, email, isTermsAccepted } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!name.trim()) return 'Full Name is required';
    if (!mobileRegex.test(mobileNumber)) return 'Enter a valid 10-digit Mobile Number';
    if (email && !emailRegex.test(email)) return 'Enter a valid Email Address';
    if (!isTermsAccepted) return 'You must accept the Terms and Conditions';

    return null;
  };

  const apiRequest = async (endpoint: string, payload: object) => {
    try {
      const [success, response] = await apiCallWithoutHeader(endpoint, 'POST', payload);
      if (!success) throw new Error(response.message || 'Something went wrong');
      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const getOTP = async () => {
    setLoading(true);
    try {
      await apiRequest('/users/login-otp', { mobileNo: formData.mobileNumber });
      Toast.show({ type: 'success', text1: 'OTP Sent', text2: 'Check SMS for OTP' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'OTP Error', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async () => {
    setLoading(true);
    try {
      await apiRequest('/users/register', {
        mobileNo: formData.mobileNumber,
        fullName: formData.name,
        emailId: formData.email,
      });
      await getOTP();
      navigation.replace('OTP', { fromLogin: false, mobileNo: formData.mobileNumber });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetOTP = () => {
    const validationError = validateForm();
    if (validationError) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: validationError });
      return;
    }
    registerUser();
  };

  return (
    <View style={styles.container}>
      <Toast config={toastConfig} />
      <Logo />
      <Text style={styles.logo}>Register</Text>

      <InputField 
        placeholder="Enter Full Name" 
        value={formData.name} 
        onChangeText={text => handleInputChange('name', text)} 
      />
      <InputField 
        placeholder="Enter Mobile Number"
        keyboardType="numeric"
        value={formData.mobileNumber}
        onChangeText={text => handleInputChange('mobileNumber', text.replace(/[^0-9]/g, '').slice(0, 10))}
      />
      <InputField 
        placeholder="Email ID" 
        keyboardType="email-address" 
        value={formData.email} 
        onChangeText={text => handleInputChange('email', text)} 
      />
      
      <CheckboxField 
        label="Accept Terms and Conditions" 
        checked={formData.isTermsAccepted} 
        onPress={() => handleInputChange('isTermsAccepted', !formData.isTermsAccepted)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleGetOTP}>
          <Text style={styles.buttonText}>Get OTP</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
        <Text style={styles.linkText}>Already registered? Login here</Text>
      </TouchableOpacity>
    </View>
  );
};

const InputField: React.FC<{ 
  placeholder: string; 
  value: string; 
  keyboardType?: 'default' | 'numeric' | 'email-address'; 
  onChangeText: (text: string) => void; 
}> = ({ placeholder, value, keyboardType = 'default', onChangeText }) => (
  <TextInput 
    placeholder={placeholder}
    style={styles.input}
    keyboardType={keyboardType}
    value={value}
    onChangeText={onChangeText}
    placeholderTextColor="#888"
  />
);

const CheckboxField: React.FC<{ label: string; checked: boolean; onPress: () => void }> = ({ label, checked, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
    <Text style={styles.checkbox}>{checked ? '☑' : '☐'} {label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  checkbox: {
    fontSize: 16,
    color: '#444',
  },
  button: {
    width: '100%',
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#1E90FF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
