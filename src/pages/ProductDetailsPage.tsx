import { Box, Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getAllBrands } from '../services/brandService';
import { getProductById } from '../services/productService';
import type { Brand, Product } from '../types/models';
import { formatTRY } from '../utils/currency';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) {
      return;
    }

    getProductById(id).then(setProduct);
    getAllBrands().then(setBrands);
  }, [id]);

  const brand = useMemo(() => brands.find((item) => item.id === product?.brandId), [brands, product]);

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Yukleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.name}
              sx={{ width: '100%', borderRadius: 2, objectFit: 'cover', maxHeight: 460 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h5">{product.name}</Typography>

            <Typography
              component={RouterLink}
              to={`/brand/${product.brandId}`}
              sx={{ mt: 1, display: 'inline-block', textDecoration: 'none', color: 'secondary.main', fontWeight: 600 }}
            >
              {brand?.name}
            </Typography>

            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
              {formatTRY(product.price)}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 2 }}>
              {product.description}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                -
              </Button>
              <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{quantity}</Typography>
              <Button variant="outlined" onClick={() => setQuantity((value) => value + 1)}>
                +
              </Button>
            </Stack>

            <Button sx={{ mt: 2 }} size="large" variant="contained" onClick={() => addToCart(product, quantity)}>
              Sepete Ekle
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetailsPage;
