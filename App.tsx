import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';
import KYCScreen from './src/screens/KYCScreen';
import LoanDetailsScreen from './src/screens/LoanDetailsScreen';
import LoanBorrowScreen from './src/screens/LoanBorrowScreen';
import LoanRepayScreen from './src/screens/LoanRepayScreen';
import PaymentGatewayScreen from './src/screens/PaymentGatewayScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DocumentScreen from './src/screens/DocumentScreen';
import GovtSchemeScreen from './src/screens/GovtSchemeScreen';
import {apiCallWithHeader} from './src/utils/api';
import {logoutApiCall} from './src/utils/logout';

const Stack = createStackNavigator();

const CustomHeader = ({navigation, handleLogout}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const slideAnim = useState(new Animated.Value(-300))[0]; // Slide from left

  const routeName =
    navigation.getState()?.routes?.[navigation.getState().index]?.name;

  const handleLogoutPress = async () => {
    setLoadingLogout(true);
    await handleLogout();
    setLoadingLogout(false);
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={openModal} style={styles.breadcrumbButton}>
        <Text style={styles.breadcrumbText}>☰</Text>
      </TouchableOpacity>

      <Modal transparent={true} visible={modalVisible} animationType="none">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalContainer,
                {transform: [{translateX: slideAnim}]},
              ]}>
              {loadingLogout ? (
                <ActivityIndicator size="large" color="#28a745" />
              ) : (
                <>
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      routeName === 'Profile' && styles.activeItem,
                    ]}
                    onPress={() => {
                      navigation.navigate('Profile');
                      closeModal();
                    }}>
                    <Text style={styles.modalText}>Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      routeName === 'LoanDetails' && styles.activeItem,
                    ]}
                    onPress={() => {
                      navigation.navigate('LoanDetails');
                      closeModal();
                    }}>
                    <Text style={styles.modalText}>Loan Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      routeName === 'LoanBorrow' && styles.activeItem,
                    ]}
                    onPress={() => {
                      navigation.navigate('LoanBorrow');
                      closeModal();
                    }}>
                    <Text style={styles.modalText}>Borrow Loan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      routeName === 'LoanRepay' && styles.activeItem,
                    ]}
                    onPress={() => {
                      navigation.navigate('LoanRepay');
                      closeModal();
                    }}>
                    <Text style={styles.modalText}>Repay Loan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      routeName === 'Document' && styles.activeItem,
                    ]}
                    onPress={() => {
                      navigation.navigate('Document');
                      closeModal();
                    }}>
                    <Text style={styles.modalText}>Documents</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      routeName === 'GovtSchemeScreen' && styles.activeItem,
                    ]}
                    onPress={() => {
                      navigation.navigate('GovtSchemeScreen');
                      closeModal();
                    }}>
                    <Text style={styles.modalText}>Govt Schemes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={handleLogoutPress}>
                    <Text style={styles.modalText}>Logout</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const response = await apiCallWithHeader('/users/login-check', 'GET');

        if (response[0] && response[1]?.message) {
          const {isKYC} = response[1]?.message;

          if (!isKYC) {
            Alert.alert(
              'KYC Required',
              'Please fill the KYC Details to proceed.',
            );
            setInitialRoute('KYC');
          } else {
            setInitialRoute('Profile');
          }
        } else {
          setInitialRoute('Register');
        }
      } catch (error) {
        console.log('Main Api Error', error);
        Alert.alert(
          'Authentication Error',
          'Something Went Wrong. Please Try Again...',
        );
        setInitialRoute('Register');
      } finally {
        setLoading(false);
      }
    };

    checkUserAuthentication();
  }, []);

  const handleLogout = async () => {
    await logoutApiCall();
    setInitialRoute('Login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={({navigation}) => ({
          headerShown: true,
          header: () => (
            <CustomHeader navigation={navigation} handleLogout={handleLogout} />
          ),
        })}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OTP"
          component={OTPScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="KYC"
          component={KYCScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="LoanDetails" component={LoanDetailsScreen} />
        <Stack.Screen name="LoanBorrow" component={LoanBorrowScreen} />
        <Stack.Screen name="LoanRepay" component={LoanRepayScreen} />
        <Stack.Screen
          name="PaymentGateway"
          component={PaymentGatewayScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Document" component={DocumentScreen} />
        <Stack.Screen name="GovtSchemeScreen" component={GovtSchemeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // All styles remain the same...
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  headerContainer: {
    padding: 15,
    backgroundColor: '#28a745',
    alignItems: 'flex-start',
  },
  breadcrumbButton: {
    padding: 10,
  },
  breadcrumbText: {
    fontSize: 24,
    color: '#fff',
  },
  modalContainer: {
    width: '70%',
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  activeItem: {
    backgroundColor: '#28a745',
  },
  modalText: {
    fontSize: 18,
  },
  closeButton: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});

export default App;
