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
  ActivityIndicator,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {StackNavigationProp} from '@react-navigation/stack';
import {api} from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  LoanDetails: {photo: string | null};
};

type KYCScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LoanDetails'>;
type Props = {navigation: KYCScreenNavigationProp};

const KYCScreen: React.FC<Props> = ({navigation}) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [f, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('Already Written Some address...');
  const [aadhar, setAadhar] = useState('895623568956');
  const [bankAccount, setBankAccount] = useState('8965235689562');
  const [ifsc, setIfsc] = useState('sbin0000562');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    fullName: false,
    mobileNumber: false,
    address: false,
    aadhar: false,
    bankAccount: false,
    ifsc: false,
    photo: false,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await api.get('/users/login-check', {
          headers: {Authorization: `Bearer ${token}`},
        });
        if (response?.data?.message) {
          const {fullName, mobileNo} = response.data.message;
          setFullName(fullName || '');
          setMobileNumber(mobileNo || '');
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch user details. Please try again.');
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
            message: 'This app needs access to your camera.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const capturePhoto = async () => {
    if (!(await requestCameraPermission())) {
      Alert.alert('Error', 'Camera permission is required.');
      return;
    }

    try {
      const result = await launchCamera({mediaType: 'photo', saveToPhotos: true});
      if (result.assets?.length) {
        setPhoto(result.assets[0].uri || null);
      } else {
        Alert.alert('Error', 'No photo captured.');
      }
    } catch {
      Alert.alert('Error', 'Error capturing photo.');
    }
  };

  const validateFields = () => {
    return {
      fullName: !f,
      mobileNumber: mobileNumber.length !== 10,
      address: !address,
      aadhar: aadhar.length !== 12,
      bankAccount: !/^\d{10,15}$/.test(bankAccount),
      ifsc: !/^[A-Za-z]{4}\d{7}$/.test(ifsc),
      photo: !photo,
    };
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();
    setErrors(validationErrors);

    if (Object.values(validationErrors).includes(true)) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token not found.');
        return;
      }

      const formData = new FormData();
      formData.append('address', address);
      formData.append('aadharCardId', aadhar);
      formData.append('accountNumber', bankAccount);
      formData.append('ifscCode', ifsc);
      if (photo) {
        formData.append('livePhoto', {
          uri: Platform.OS === 'android' ? photo : photo.replace('file://', ''),
          name: photo.split('/').pop(),
          type: 'image/jpeg',
        });
      }

      const response = await api.post('/users/kyc', formData, {
        headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data'},
      });

      if (response?.data?.message) {
        Alert.alert('Success', 'Your KYC details have been submitted.');
        navigation.replace('LoanDetails', {photo});
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTextInput = (placeholder: string, value: string, onChange: (text: string) => void, error: boolean, keyboardType?: any, maxLength?: number, editable?: boolean) => (
    <>
      <TextInput
        placeholder={placeholder}
        style={[styles.input, error && styles.errorInput]}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        maxLength={maxLength}
        editable={editable}
      />
      {error && <Text style={styles.errorText}>* Required</Text>}
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>KYC Details</Text>

      {renderTextInput('Full Name', f, setFullName, errors.fullName, 'default', undefined, false)}
      {renderTextInput('Mobile Number', mobileNumber, setMobileNumber, errors.mobileNumber, 'numeric', 10, false)}
      {renderTextInput('Address', address, setAddress, errors.address, 'default')}
      {renderTextInput('Aadhar Details', aadhar, setAadhar, errors.aadhar, 'numeric', 12)}
      {renderTextInput('Bank Account No.', bankAccount, setBankAccount, errors.bankAccount)}
      {renderTextInput('IFSC Code', ifsc, setIfsc, errors.ifsc)}

      <TouchableOpacity style={styles.photoButton} onPress={capturePhoto}>
        {photo ? <Image source={{uri: photo}} style={styles.photoPreview} /> : <Text style={styles.photoButtonText}>📸 Capture Photo</Text>}
      </TouchableOpacity>

      {loading ? <ActivityIndicator size="large" color="#28a745" /> : <Button title="Submit" onPress={handleSubmit} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'},
  input: {width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginVertical: 10},
  errorInput: {borderColor: 'red'},
  errorText: {color: 'red', fontSize: 14, marginTop: 5},
  photoButton: {backgroundColor: '#28a745', width: 150, height: 150, borderRadius: 75, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'},
  photoPreview: {width: 150, height: 150, borderRadius: 75},
  photoButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});

export default KYCScreen;
