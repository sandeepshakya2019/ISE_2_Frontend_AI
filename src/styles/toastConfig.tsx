/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {BaseToast, ErrorToast, ToastConfig} from 'react-native-toast-message';

const toastConfig: ToastConfig = {
  success: ({text1, text2, ...rest}) => (
    <BaseToast
      {...rest}
      style={{
        borderLeftColor: '#28a745',
        backgroundColor: '#e6f9ec',
        zIndex: 9999,
        elevation: 10,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#28a745',
      }}
      text2Style={{
        fontSize: 16,
        color: '#28a745',
      }}
      text1={text1}
      text2={text2}
    />
  ),
  error: ({text1, text2, ...rest}) => (
    <ErrorToast
      {...rest}
      style={{
        borderLeftColor: '#d32f2f',
        backgroundColor: '#fdecea',
        zIndex: 9999,
        elevation: 10,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#d32f2f',
      }}
      text2Style={{
        fontSize: 16,
        color: '#d32f2f',
      }}
      text1={text1}
      text2={text2}
    />
  ),
};

export default toastConfig;
