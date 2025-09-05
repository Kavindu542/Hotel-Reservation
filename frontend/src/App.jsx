import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import Home from './pages/Home';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import Admin from './pages/Admin';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2D6A4F', // deep emerald
      light: '#52B788',
      dark: '#1B4332',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF7B54', // warm coral
      light: '#FFB199',
      dark: '#D95333',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F7F9FB', // soft light background
      paper: '#ffffff',
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: {
            xs: 16,
            sm: 24,
            md: 32,
          },
          paddingRight: {
            xs: 16,
            sm: 24,
            md: 32,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
        containedPrimary: { boxShadow: '0 6px 16px rgba(45, 106, 79, 0.25)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 12 },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App" style={{ width: '100%', minHeight: '100vh' }}>
            <Header />
            <main style={{ 
              minHeight: 'calc(100vh - 64px)', 
              paddingTop: '20px',
              width: '100%',
              maxWidth: '100%',
              overflowX: 'hidden'
            }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hotels" element={<HotelList />} />
                <Route path="/hotel/:id" element={<HotelDetail />} />
                <Route path="/booking/:hotelId" element={<Booking />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
