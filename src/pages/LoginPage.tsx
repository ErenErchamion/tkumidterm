import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Tab, 
  Tabs, 
  TextField, 
  Typography, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/firebase';

export const LoginPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to home page or previous page after login
  const from = (location.state as any)?.from?.pathname || '/';

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError(null);
    setEmail('');
    setPassword('');
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google ile giriş yapılırken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (activeTab === 0) {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Register
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Geçersiz e-posta adresi veya şifre.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Bu e-posta adresi zaten kullanımda.');
      } else if (err.code === 'auth/weak-password') {
        setError('Şifre en az 6 karakter olmalıdır.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Lütfen geçerli bir e-posta adresi girin.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ 
        borderRadius: 4, 
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight="800" color="primary" gutterBottom>
              E-Ticaret Platformu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Giriş yapın veya yeni bir hesap oluşturun
            </Typography>
          </Box>

          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Giriş Yap" sx={{ fontWeight: 'bold' }} />
            <Tab label="Kayıt Ol" sx={{ fontWeight: 'bold' }} />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="E-Posta Adresi"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }
              }}
            />

            <TextField
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{ mb: 3.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ 
                py: 1.5, 
                borderRadius: 2.5,
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(26, 35, 126, 0.3)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeTab === 0 ? (
                'Giriş Yap'
              ) : (
                'Kayıt Ol'
              )}
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 2.5 }}>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
              <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                veya
              </Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            </Box>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={handleGoogleLogin}
              disabled={loading}
              sx={{ 
                py: 1.5, 
                borderRadius: 2.5,
                fontWeight: 'bold',
                textTransform: 'none',
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'text.secondary',
                  background: 'rgba(0,0,0,0.02)'
                }
              }}
              startIcon={
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-1.14 2.78-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.5z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.02c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.11C3.18 21.88 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.62H1.21C.4 8.24 0 10.06 0 12s.4 3.76 1.21 5.38l4.11-3.11z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.38l4.11 3.11c.94-2.85 3.57-4.96 6.68-4.96z"/>
                </svg>
              }
            >
              Google ile Giriş Yap
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;
