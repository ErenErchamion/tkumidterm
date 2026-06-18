import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  Grid, 
  CircularProgress, 
  Button, 
  Paper,
  Stack
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { formatTRY } from '../utils/currency';
import { getAllProducts } from '../services/productService';
import type { Order, Product } from '../types/models';

export const OrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    Promise.all([
      api.get<Order[]>('/orders'),
      getAllProducts()
    ])
      .then(([ordersData, productsData]) => {
        setOrders(ordersData);
        setProducts(productsData);
      })
      .catch((err) => {
        console.error('Error fetching order history:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, authLoading, navigate]);

  const getProductDetails = (productId: number) => {
    return products.find((p) => p.id === productId);
  };

  if (authLoading || loading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="800" gutterBottom sx={{ mb: 4 }}>
        Sipariş Geçmişim
      </Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Henüz siparişiniz bulunmuyor
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Harika ürünlerimizi keşfetmek için alışverişe hemen başlayın!
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Alışverişe Başla
          </Button>
        </Paper>
      ) : (
        <Stack spacing={3.5}>
          {orders.map((order) => (
            <Card key={order.id} sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Box sx={{ p: 2.5, bgcolor: '#f8f9fa', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      SİPARİŞ NO
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      #{order.id}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        TARİH
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 4 }} sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <PaymentIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        TOPLAM TUTAR
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        {formatTRY(order.totalAmount)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <CardContent sx={{ p: 0 }}>
                {order.items.map((item, index) => {
                  const product = getProductDetails(item.productId);
                  return (
                    <Box key={index}>
                      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 3.5 }}>
                        {product ? (
                          <Box 
                            component="img" 
                            src={product.imageUrl} 
                            alt={product.name} 
                            sx={{ width: 70, height: 70, borderRadius: 2, objectFit: 'cover' }}
                          />
                        ) : (
                          <Box sx={{ width: 70, height: 70, borderRadius: 2, bgcolor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingBagIcon sx={{ color: '#9e9e9e' }} />
                          </Box>
                        )}
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {product ? product.name : `Ürün ID: ${item.productId}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Adet: {item.quantity} × {formatTRY(item.unitPrice)}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {formatTRY(item.lineTotal)}
                          </Typography>
                        </Box>
                      </Box>
                      {index < order.items.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default OrdersPage;
