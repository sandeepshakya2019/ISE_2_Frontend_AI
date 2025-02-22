import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Platform} from 'react-native';
import {logoutApiCall} from './logout';

const LOCAL_API_PORT = 3005; // Node.js server port

// Dynamically set the API base URL
// const API_BASE_URL =
//   Platform.OS === 'android'
//     ? `http://10.0.2.2:${LOCAL_API_PORT}/api/v1` // For Android Emulator
//     : `http://localhost:${LOCAL_API_PORT}/api/v1`; // For iOS Simulator or other platforms

const API_BASE_URL = 'https://ise1backend-production.up.railway.app/api/v1';
// const API_BASE_URL = 'http://10.23.86.204:3005/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

const errorFormat = (error: any) => {
  let errorMessage = 'Something went wrong. Please try again.'; // Default message
  const errorData = error?.response?.data?.message;
  console.log(errorData);
  // Check if `errorData` is an object and find the first key with a non-empty value
  if (errorData && typeof errorData === 'object') {
    const firstNonEmptyKey = Object.keys(errorData).find(
      key => errorData[key]?.trim() !== '',
    );
    errorMessage = firstNonEmptyKey
      ? errorData[firstNonEmptyKey]
      : errorMessage;
  } else if (typeof errorData === 'string') {
    errorMessage = errorData;
  }

  return errorMessage;
};

export const apiCallWithHeader = async (
  path: string,
  method: 'GET' | 'POST',
  body: object = {},
): Promise<[boolean, any]> => {
  try {
    // Retrieve all stored keys and log them
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('Auth Keys:', allKeys);

    for (let key of allKeys) {
      const value = await AsyncStorage.getItem(key);
      console.log(`Key: ${key}, Value: ${value}`);
    }

    // Retrieve authentication token
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      // throw new Error('Welcom to FinSpher');
      return [true, null];
    }

    // Define request headers
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make API request based on method type
    let response;
    if (method === 'GET') {
      response = await api.get(path, {headers});
    } else if (method === 'POST') {
      response = await api.post(path, body, {headers});
    } else {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return [true, response?.data];
  } catch (error: any) {
    // console.error('API Call Error:', errorFormat(error));
    logoutApiCall();
    throw new Error(errorFormat(error));
  }
};

export const apiCallWithoutHeader = async (
  path: string,
  method: 'GET' | 'POST',
  body: object = {},
) => {
  try {
    // Make API request based on method type
    let response;
    if (method === 'GET') {
      response = await api.get(path);
    } else if (method === 'POST') {
      response = await api.post(path, body);
    } else {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }
    if (response) {
      return [true, response];
    }
  } catch (error: any) {
    // console.error('API Call Error:', errorFormat(error));
    throw new Error(errorFormat(error));
  }
};
