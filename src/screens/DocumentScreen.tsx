import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const instructions = [
  {
    title: 'How to Borrow a Loan',
    steps: [
      'Once logged in, go to the "Home" screen.',
      'Navigate to the "Borrow Loan" section.',
      'Choose the loan amount and the duration that suits your needs.',
      'Review the loan terms, including interest rates and repayment schedules.',
      'If you agree to the terms, click on "Submit" to request the loan.',
      'Your loan application will be reviewed, and you\'ll be notified once approved.',
    ],
  },
  {
    title: 'How to Repay a Loan',
    steps: [
      'Go to the "Loan Repay" screen from the home menu.',
      'Review your outstanding loan balance, including the due date and amount due.',
      'Select your preferred payment method (e.g., bank transfer, credit/debit card).',
      'Enter the amount you wish to repay and submit the payment.',
      'You will receive a confirmation message once your payment has been processed.',
      'Repeat the process for any future loan payments to avoid overdue fees.',
    ],
  },
  {
    title: 'Tips for Responsible Borrowing',
    steps: [
      'Always ensure you can repay your loan on time.',
      'Avoid borrowing more than you need to prevent excessive debt.',
      'Review the loan terms carefully before accepting any loan offer.',
      'Contact customer support if you encounter any issues or need assistance.',
    ],
  },
];

const DocumentScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>App Instructions</Text>

      {instructions.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.subtitle}>{section.title}</Text>
          {section.steps.map((step, i) => (
            <Text key={i} style={styles.content}>
              {i + 1}. {step}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 24,
  },
});

export default DocumentScreen;
