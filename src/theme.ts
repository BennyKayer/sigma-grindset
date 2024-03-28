'use client';
import { GFS_Neohellenic } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const neoHellenic = GFS_Neohellenic({
  weight: ['400', '700'],
  subsets: ['greek'],
  display: "swap",
});

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: neoHellenic.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#60a5fa',
          }),
        }),
      },
    },
  },
});

export default theme;
