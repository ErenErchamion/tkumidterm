import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useCart } from '../../context/CartContext';
import { formatTRY } from '../../utils/currency';

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { cartItems, totalAmount, removeFromCart, updateQuantity, checkout } = useCart();

  const handleCheckout = async () => {
    const result = await checkout();
    if (result) {
      onClose();
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 320, sm: 420 }, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Sepet
        </Typography>
        <Divider sx={{ mb: 1 }} />

        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {cartItems.map((item) => (
            <ListItem key={item.product.id} alignItems="flex-start" sx={{ px: 0 }}>
              <ListItemText
                primary={item.product.name}
                secondary={`${formatTRY(item.product.price)} x ${item.quantity}`}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <Button size="small" variant="outlined" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                  -
                </Button>
                <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                  {item.quantity}
                </Typography>
                <Button size="small" variant="outlined" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                  +
                </Button>
                <IconButton color="error" onClick={() => removeFromCart(item.product.id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            </ListItem>
          ))}
          {!cartItems.length && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Sepetiniz su anda bos.
            </Typography>
          )}
        </List>

        <Divider sx={{ my: 1 }} />
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Toplam</Typography>
          <Typography variant="subtitle1" fontWeight={700}>
            {formatTRY(totalAmount)}
          </Typography>
        </Stack>

        <Button variant="contained" size="large" disabled={!cartItems.length} onClick={handleCheckout}>
          Siparisi Tamamla
        </Button>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
