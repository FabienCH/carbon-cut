import { Colors, Theme } from '@rneui/themed';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    padding: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export const errorStyle = (
  theme: {
    colors: Colors;
  } & Theme,
) =>
  StyleSheet.create({
    error: { color: theme.colors.error },
  });
