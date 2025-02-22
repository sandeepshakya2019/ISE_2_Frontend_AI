import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from './api';
import Toast from 'react-native-toast-message';

export const logoutApiCall = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('mobileNo');
    if (token) {
      // Send API request to logout
      await api.post(
        '/users/logout',
        {},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
    }

    Toast.show({
      text1: 'Success',
      text2: 'You have been logged out.',
    });

    return true;
  } catch (error) {
    Toast.show({
      text1: 'Error',
      text2: 'Unable to logout. Please try again later.',
    });
    console.error('Error during logout:', error);
    return false;
  }
};
