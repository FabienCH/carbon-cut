import Layout from './layout';
import React from 'react';
import { ThemeProvider } from '@rneui/themed';
import { theme } from './theme';

export default function App() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Layout />
      </ThemeProvider>
    </React.StrictMode>
  );
}
