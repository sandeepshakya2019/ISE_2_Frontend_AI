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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  loanItem: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedLoanItem: {
    borderColor: '#28a745',
    backgroundColor: '#e6f9ec',
  },
  loanText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLoansText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  // Button Styles
  repayButton: {
    backgroundColor: 'orange', // Yellow color for the button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, // Rounded corners for the button
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  repayButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text for contrast
    fontFamily: 'Roboto', // Change this to any custom font or use a system font
  },
  repayButtonDisabled: {
    backgroundColor: '#ccc', // Disable button with a grey background
  },
  repayButtonTextDisabled: {
    color: '#666', // Disabled button text in grey
  },
  loanItemButton: {
    backgroundColor: '#28a745', // Green accent color
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
    backgroundColor: '#1c7c3c', // Darken on press
  },
});

export default LoanRepayScreen;
