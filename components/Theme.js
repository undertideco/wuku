import React from 'react';
import { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    primary: '#7E7F9A',
    secondary: '#E2C8AF',
    primaryText: '#494850',
    secondaryText: '#353535',
    background: '#E5E5E5',
  },
  fonts: ['EB Garamond', "sans-serif"]
}

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Theme;
