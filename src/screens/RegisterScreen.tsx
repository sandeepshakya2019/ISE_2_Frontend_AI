import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message'; // Import Toast
import Logo from '../components/Shared/Logo';
import {api, apiCallWithHeader, apiCallWithoutHeader} from '../utils/api';
import toastConfig from '../styles/toastConfig';
// comment check
const RegisterScreen = ({navigation}) => {
  const [formData, setFormData] = useState({
    name: 'Sandeep Kumar',
    mobileNumber: '9084043946',
    email: 'cs24m112@gmail.com',
    isTermsAccepted: false,
  });
  const [loading, setLoading] = useState(false); // Loading state

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({...prevState, [field]: value}));
  };

  const validateForm = () => {
    const {name, mobileNumber, email, isTermsAccepted} = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      return 'Full Name is Required';
    }

    if (!mobileNumber || mobileNumber.length !== 10) {
      return 'Mobile Number should be of 10 Digit';
    }

    if (email && !emailRegex.test(email)) {
      return 'Valid Email Address is Required';
    }

    if (!isTermsAccepted) {
      return 'You must accept the Terms and Conditions.';
    }

    return null;
  };

  const loginUser = async () => {
    try {
      const payload = {mobileNo: formData.mobileNumber};
      const [success, response] = await apiCallWithoutHeader(
        '/users/login-otp',
        'POST',
        payload,
      );

      if (success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Please check SMS for OTP',
        });
        return response[1];
      }
    } catch (error: any) {
      throw error;
    }
  };

  const getOTP = async () => {
    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      throw Error('Please Entrer 10 Digit mobile Number');
    }
    setLoading(true);
    try {
      await loginUser();
    } catch (err: any) {
      navigation.navigate('Register');
      throw Error(err);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (): Promise<any> => {
    try {
      const {name, mobileNumber, email} = formData;

      const payload = {
        mobileNo: mobileNumber,
        fullName: name,
        emailId: email,
      };

      const [success, response] = await apiCallWithoutHeader(
        '/users/register',
        'POST',
        payload,
      );

      if (success) {
        await getOTP();
        navigation.replace('OTP', {
          fromLogin: false,
          mobileNo: formData.mobileNumber,
        });
        return response;
      }
    } catch (err: any) {
      throw Error(err);
    }
  };

  const handleGetOTP = async () => {
    const validationError = validateForm();
    if (validationError) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: validationError,
      });
      return;
    }

    setLoading(true);
    try {
      await registerUser();
    } catch (error: any) {
      const errorMessage = error.message.replace(/Error:\s?/i, '');
      console.error('Error during registration:', errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleAlreadyRegistered = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Toast config={toastConfig} />
      <Logo />
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Enter Full Name"
        style={styles.input}
        value={formData.name}
        onChangeText={text => handleInputChange('name', text)}
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Enter Mobile Number"
        style={styles.input}
        keyboardType="numeric"
        value={formData.mobileNumber}
        onChangeText={text =>
          handleInputChange(
            'mobileNumber',
            text.replace(/[^0-9]/g, '').slice(0, 10),
          )
        }
        placeholderTextColor="#bbb"
      />
      <TextInput
        placeholder="Email ID"
        style={styles.input}
        keyboardType="email-address"
        value={formData.email}
        onChangeText={text => handleInputChange('email', text)}
        placeholderTextColor="#bbb"
      />
      <TouchableOpacity
        onPress={() =>
          handleInputChange('isTermsAccepted', !formData.isTermsAccepted)
        }
        style={styles.checkboxContainer}>
        <Text style={styles.checkboxText}>
          {formData.isTermsAccepted ? '☑' : '☐'} Accept Terms and Conditions
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleGetOTP}>
          <Text style={styles.buttonText}>Get OTP</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={handleAlreadyRegistered}
        style={styles.linkButton}>
        <Text style={styles.linkText}>Already registered? Login here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#BB86FC',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    padding: 15,
    marginVertical: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxText: {
    fontSize: 16,
    color: '#bbb',
  },
  button: {
    width: '100%',
    backgroundColor: '#BB86FC',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#121212',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#BB86FC',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  loader: {
    marginTop: 20,
  },
});

export default RegisterScreen;
