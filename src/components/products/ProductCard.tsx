import { Button, Card, CardActions, CardContent, CardMedia, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { Product } from '../../types/models';
import { formatTRY } from '../../utils/currency';

type ProductCardProps = {
  product: Product;
  brandName: string;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({ product, brandName, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        image={product.imageUrl}
        alt={product.name}
        height="180"
        sx={{ cursor: 'pointer' }}
        onClick={() => navigate(`/product/${product.id}`)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
          {product.name}
        </Typography>

        <Link
          component={RouterLink}
          to={`/brand/${product.brandId}`}
          underline="hover"
          color="secondary.main"
          onClick={(event) => event.stopPropagation()}
          sx={{ fontSize: 14, fontWeight: 600 }}
        >
          {brandName}
        </Link>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {product.summary}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Stack direction="row" sx={{ width: '100%' }} justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={700}>
            {formatTRY(product.price)}
          </Typography>
          <Button variant="contained" onClick={() => onAddToCart(product)}>
            Sepete Ekle
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
