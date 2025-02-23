import React, {useState, useEffect} from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../utils/api';
import {useFocusEffect} from '@react-navigation/native';

const PaymentGatewayScreen = ({route, navigation}) => {
  const {loan} = route.params;
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null); // Store selected payment method
  const [timer, setTimer] = useState(10); // Timer changed to 10 seconds
  const [intervalId, setIntervalId] = useState(null); // Store the interval ID

  useEffect(() => {
    if (paymentMethod && timer > 0) {
      const id = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      setIntervalId(id); // Save the interval ID to clear it later
    } else if (timer === 0) {
      // Trigger the payment success after timer hits 0
      handlePaymentSuccess(paymentMethod);
      clearInterval(intervalId); // Stop the timer
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [paymentMethod, timer]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true; // Prevent going back
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [intervalId]),
  );

  const handlePaymentSuccess = async method => {
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

      const response = await api.post(
        '/loan/repay',
        {loanId: loan._id, paymentMethod: method},
        {headers: {Authorization: `Bearer ${token}`}},
      );

      if (response?.data?.success) {
        Alert.alert(
          'Payment Successful',
          `Loan ${loan._id} repaid successfully.`,
          [{text: 'OK'}],
          {cancelable: false},
        );
        navigation.navigate('LoanDetails');
      } else {
        throw new Error(response?.data?.message || 'Payment failed.');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2:
          error?.message || 'Failed to process the payment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentOption = method => {
    setPaymentMethod(method);
    setTimer(10); // Reset the timer for the selected payment method
  };

  const getPaymentImage = () => {
    switch (paymentMethod) {
      case 'qrcode':
        return 'https://dummyimage.com/200x200/000/fff&text=QR+Code';
      case 'googlePay':
        return 'https://dummyimage.com/200x200/000/fff&text=Google+Pay';
      case 'card':
        return 'https://dummyimage.com/200x200/000/fff&text=Card';
      default:
        return 'https://dummyimage.com/200x200/000/fff&text=Payment';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Method</Text>
      <Text style={styles.amount}>
        Repayment Amount:{' '}
        <Text style={styles.amount}>₹ {loan?.totalLoanAmount}</Text>
      </Text>

      {paymentMethod ? (
        <View style={styles.cardContainer}>
          <Text style={styles.qrText}>
            {paymentMethod === 'qrcode'
              ? 'Scan this QR code to complete the payment'
              : `Please complete payment via ${
                  paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)
                }`}
          </Text>
          <Text>
            Payment will be completed automatically (Sit back relax) Later we
            can change it with some payment api such as stripe.
          </Text>
          <View style={styles.centeredImageContainer}>
            <Image source={{uri: getPaymentImage()}} style={styles.qrImage} />
          </View>
          <Text style={styles.timerText}>{timer}s</Text>
        </View>
      ) : (
        <>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => handlePaymentOption('qrcode')}
              disabled={loading}>
              <Image
                source={{uri: 'https://dummyimage.com/100x100/000/fff&text=QR'}}
                style={styles.image}
              />
              <Text style={styles.optionText}>Pay with QR Code</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => handlePaymentOption('card')}
              disabled={loading}>
              <Image
                source={{
                  uri: 'https://dummyimage.com/100x100/000/fff&text=Card',
                }}
                style={styles.image}
              />
              <Text style={styles.optionText}>Pay with Card</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => handlePaymentOption('googlePay')}
              disabled={loading}>
              <Image
                source={{
                  uri: 'https://dummyimage.com/100x100/000/fff&text=GPay',
                }}
                style={styles.image}
              />
              <Text style={styles.optionText}>Pay with Google Pay</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  amount: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: '#00796b',
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
    textAlign: 'center',
    elevation: 3,
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 10,
    width: '90%',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  qrText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  centeredImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default PaymentGatewayScreen;
