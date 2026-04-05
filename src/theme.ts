import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0B5ED7' },
    secondary: { main: '#20C997' },
    background: { default: '#F7F9FC', paper: '#FFFFFF' },
    text: { primary: '#1F2937', secondary: '#6B7280' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
});

export const appTheme = theme;
export default theme;
