import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '../utils/constants';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.light,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: FONT_SIZES.medium,
    backgroundColor: COLORS.light,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.light,
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZES.small,
    marginTop: 5,
  },
});

export default globalStyles;
