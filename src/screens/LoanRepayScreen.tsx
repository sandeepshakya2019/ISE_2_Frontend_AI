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
import {api} from '../utils/api';
import toastConfig from '../styles/toastConfig';

const LoanRepayScreen = ({navigation}) => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(true);
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

      const userResponse = await api.get('/users/login-check', {
        headers: {Authorization: `Bearer ${token}`},
      });

      if (userResponse?.data?.message) {
        setUserName(userResponse.data.message.fullName);
      } else {
        throw new Error('Failed to fetch user details.');
      }

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
      <Text style={styles.loanText}>Payback Amount: {item.paybackAmount}</Text>
    </TouchableOpacity>
  );

  const filteredLoans = loans.filter(loan => loan.paybackAmount > 0);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#28a745" />
        </View>
      )}
      <Toast config={toastConfig} />
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      {filteredLoans.length > 0 ? (
        <FlatList
          data={filteredLoans}
          keyExtractor={item => item._id.toString()}
          renderItem={renderLoanItem}
          extraData={selectedLoan}
        />
      ) : (
        <Text style={styles.noLoansText}>
          No loans available for repayment.
        </Text>
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

// const styles = StyleSheet.create({
//   /* same styles as provided */
// });

// export default LoanRepayScreen;

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ddd',
  },
  container: {
    flex: 1,
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
    placeholderTextColor: '#fff',
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
  loanItem: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 10,
    backgroundColor: '#1e1e1e',
  },
  selectedLoanItem: {
    borderColor: '#4caf50',
    backgroundColor: '#2e7d32',
  },
  loanText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLoansText: {
    fontSize: 18,
    color: '#bbb',
    textAlign: 'center',
    marginVertical: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  repayButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  repayButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  repayButtonDisabled: {
    backgroundColor: '#555',
  },
  repayButtonTextDisabled: {
    color: '#888',
  },
  loanItemButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loanItemButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loanItemButtonPressed: {
    backgroundColor: '#1b5e20',
  },
});

export default LoanRepayScreen;
