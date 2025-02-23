import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const DocumentScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>App Instructions</Text>

      <Text style={styles.subtitle}>How to Borrow a Loan</Text>
      <Text style={styles.content}>
        1. Once logged in, go to the "Home" screen. {'\n'}
        2. Navigate to the "Borrow Loan" section. {'\n'}
        3. Choose the loan amount and the duration that suits your needs. {'\n'}
        4. Review the loan terms, including interest rates and repayment
        schedules. {'\n'}
        5. If you agree to the terms, click on "Submit" to request the loan.{' '}
        {'\n'}
        6. Your loan application will be reviewed, and you'll be notified once
        approved.
      </Text>

      <Text style={styles.subtitle}>How to Repay a Loan</Text>
      <Text style={styles.content}>
        1. Go to the "Loan Repay" screen from the home menu. {'\n'}
        2. Review your outstanding loan balance, including the due date and
        amount due. {'\n'}
        3. Select your preferred payment method (e.g., bank transfer,
        credit/debit card). {'\n'}
        4. Enter the amount you wish to repay and submit the payment. {'\n'}
        5. You will receive a confirmation message once your payment has been
        processed. {'\n'}
        6. Repeat the process for any future loan payments to avoid overdue
        fees.
      </Text>

      <Text style={styles.subtitle}>Tips for Responsible Borrowing</Text>
      <Text style={styles.content}>
        - Always ensure you can repay your loan on time. {'\n'}- Avoid borrowing
        more than you need to prevent excessive debt. {'\n'}- Review the loan
        terms carefully before accepting any loan offer. {'\n'}- Contact
        customer support if you encounter any issues or need assistance.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212', // Dark background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff', // White text
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#cccccc', // Light gray text
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: '#dddddd', // Slightly lighter gray for readability
  },
});

export default DocumentScreen;
