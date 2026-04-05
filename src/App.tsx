import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import CartDrawer from './components/cart/CartDrawer';
import Header from './components/layout/Header';
import { useCart } from './context/CartContext';
import BrandPage from './pages/BrandPage';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const { orderNotice, closeOrderNotice } = useCart();

  return (
    <>
      <Header onOpenCart={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/brand/:id" element={<BrandPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Snackbar
        open={Boolean(orderNotice)}
        autoHideDuration={4000}
        onClose={closeOrderNotice}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={closeOrderNotice} severity="success" variant="filled" sx={{ width: '100%' }}>
          {orderNotice?.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
