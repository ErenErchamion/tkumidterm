import { Box, CircularProgress, Container, Grid } from '@mui/material';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProductService } from '../../api/services/ProductService';
import type { Brand, Category } from '../../types/models';
import { CartDrawer } from '../cart/CartDrawer';
import Header from './Header';
import SidebarFilters from './SidebarFilters';

export type StoreOutletContext = {
  selectedCategoryId: number | null;
  selectedBrandId: number | null;
  categories: Category[];
  brands: Brand[];
};

export const StoreLayout = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategoryId = Number(searchParams.get('category')) || null;

  const selectedBrandId = (() => {
    const matchedBrandId = /^\/brand\/(\d+)$/.exec(location.pathname)?.[1];
    return matchedBrandId ? Number(matchedBrandId) : null;
  })();

  const handleCategorySelect = (categoryId: number | null) => {
    const nextCategoryId = selectedCategoryId === categoryId ? null : categoryId;
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextCategoryId === null) {
      nextSearchParams.delete('category');
    } else {
      nextSearchParams.set('category', String(nextCategoryId));
    }

    setSearchParams(nextSearchParams);
  };

  const handleBrandSelect = (brandId: number | null) => {
    const nextBrandId = selectedBrandId === brandId ? null : brandId;

    if (nextBrandId === null) {
      navigate('/');
      return;
    }

    navigate(`/brand/${nextBrandId}`);
  };

  useEffect(() => {
    let active = true;

    Promise.all([ProductService.getAllCategories(), ProductService.getAllBrands()])
      .then(([categoryList, brandList]) => {
        if (active) {
          setCategories(categoryList);
          setBrands(brandList);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header onOpenCart={() => setIsCartOpen(true)} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <SidebarFilters
                categories={categories}
                brands={brands}
                selectedCategoryId={selectedCategoryId}
                selectedBrandId={selectedBrandId}
                onCategoryChange={handleCategorySelect}
                onBrandChange={handleBrandSelect}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Outlet
                context={{
                  selectedCategoryId,
                  selectedBrandId,
                  categories,
                  brands,
                } satisfies StoreOutletContext}
              />
            </Grid>
          </Grid>
        )}
      </Container>
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </Box>
  );
};

