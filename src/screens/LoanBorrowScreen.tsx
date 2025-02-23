import React, {useState, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {api} from '../utils/api';

const LoanBorrowScreen = () => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(''); // Add state for user name
  const navigation = useNavigation();

  const handleBorrow = async () => {
    if (!amount || !reason) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all fields.',
      });
      return;
    }

    try {
      setLoading(true);

      // Get the authentication token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Token not found. Please log in again.',
        });
        navigation.replace('Login'); // Redirect to login if no token
        return;
      }

      // Prepare the request payload
      const payload = {
        totalLoanAmount: parseFloat(amount), // Convert the amount to a number
        loanReason: reason,
      };

      // Send the API request
      const response = await api.post('/loan/access', payload, {
        headers: {Authorization: `Bearer ${token}`},
      });

      // Handle success response
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2:
          response?.data?.message || 'Loan request submitted successfully!',
      });

      // Navigate back to the Loan Details page
      navigation.navigate('LoanDetails');
    } catch (error) {
      console.error(
        'Error submitting loan request:',
        error?.response?.data?.message || error.message,
      );
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          error?.response?.data?.message?.userError ||
          'Failed to submit loan request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserDetailsAndLoans = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Toast.show({
            type: 'error',
            text1: 'Authentication Error',
            text2: 'Please log in to continue.',
          });
          navigation.replace('Login'); // Redirect to login if token is missing
          return;
        }

        const userResponse = await api.get('/users/login-check', {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (userResponse?.data?.message) {
          setUserName(userResponse?.data?.message?.fullName || 'User');
        } else {
          throw new Error('Failed to fetch user details.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch user details. Please try again.',
        });
        navigation.replace('Login'); // Redirect to login if there is any error
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetailsAndLoans();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Toast />
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      {/* <Text style={styles.title}>Borrow Loan</Text> */}
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
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ddd',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 25,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#222',
    fontSize: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    color: '#fff',
  },
  button: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
});

export default LoanBorrowScreen;
