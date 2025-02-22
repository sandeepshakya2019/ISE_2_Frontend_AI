import React, {useState, useEffect} from 'react';
import {
  View,
  Alert,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  ActivityIndicator, // Importing the ActivityIndicator
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import {api} from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  LoanDetails: {photo: string | null}; // Expecting a photo param
};

type KYCScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoanDetails'
>;

type Props = {
  navigation: KYCScreenNavigationProp;
};

const KYCScreen: React.FC<Props> = ({navigation}) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [f, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState(
    'Already Wriiten Some address you dont need to enter details all details are already filled capture the photo thats it',
  );
  const [aadhar, setAadhar] = useState('895623568956');
  const [bankAccount, setBankAccount] = useState('8965235689562');
  const [ifsc, setIfsc] = useState('sbin0000562');
  const [errors, setErrors] = useState({
    fullName: false,
    mobileNumber: false,
    address: false,
    aadhar: false,
    bankAccount: false,
    ifsc: false,
    photo: false,
  });
  const [loading, setLoading] = useState(false); // Added loading state

  useEffect(() => {
    // Fetch user details from the API
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await api.get('/users/login-check', {
          headers: {Authorization: `Bearer ${token}`},
        });
        console.log('User details:', response.data.message);
        if (response && response.data && response.data.message) {
          const {fullName, mobileNo} = response.data.message;
          setFullName(fullName || '');
          setMobileNumber(mobileNo || '');
        }
      } catch (error: any) {
        console.error('Error fetching user details:', error);
        Alert.alert(
          'Error',
          'Unable to fetch user details. Please try again later.',
        );
      }
    };

    fetchUserDetails();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to capture photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const capturePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Error', 'Camera permission is required to capture photos.');
      return;
    }

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        saveToPhotos: true,
      });
      if (result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri || null);
      } else {
        Alert.alert('Error', 'No photo captured.');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'An error occurred while capturing the photo.');
    }
  };

  const handleSubmit = async () => {
    const validationErrors = {
      fullName: !f,
      mobileNumber: mobileNumber.length !== 10,
      address: !address,
      aadhar: aadhar.length !== 12,
      bankAccount: !bankAccount || !/^\d{10,15}$/.test(bankAccount), // Bank account validation for 10-15 digits
      ifsc: !ifsc || !/^[A-Za-z]{4}\d{7}$/.test(ifsc), // IFSC validation (4 letters followed by 7 digits)
      photo: !photo,
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      Alert.alert(
        'Error',
        'Please fill all required fields and capture a photo.',
      );
      return;
    }

    setLoading(true); // Set loading to true when submitting

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert(
          'Error',
          'Authentication token not found. Please log in again.',
        );
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('address', address);
      formData.append('aadharCardId', aadhar);
      formData.append('accountNumber', bankAccount);
      formData.append('ifscCode', ifsc);

      if (photo) {
        const filename = photo.substring(photo.lastIndexOf('/') + 1);
        const fileUri =
          Platform.OS === 'android' ? photo : photo.replace('file://', '');
        formData.append('livePhoto', {
          uri: fileUri,
          name: filename,
          type: 'image/jpeg',
        });
      }

      const response = await api.post('/users/kyc', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.message) {
        Alert.alert(
          'Success',
          'Your KYC details have been submitted successfully.',
        );
        navigation.replace('LoanDetails', {photo});
      }
    } catch (error: any) {
      let errorMessage = 'Something went wrong. Please try again.'; // Default message
      const errorData = error?.response?.data?.message;
      if (errorData && typeof errorData === 'object') {
        const firstNonEmptyKey = Object.keys(errorData).find(
          key => errorData[key]?.trim() !== '',
        );
        errorMessage = firstNonEmptyKey
          ? errorData[firstNonEmptyKey]
          : errorMessage;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KYC Details</Text>
      <TextInput
        placeholder="Full Name"
        style={[styles.input, errors.fullName && styles.errorInput]}
        value={f}
        onChangeText={setFullName}
        editable={false}
      />
      {errors.fullName && <Text style={styles.errorText}>*Required</Text>}

      <TextInput
        placeholder="Mobile Number"
        style={[styles.input, errors.mobileNumber && styles.errorInput]}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="numeric"
        maxLength={10}
        editable={false}
      />
      {errors.mobileNumber && (
        <Text style={styles.errorText}>*Must be 10 digits</Text>
      )}

      <TextInput
        placeholder="Address"
        style={[
          styles.input,
          styles.textArea,
          errors.address && styles.errorInput,
        ]}
        value={address}
        onChangeText={setAddress}
        multiline
        autoFocus
        numberOfLines={4}
      />
      {errors.address && <Text style={styles.errorText}>*Required</Text>}

      <TextInput
        placeholder="Aadhar Details"
        style={[styles.input, errors.aadhar && styles.errorInput]}
        value={aadhar}
        onChangeText={setAadhar}
        keyboardType="numeric"
        maxLength={12}
      />
      {errors.aadhar && (
        <Text style={styles.errorText}>*Must be 12 digits</Text>
      )}

      <TextInput
        placeholder="Bank Account No."
        style={[styles.input, errors.bankAccount && styles.errorInput]}
        value={bankAccount}
        onChangeText={setBankAccount}
      />
      {errors.bankAccount && (
        <Text style={styles.errorText}>*Must be 10-15 digits</Text>
      )}

      <TextInput
        placeholder="IFSC Code"
        style={[styles.input, errors.ifsc && styles.errorInput]}
        value={ifsc}
        onChangeText={setIfsc}
      />
      {errors.ifsc && (
        <Text style={styles.errorText}>
          *Should start with 4 letters and followed by 7 digits
        </Text>
      )}

      <TouchableOpacity style={styles.photoButton} onPress={capturePhoto}>
        {photo ? (
          <Image source={{uri: photo}} style={styles.photoPreview} />
        ) : (
          <Text style={styles.photoButtonText}>📸 Capture Photo</Text>
        )}
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorInput: {borderColor: 'red'},
  photoButton: {
    backgroundColor: '#28a745',
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  photoButtonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  photoPreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  errorText: {color: 'red', fontSize: 14, marginTop: 5, textAlign: 'left'},
});

export default KYCScreen;
