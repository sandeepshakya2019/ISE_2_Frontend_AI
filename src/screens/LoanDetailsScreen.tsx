import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { logoutApiCall } from '../utils/logout';
import toastConfig from '../styles/toastConfig';

const LoanDetailsScreen = ({ route }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loanDetails, setLoanDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const { photo } = route.params || {};

  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch User & Loan Details
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        showToast('Error', 'Authentication token not found. Please log in.');
        return;
      }
      const [userRes, loanRes] = await Promise.all([
        api.get('/users/login-check', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/loan/getAll', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (userRes?.data?.message) setUserDetails(userRes.data.message);
      if (loanRes?.data?.message) setLoanDetails(loanRes.data.message);
      showToast('Success', 'Data fetched successfully.');
    } catch (error) {
      showToast('Error', 'Failed to fetch data. Try again later.');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show Toast Message
  const showToast = (title, message) => {
    Toast.show({ text1: title, text2: message });
  };

  // Logout Handler
  const handleLogout = async () => {
    if (await logoutApiCall()) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } else {
      showToast('Error', 'Logout failed. Try again.');
    }
  };

  const renderLoanItem = ({ item }) => (
    <View style={styles.loanItem}>
      <Text style={styles.loanText}>Loan Amount: ₹ {item.totalLoanAmount}</Text>
      <Text style={styles.loanText}>Status: {item.loanStatus}</Text>
      <Text style={styles.loanText}>Reason: {item.loanReason}</Text>
      <Text style={styles.loanText}>Payback Amount: ₹ {item.paybackAmount}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast config={toastConfig} />
      <Text style={styles.title}>Loan Details</Text>

      {photo || userDetails?.photo ? (
        <Image source={{ uri: photo || userDetails.photo }} style={styles.photo} />
      ) : (
        <Text style={styles.noPhotoText}>No photo available</Text>
      )}

      <View style={styles.cardContainer}>
        {[
          { label: 'Total Amount', value: userDetails?.sectionedAmount || '0' },
          { label: 'Eligible Amount', value: userDetails?.offeredAmount || '0' },
          { label: 'Number of Loans', value: userDetails?.noOfLoan || 0 }
        ].map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.rupee}>₹ {item.value}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={loanDetails}
        renderItem={renderLoanItem}
        keyExtractor={item => item._id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.loanList}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    width: '30%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0ee',
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
  },
  loanItem: {
    width: 300,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
});

export default LoanDetailsScreen;
