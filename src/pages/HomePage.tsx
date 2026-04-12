import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Container, Drawer, Grid, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import SidebarFilters from '../components/layout/SidebarFilters';
import { useCart } from '../context/CartContext';
import { getAllBrands } from '../services/brandService';
import { getAllCategories } from '../services/categoryService';
import { getAllProducts } from '../services/productService';
import type { Brand, Category, Product } from '../types/models';

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const selectedCategoryId = Number(searchParams.get('category')) || null;
  const selectedBrandId = Number(searchParams.get('brand')) || null;
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'default';

  useEffect(() => {
    Promise.all([getAllProducts(), getAllCategories(), getAllBrands()]).then(
      ([productsData, categoriesData, brandsData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
      },
    );
  }, []);


  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products
      .filter((product) => {
        const categoryMatch = selectedCategoryId ? product.categoryId === selectedCategoryId : true;
        const brandMatch = selectedBrandId ? product.brandId === selectedBrandId : true;
        if (!categoryMatch || !brandMatch) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const brandName = brands.find((brand) => brand.id === product.brandId)?.name ?? '';
        const haystack = `${product.name} ${product.summary} ${brandName}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }

        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }

        return 0;
      });
  }, [products, selectedCategoryId, selectedBrandId, searchQuery, sortBy, brands]);

  const promotedProducts = useMemo(
    () => filteredProducts.filter((product) => product.is_promoted),
    [filteredProducts],
  );

  const catalogProducts = useMemo(
    () => filteredProducts.filter((product) => !product.is_promoted),
    [filteredProducts],
  );

  const updateFilterParam = (key: 'category' | 'brand' | 'q' | 'sort', value: number | string | null) => {
    const params = new URLSearchParams(searchParams);

    if (value === null || value === '' || value === 'default') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    setSearchParams(params);
  };

  const sidebar = (
    <SidebarFilters
      categories={categories}
      brands={brands}
      selectedCategoryId={selectedCategoryId}
      selectedBrandId={selectedBrandId}
      onCategoryChange={(id) => updateFilterParam('category', id)}
      onBrandChange={(id) => updateFilterParam('brand', id)}
    />
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          mb: 3,
          color: '#fff',
          background: 'linear-gradient(135deg, #0B5ED7 0%, #20C997 100%)',
        }}
      >
        <Typography variant="h4">TKU Market</Typography>
        <Typography sx={{ mt: 1, opacity: 0.95 }}>
          Guvenli alisveris deneyimi, sade arayuz ve hizli siparis akisi.
        </Typography>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, display: { md: 'none' } }}>
        <Typography variant="h6">Urunler</Typography>
        <Button startIcon={<FilterListIcon />} variant="outlined" onClick={() => setMobileFilterOpen(true)}>
          Filtre
        </Button>
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <TextField
          value={searchQuery}
          onChange={(event) => updateFilterParam('q', event.target.value)}
          placeholder="Urun, marka veya ozet ara"
          size="small"
          sx={{ width: { xs: '100%', md: 380 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          size="small"
          label="Siralama"
          value={sortBy}
          onChange={(event) => updateFilterParam('sort', event.target.value)}
          sx={{ width: { xs: '100%', md: 220 } }}
        >
          <MenuItem value="default">Varsayilan</MenuItem>
          <MenuItem value="price-asc">Fiyat: Dusukten Yuksege</MenuItem>
          <MenuItem value="price-desc">Fiyat: Yuksekten Dusuge</MenuItem>
        </TextField>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
          {sidebar}
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {!!promotedProducts.length && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Cok Satanlar
              </Typography>
              <Grid container spacing={2}>
                {promotedProducts.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                    <ProductCard
                      product={product}
                      brandName={brands.find((brand) => brand.id === product.brandId)?.name || '-'}
                      onAddToCart={(item) => addToCart(item, 1)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Tum Urunler
          </Typography>

          <Grid container spacing={2}>
            {catalogProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                <ProductCard
                  product={product}
                  brandName={brands.find((brand) => brand.id === product.brandId)?.name || '-'}
                  onAddToCart={(item) => addToCart(item, 1)}
                />
              </Grid>
            ))}
          </Grid>

          {!!filteredProducts.length && !catalogProducts.length && (
            <Typography color="text.secondary" sx={{ mt: 3 }}>
              Secili filtrelerdeki urunler Cok Satanlar bolumunde listeleniyor.
            </Typography>
          )}

          {!filteredProducts.length && (
            <Typography color="text.secondary" sx={{ mt: 3 }}>
              Secilen filtreler icin urun bulunamadi.
            </Typography>
          )}
        </Grid>
      </Grid>

      <Drawer anchor="left" open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>{sidebar}</Box>
      </Drawer>
    </Container>
  );
};

export default HomePage;
