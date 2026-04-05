import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getAllCategories } from '../../services/categoryService';
import type { Category } from '../../types/models';

const logoUrl =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/%C4%B0stanbul_Topkap%C4%B1_%C3%9Cniversitesi_logo.svg/1280px-%C4%B0stanbul_Topkap%C4%B1_%C3%9Cniversitesi_logo.svg.png';

type HeaderProps = {
  onOpenCart: () => void;
};

export default function Header({ onOpenCart }: HeaderProps) {
  const { totalItems, orderNotice } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [announcementAnchor, setAnnouncementAnchor] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const selectedCategory = Number(searchParams.get('category')) || null;

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    const params = new URLSearchParams(location.pathname === '/' ? location.search : '');
    const current = Number(params.get('category')) || null;

    if (current === categoryId) {
      params.delete('category');
    } else {
      params.set('category', String(categoryId));
    }

    const query = params.toString();
    navigate(query ? `/?${query}` : '/');
  };

  const announcementItems = useMemo(() => {
    const baseItems = [
      { title: 'Kampanya', detail: 'Sezon firsatlari ile secili urunlerde avantajli fiyatlar.' },
      { title: 'Hizli Kargo', detail: 'Belirli urunlerde ayni gun kargo secenegi aktif.' },
    ];

    if (!orderNotice) {
      return baseItems;
    }

    return [{ title: 'Siparis Bilgisi', detail: orderNotice.message }, ...baseItems];
  }, [orderNotice]);

  const isAnnouncementOpen = Boolean(announcementAnchor);

  return (
    <AppBar position="sticky" elevation={1} color="inherit">
      <Toolbar sx={{ gap: 2 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', gap: 1.5 }}
        >
          <Box component="img" src={logoUrl} alt="TKU Market" sx={{ height: 40, width: 'auto' }} />
          <Typography variant="h6">TKU Market</Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="primary" onClick={(event) => setAnnouncementAnchor(event.currentTarget)}>
          <Badge badgeContent={announcementItems.length} color="info">
            <CampaignOutlinedIcon />
          </Badge>
        </IconButton>

        <IconButton color="primary" onClick={onOpenCart}>
          <Badge badgeContent={totalItems} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        <Popover
          open={isAnnouncementOpen}
          anchorEl={announcementAnchor}
          onClose={() => setAnnouncementAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ width: 340, p: 1.5 }}>
            <Typography variant="subtitle1" sx={{ px: 1, fontWeight: 700 }}>
              Duyurular
            </Typography>
            <List dense>
              {announcementItems.map((item) => (
                <ListItem key={`${item.title}-${item.detail}`} sx={{ alignItems: 'flex-start' }}>
                  <ListItemText primary={item.title} secondary={item.detail} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Popover>
      </Toolbar>

      <Box sx={{ px: { xs: 1, sm: 2 }, pb: 1, overflowX: 'auto' }}>
        <Stack direction="row" spacing={1}>
          {categories.map((category) => {
            const selected = selectedCategory === category.id;
            return (
              <Button
                key={category.id}
                size="small"
                variant={selected ? 'contained' : 'outlined'}
                color={selected ? 'primary' : 'inherit'}
                onClick={() => handleCategoryClick(category.id)}
                sx={{
                  whiteSpace: 'nowrap',
                  borderColor: 'divider',
                  color: selected ? '#fff' : 'text.primary',
                }}
              >
                {category.name}
              </Button>
            );
          })}
        </Stack>
      </Box>
    </AppBar>
  );
}

