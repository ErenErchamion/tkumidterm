import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
  AppBar,
  Badge,
  Box,
  Chip,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Category } from '../../types/models';

type AppHeaderProps = {
  categories: Category[];
  cartItemCount: number;
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  onCartClick: () => void;
};

export const AppHeader = ({
  categories,
  cartItemCount,
  selectedCategoryId,
  onCategorySelect,
  onCartClick,
}: AppHeaderProps) => {
  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e6e9f2' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1.5, gap: 2, justifyContent: 'space-between' }}>
          <Stack
            component={RouterLink}
            to="/"
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Box
              component="img"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/İstanbul_Topkapı_Üniversitesi_logo.svg/1280px-İstanbul_Topkapı_Üniversitesi_logo.svg.png"
              alt="TKU Market"
              sx={{ width: 34, height: 34, objectFit: 'contain' }}
            />
            <Typography variant="h6" fontWeight={700}>
              TKU Market
            </Typography>
          </Stack>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Stack direction="row" spacing={1}>
              <Chip
                label="Tum Kategoriler"
                size="small"
                color={selectedCategoryId === null ? 'primary' : 'default'}
                variant={selectedCategoryId === null ? 'filled' : 'outlined'}
                onClick={() => onCategorySelect(null)}
                clickable
                sx={selectedCategoryId === null ? undefined : { backgroundColor: '#fff' }}
              />
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  size="small"
                  color={selectedCategoryId === category.id ? 'primary' : 'default'}
                  variant={selectedCategoryId === category.id ? 'filled' : 'outlined'}
                  onClick={() => onCategorySelect(category.id)}
                  clickable
                  sx={selectedCategoryId === category.id ? undefined : { backgroundColor: '#fff' }}
                />
              ))}
            </Stack>
          </Box>

          <IconButton aria-label="sepeti ac" onClick={onCartClick}>
            <Badge badgeContent={cartItemCount} color="primary" showZero={false}>
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

