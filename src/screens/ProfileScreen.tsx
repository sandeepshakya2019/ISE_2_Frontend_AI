import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ScrollView,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiCallWithHeader} from '../utils/api';

const ProfileScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [success, response] = await apiCallWithHeader('/profile', 'GET');
        if (success && response?.message?.userdetails) {
          setUserData(response.message);
        } else {
          throw new Error('Failed to fetch profile data');
        }
      } catch (error) {
        Alert.alert(
          'Error',
          'Failed to fetch profile details. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const handleBackPress = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    Alert.alert('Logout', 'You have been logged out.');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text>Loading user details...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No user data available.</Text>
      </View>
    );
  }

  const {userdetails, loandetails, kycDetaiils} = userData;

  return (
    <View style={styles.container}>
      {/* Fixed Profile Section */}
      <View style={styles.profileFixed}>
        {userdetails.photo && (
          <Image
            source={{uri: userdetails.photo}}
            style={styles.profileImage}
          />
        )}
        <Text style={styles.heading}>{userdetails.fullName}</Text>
        {/* <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title="Go to Loan Details"
              onPress={() => navigation.navigate('LoanDetails')}
              color="#00796b"
            />
          </View>
          <View style={styles.button}>
            <Button title="Logout" onPress={handleLogout} color="#d9534f" />
          </View>
        </View> */}
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <ProfileDetail label="Mobile " value={userdetails.mobileNo} />
          <ProfileDetail label="Email " value={userdetails.emailId} />
          <ProfileDetail label="No. of Loans " value={userdetails.noOfLoan} />
          <ProfileDetail label="Disbursed Amount " value={userdetails.sectionedAmount} />
          <ProfileDetail
            label="Sanctioned Amount "
            value={userdetails.offeredAmount}
          />
        </View>

        <Text style={styles.heading}>KYC Details</Text>
        <Section title="KYC Details" data={kycDetaiils} renderItem={KycItem} />
        <Text style={styles.heading}>Loan Details</Text>
        <Section
          title="Loan Details"
          data={loandetails}
          renderItem={LoanItem}
        />
      </ScrollView>
    </View>
  );
};

const ProfileDetail = ({label, value}) => (
  <Text style={styles.profile}>
    <Text style={styles.label}>{label}</Text>:{' '}
    <Text style={styles.info}>{value}</Text>
  </Text>
);

const Section = ({title, data, renderItem}) => (
  <View style={{width: '100%'}}>
    {data?.length > 0 ? data.map(renderItem) : <Text>No {title} Found</Text>}
  </View>
);

const LoanItem = (loan, index) => (
  <View key={index} style={styles.loanContainer}>
    <Text style={styles.profile}>
      <Text style={styles.label}>Total Loan Amount</Text>:{' '}
      {loan.totalLoanAmount}
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>Reason</Text>: {loan.loanReason}
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>Status</Text>: {loan.loanStatus}
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>Remaining Amount</Text>: {loan.leftAmount}
    </Text>
  </View>
);

const formatAadharNumber = aadhar => {
  return aadhar && aadhar.match(/.{1,4}/g)?.join(' - '); // Adds space after every 4 digits
};

const KycItem = (kyc, index) => (
  <View key={index} style={styles.kycContainer}>
    {/* {kyc.photo && <Image source={{uri: kyc.photo}} style={styles.kycImage} />} */}
    <Text style={styles.profile}>
      <Text style={styles.label}>Aadhar ID </Text>:{' '}
      {formatAadharNumber(kyc.aadharCardId)}
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>Account Number</Text> : {kyc.accountNumber}
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>IFSC Code</Text> : {kyc.ifscCode}
    </Text>
    <Text style={styles.profile}>
      <Text style={styles.label}>Address</Text> : {kyc.address}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(226, 225, 225)',
  },
  profileFixed: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scrollContent: {
    paddingTop: 50, // Leaves space for fixed profile section
    paddingHorizontal: 20,
  },
  profileSection: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  profile: {
    marginBottom: 5,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  info: {
    fontSize: 16,
  },
  loanContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  kycContainer: {
    backgroundColor: '#eef2f3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  kycImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    width: '45%',
    borderRadius: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
