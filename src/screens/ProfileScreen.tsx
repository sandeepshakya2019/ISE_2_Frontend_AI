import React, { useEffect, useState, FC } from 'react';
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
import { apiCallWithHeader } from '../utils/api';

interface UserDetails {
  fullName: string;
  mobileNo: string;
  emailId: string;
  noOfLoan: number;
  sectionedAmount: string;
  offeredAmount: string;
  photo?: string;
}

interface LoanDetails {
  totalLoanAmount: string;
  loanReason: string;
  loanStatus: string;
  leftAmount: string;
}

interface KycDetails {
  aadharCardId: string;
  accountNumber: string;
  ifscCode: string;
  address: string;
}

interface UserProfile {
  userdetails: UserDetails;
  loandetails: LoanDetails[];
  kycDetaiils: KycDetails[];
}

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        Alert.alert('Error', 'Failed to fetch profile details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const handleBackPress = () => {
      Alert.alert('Exit', 'Are you sure you want to exit the app?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
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

  const { userdetails, loandetails, kycDetaiils } = userData;

  return (
    <View style={styles.container}>
      {/* Fixed Profile Section */}
      <View style={styles.profileFixed}>
        {userdetails.photo && (
          <Image source={{ uri: userdetails.photo }} style={styles.profileImage} />
        )}
        <Text style={styles.heading}>{userdetails.fullName}</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <ProfileDetail label="Mobile" value={userdetails.mobileNo} />
          <ProfileDetail label="Email" value={userdetails.emailId} />
          <ProfileDetail label="No. of Loans" value={String(userdetails.noOfLoan)} />
          <ProfileDetail label="Disbursed Amount" value={userdetails.sectionedAmount} />
          <ProfileDetail label="Sanctioned Amount" value={userdetails.offeredAmount} />
        </View>

        <Text style={styles.heading}>KYC Details</Text>
        <Section title="KYC Details" data={kycDetaiils} renderItem={KycItem} />

        <Text style={styles.heading}>Loan Details</Text>
        <Section title="Loan Details" data={loandetails} renderItem={LoanItem} />
      </ScrollView>
    </View>
  );
};

const ProfileDetail: FC<{ label: string; value?: string }> = ({ label, value }) => (
  <Text style={styles.profile}>
    <Text style={styles.label}>{label}</Text>: <Text style={styles.info}>{value || 'N/A'}</Text>
  </Text>
);

const Section: FC<{ title: string; data?: any[]; renderItem: (item: any, index: number) => JSX.Element }> = ({ title, data, renderItem }) => (
  <View style={{ width: '100%' }}>
    {data?.length ? data.map(renderItem) : <Text>No {title} Found</Text>}
  </View>
);

const LoanItem: FC<LoanDetails & { index: number }> = (loan, index) => (
  <View key={index} style={styles.loanContainer}>
    <ProfileDetail label="Total Loan Amount" value={loan.totalLoanAmount} />
    <ProfileDetail label="Reason" value={loan.loanReason} />
    <ProfileDetail label="Status" value={loan.loanStatus} />
    <ProfileDetail label="Remaining Amount" value={loan.leftAmount} />
  </View>
);

const formatAadharNumber = (aadhar?: string) => {
  return aadhar ? aadhar.match(/.{1,4}/g)?.join(' - ') : 'N/A';
};

const KycItem: FC<KycDetails & { index: number }> = (kyc, index) => (
  <View key={index} style={styles.kycContainer}>
    <ProfileDetail label="Aadhar ID" value={formatAadharNumber(kyc.aadharCardId)} />
    <ProfileDetail label="Account Number" value={kyc.accountNumber} />
    <ProfileDetail label="IFSC Code" value={kyc.ifscCode} />
    <ProfileDetail label="Address" value={kyc.address} />
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
    paddingTop: 50,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
