import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';
import { useFocusEffect } from '@react-navigation/native';

interface PaymentGatewayScreenProps {
  route: { params: { loan: Loan } };
  navigation: any;
}

interface Loan {
  _id: string;
  totalLoanAmount: number;
}

const PaymentGatewayScreen: React.FC<PaymentGatewayScreenProps> = ({ route, navigation }) => {
  const { loan } = route.params;
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(10);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (paymentMethod && timer > 0) {
      const id = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      setIntervalId(id);
    } else if (timer === 0 && paymentMethod) {
      handlePaymentSuccess(paymentMethod);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentMethod, timer]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        if (intervalId) clearInterval(intervalId);
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [intervalId])
  );

  const handlePaymentSuccess = async (method: string) => {
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
        { loanId: loan._id, paymentMethod: method },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.success) {
        Alert.alert('Payment Successful', `Loan ${loan._id} repaid successfully.`, [{ text: 'OK' }]);
        navigation.navigate('LoanDetails');
      } else {
        throw new Error(response?.data?.message || 'Payment failed.');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error?.message || 'Failed to process the payment. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentOption = (method: string) => {
    setPaymentMethod(method);
    setTimer(10);
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
        Repayment Amount: <Text style={styles.amountValue}>₹ {loan?.totalLoanAmount}</Text>
      </Text>

      {paymentMethod ? (
        <View style={styles.cardContainer}>
          <Text style={styles.qrText}>
            {paymentMethod === 'qrcode'
              ? 'Scan this QR code to complete the payment'
              : `Please complete payment via ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}`}
          </Text>
          <Text style={styles.infoText}>Payment will be completed automatically after {timer}s.</Text>
          <View style={styles.centeredImageContainer}>
            <Image source={{ uri: getPaymentImage() }} style={styles.qrImage} />
          </View>
          <Text style={styles.timerText}>{timer}s</Text>
        </View>
      ) : (
        <>
          {['qrcode', 'card', 'googlePay'].map((method) => (
            <View key={method} style={styles.cardContainer}>
              <TouchableOpacity
                style={[styles.paymentOption, loading && styles.disabledButton]}
                onPress={() => handlePaymentOption(method)}
                disabled={loading}
              >
                <Image
                  source={{ uri: `https://dummyimage.com/100x100/000/fff&text=${method.toUpperCase()}` }}
                  style={styles.image}
                />
                <Text style={styles.optionText}>Pay with {method === 'qrcode' ? 'QR Code' : method}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
      {loading && <ActivityIndicator size="large" color="#00796b" />}
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
    color: '#00796b',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
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
  disabledButton: {
    opacity: 0.5,
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
  infoText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  centeredImageContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default PaymentGatewayScreen;
