import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import KYCScreen from '../screens/KYCScreen';
import LoanDetailsScreen from '../screens/LoanDetailsScreen';
import LoanBorrowScreen from '../screens/LoanBorrowScreen';
import LoanRepayScreen from '../screens/LoanRepayScreen';
import PaymentGatewayScreen from '../screens/PaymentGatewayScreen';
export type RootStackParamList = {
  Login: undefined;
  OTP: {fromLogin: boolean};
  KYC: undefined;
  LoanDetails: undefined;
  LoanBorrow: undefined;
  LoanRepay: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{title: 'Login / Register'}}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{title: 'OTP Verification'}}
      />
      <Stack.Screen
        name="KYC"
        component={KYCScreen}
        options={{title: 'KYC Details'}}
      />
      <Stack.Screen
        name="LoanDetails"
        component={LoanDetailsScreen}
        options={{title: 'Loan Details'}}
      />
      <Stack.Screen
        name="LoanBorrow"
        component={LoanBorrowScreen}
        options={{title: 'Borrow Loan'}}
      />
      <Stack.Screen
        name="LoanRepay"
        component={LoanRepayScreen}
        options={{title: 'Repay Loan'}}
      />
      <Stack.Screen
        name="PaymentGatewayScreen"
        component={PaymentGatewayScreen}
        options={{title: 'Payment Gateway'}}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
