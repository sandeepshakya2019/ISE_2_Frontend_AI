import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../utils/api';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {logoutApiCall} from '../utils/logout';
import toastConfig from '../styles/toastConfig';

const LoanDetailsScreen = ({route}) => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loanDetails, setLoanDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingLoans, setFetchingLoans] = useState(false);
  const {photo} = route.params || {};

  const navigation = useNavigation();

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Toast.show({
            text1: 'Error',
            text2: 'Authentication token not found. Please log in again.',
          });
          return;
        }

        const response = await api.get('/users/login-check', {
          headers: {Authorization: `Bearer ${token}`},
        });

        if (response?.data?.message) {
          setUserDetails(response.data.message);
        }
      } catch (error) {
        Toast.show({
          text1: 'Error',
          text2: 'Unable to fetch user details. Please try again later.',
        });
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch loan details
  useEffect(() => {
    const fetchLoanDetails = async () => {
      setFetchingLoans(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Toast.show({
            text1: 'Error',
            text2: 'Authentication token not found. Please log in again.',
          });
          return;
        }

        const response = await api.get('/loan/getAll', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data?.message) {
          setLoanDetails(response.data.message);
          Toast.show({
            text1: 'Success',
            text2: 'Loan details fetched successfully.',
          });
        }
      } catch (error: any) {
        Toast.show({
          text1: 'Error',
          text2: 'Unable to fetch loan details. Please try again later.',
        });
        console.error('Error fetching loan details:', error.response);
      } finally {
        setFetchingLoans(false);
      }
    };

    fetchLoanDetails();
  }, []);

  const handleLogout = async () => {
    const log = await logoutApiCall();
    if (log) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    } else {
      Toast.show({
        text1: 'Error',
        text2: 'Unable to logout. Please try again later.',
      });
    }
  };

  const displayPhoto = photo || userDetails?.photo;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderLoanItem = ({item}) => (
    <View style={styles.loanItem}>
      <Text style={styles.loanText}>Loan Amount : ₹ {item.totalLoanAmount}</Text>
      <Text style={styles.loanText}>Status : {item.loanStatus}</Text>
      <Text style={styles.loanText}>Reason : {item.loanReason}</Text>
      <Text style={styles.loanText}>Payback Amount : {item.paybackAmount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Toast config={toastConfig} />
      <Text style={styles.title}>Loan Details</Text>
      {displayPhoto ? (
        <Image source={{uri: displayPhoto}} style={styles.photo} />
      ) : (
        <Text style={styles.noPhotoText}>No photo available</Text>
      )}

      {/* <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="Borrow Loan"
            onPress={() => navigation.navigate('LoanBorrow')}
            color="#4CAF50"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Repay Loan"
            onPress={() => navigation.navigate('LoanRepay')}
            color="#FF9800"
          />
        </View>
      </View> */}

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total Amount</Text>
            <Text style={styles.rupee}>
              ₹ {userDetails?.sectionedAmount || '0'}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Eligible Amount</Text>
            <Text style={styles.rupee}>
              ₹ {userDetails?.offeredAmount || '0'}
            </Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Number of Loans</Text>
            <Text style={styles.rupee}>{userDetails?.noOfLoan || 0}</Text>
          </View>
        </View>
      </View>

      {fetchingLoans ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <FlatList
          data={loanDetails}
          renderItem={renderLoanItem}
          keyExtractor={item => item._id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.loanList}
        />
      )}

      {/* <View style={styles.logoutButtonContainer}>
        <Button title="Logout" color="#d9534f" onPress={handleLogout} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    width: '30%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0ee',
    alignItems: 'center',
  },
  cardRow: {
    alignItems: 'center',
  },
  cardLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  rupee: {
    color: '#00796b',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
  },

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },

  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  noPhotoText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  loanItem: {
    width: 300,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loanText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  loanList: {
    width: '100%',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    width: '45%',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  logoutButtonContainer: {
    width: '60%',
    marginTop: 10,
    borderRadius: 300,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default LoanDetailsScreen;
