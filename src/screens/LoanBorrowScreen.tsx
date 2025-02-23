import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { api } from '../utils/api';

const LoanBorrowScreen = () => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('User');
  
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Fetch User Details
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        showToast('error', 'Authentication Error', 'Please log in to continue.');
        navigation.replace('Login');
        return;
      }

      const response = await api.get('/users/login-check', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data?.message) {
        setUserName(response.data.message.fullName || 'User');
      } else {
        throw new Error('User data not found.');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      showToast('error', 'Error', 'Failed to fetch user details.');
      navigation.replace('Login');
    } finally {
      setLoading(false);
    }
  };

  // Submit Loan Request
  const handleBorrow = async () => {
    if (!amount || !reason) {
      showToast('error', 'Validation Error', 'Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        showToast('error', 'Authentication Error', 'Please log in again.');
        navigation.replace('Login');
        return;
      }

      const response = await api.post(
        '/loan/access',
        { totalLoanAmount: parseFloat(amount), loanReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast('success', 'Success', response?.data?.message || 'Loan request submitted successfully!');
      navigation.navigate('LoanDetails');
    } catch (error) {
      console.error('Loan request error:', error);
      showToast(
        'error',
        'Error',
        error?.response?.data?.message?.userError || 'Failed to submit loan request. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Show Toast Messages
  const showToast = (type, title, message) => {
    Toast.show({ type, text1: title, text2: message });
  };

  return (
    <View style={styles.container}>
      <Toast />
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>

      <TextInput
        placeholder="Amount"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Reason"
        style={styles.input}
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleBorrow}
        disabled={loading}
      >
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default LoanBorrowScreen;
