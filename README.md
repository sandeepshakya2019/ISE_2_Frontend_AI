# FinSphere

## Backend Repository

The backend for FinSphere is available at: [FinSphere Backend](https://github.com/sandeepshakya2019/ISE_2_Backend_AI)

## Introduction

**FinSphere** is a mobile application designed to promote financial inclusion by providing essential financial services such as savings, loans, and insurance. The app leverages mobile banking, microfinance, and fintech innovations to create an accessible and user-friendly platform for underbanked and underserved populations.

## Purpose

The primary objective of FinSphere is to provide users with seamless access to financial services, helping them manage their finances efficiently. It includes secure authentication, loan application and repayment management, e-KYC verification, financial literacy resources, and real-time notifications to ensure a smooth user experience.

---

## Features

### Implemented Features

#### 1. **User Authentication**

- Secure Register, Login, and Logout functionality using JWT (JSON Web Token).
- Uses AsyncStorage for session persistence.
- Auto-login on app restart if a valid JWT is present.

#### 2. **e-KYC (Electronic Know Your Customer)**

- Users can upload identity verification documents in real-time.
- Supports real-time photo capture using the device camera.
- Documents are stored securely using Cloudinary.

#### 3. **User Profile Management**

- Displays user-specific details including personal information and loan history.
- Backend routes to fetch and update user profiles.
- Includes Name, Email, Demographic Details, Active and Past Loans.

#### 4. **Loan Management**

- **Apply for Loans:** Users can request loans by specifying the amount and reason.
- **Repay Loans:** Users can repay loans in full or in part, with transaction logs maintained for repayment history.
- Loan status, approval details, and repayment schedules are available within the app.

#### 5. **Notifications**

- Users receive push notifications regarding loan repayments, application status, and profile updates.
- Implemented using Firebase Cloud Messaging (FCM).

#### 6. **Financial Literacy Resources**

- Educational content including interactive videos, quizzes, and guides.
- Users can track progress and gain insights into financial planning and management.

#### 7. **Data Fetching with Axios**

- Establishes reliable communication between the front-end and backend APIs.
- Standardized Axios instances with JWT authorization headers.
- Graceful error handling and retry mechanisms.

---

### Proposed Features (Future Enhancements)

1. **AI-Based Loan Recommendations** - AI-powered suggestions based on user history and behavior.
2. **Payment Gateway Integration** - Seamless loan repayment through Stripe, Razorpay, or PayPal.
3. **Real-Time e-KYC Authentication** - Integration with government APIs for identity verification.
4. **Push Notifications for Loan Reminders** - Customizable alerts for payment deadlines.
5. **Multilingual Support** - Support for multiple languages to enhance accessibility.
6. **Offline Support** - Allow basic functionalities to work without an internet connection.
7. **Accessibility Features** - Text-to-speech, high-contrast UI, and inclusive design elements.

---

## Installation Guide

### Step 1: Clone the Frontend Repository

```bash
git clone https://github.com/sandeepshakya2019/ISE_1_Frontend
```

### Step 2: Install Dependencies

```bash
cd ISE_1_Frontend
npm install
```

### Step 3: Start the Application

#### For Android:

```bash
npm run android
```

#### For iOS:

```bash
npm run ios
```

Ensure your emulator or device is properly set up before running the application.

---

## Project Details

### Backend API Integration

The backend is hosted in the **[FinSphere Backend Repository](https://github.com/sandeepshakya2019/ISE_2_Backend_AI)**. It handles authentication, loan applications, user profile management, and document storage.

### Libraries Used

1. **Axios** - For API calls and backend communication.
2. **React** - Core framework for frontend development.
3. **React Native Gesture Handler** - Enables smooth touch interactions.
4. **React Native Image Picker** - Allows users to upload photos for e-KYC.
5. **React Native Reanimated** - Used for animations in the app.
6. **React Native Toast Message** - Displays toast notifications for user interactions.
7. **Firebase Cloud Messaging (FCM)** - Handles push notifications.
8. **Multer & Cloudinary** - Used in the backend for image uploads and storage.

---

## Authors

- **[Sandeep Kumar (CS24M112)](https://github.com/sandeepshakya2019)**
- **[Abhishek Kumar (CS24M120)](https://github.com/imabhishekmahli)**
- **[Ashant Kumar (CS24M113)](https://www.github.com/ashantfet)**

---

## Conclusion

FinSphere is a powerful financial inclusion platform aimed at helping users access essential financial services in a seamless and secure manner. With its robust authentication system, loan management features, and future enhancements like AI-based recommendations and multilingual support, FinSphere is set to revolutionize financial accessibility.
