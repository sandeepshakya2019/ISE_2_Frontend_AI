import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Logo from '../components/Shared/Logo'; // Assuming consistency with OTP screen
import {api} from '../utils/api';
import toastConfig from '../styles/toastConfig';

const LoanRepayScreen = ({navigation}) => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchUserDetailsAndLoans();
  }, []);

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
        navigation.replace('Login');
        return;
      }

      // Fetch user details
      const userResponse = await api.get('/users/login-check', {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (userResponse?.data?.message) {
        setUserName(userResponse.data.message.fullName);
      } else {
        throw new Error('Failed to fetch user details.');
      }

      // Fetch loan details
      const loansResponse = await api.get('/loan/getAll', {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (loansResponse?.data?.message) {
        setLoans(loansResponse.data.message);
      } else {
        throw new Error('Failed to fetch loan details.');
      }
    } catch (error) {
      console.error('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'An error occurred while fetching data.',
      });
      navigation.replace('Login');
    } finally {
      setLoading(false);
    }
  };

  const handleRepayLoan = async () => {
    if (!selectedLoan) {
      Toast.show({
        type: 'error',
        text1: 'No Loan Selected',
        text2: 'Please select a loan to repay.',
      });
      return;
    }
    navigation.navigate('PaymentGateway', {
      loan: selectedLoan,
    });
  };

  const renderLoanItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.loanItem,
        selectedLoan?._id === item._id && styles.selectedLoanItem,
      ]}
      onPress={() => setSelectedLoan(item)}>
      <Text style={styles.loanText}>Loan Amount: ₹ {item.totalLoanAmount}</Text>
      <Text style={styles.loanText}>Status: {item.loanStatus}</Text>
      <Text style={styles.loanText}>Reason: {item.loanReason}</Text>
      <Text style={styles.loanText}>Payback Amount: ₹ {item.paybackAmount}</Text>
    </TouchableOpacity>
  );

  const filteredLoans = loans.filter(loan => loan.paybackAmount > 0);

  return (
    <View style={styles.container}>
      <Toast config={toastConfig} />
      <Logo />
      <Text style={styles.title}>Repay Loan</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" style={styles.loader} />
      ) : filteredLoans.length > 0 ? (
        <FlatList
          data={filteredLoans}
          keyExtractor={item => item._id.toString()}
          renderItem={renderLoanItem}
          extraData={selectedLoan}
        />
      ) : (
        <Text style={styles.noLoansText}>No loans available for repayment.</Text>
      )}

      <TouchableOpacity
        style={[
          styles.repayButton,
          !selectedLoan || loading ? styles.repayButtonDisabled : {},
        ]}
        onPress={handleRepayLoan}
        disabled={!selectedLoan || loading}>
        <Text
          style={[
            styles.repayButtonText,
            !selectedLoan || loading ? styles.repayButtonTextDisabled : {},
          ]}>
          Repay Loan
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 20,
  },
  loanItem: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  selectedLoanItem: {
    borderColor: '#1E90FF',
    backgroundColor: '#E6F7FF',
  },
  loanText: {
    fontSize: 16,
    color: '#333',
  },
  noLoansText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  loader: {
    marginVertical: 20,
  },
  repayButton: {
    width: '100%',
    backgroundColor: '#1E90FF',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  repayButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  repayButtonDisabled: {
    backgroundColor: '#ccc',
  },
  repayButtonTextDisabled: {
    color: '#666',
  },
});

export default LoanRepayScreen;
