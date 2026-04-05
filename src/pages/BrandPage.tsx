import { Box, Container, Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import SidebarFilters from '../components/layout/SidebarFilters';
import ProductCard from '../components/products/ProductCard';
import { useCart } from '../context/CartContext';
import { getAllBrands, getBrandById } from '../services/brandService';
import { getAllCategories } from '../services/categoryService';
import { getAllProducts } from '../services/productService';
import type { Brand, Category, Product } from '../types/models';

export default function BrandPage() {
  const { id } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const selectedCategoryId = Number(searchParams.get('category')) || null;

  useEffect(() => {
    if (!id) {
      return;
    }

    Promise.all([
      getBrandById(id),
      getAllBrands(),
      getAllCategories(),
      getAllProducts({ brandId: Number(id) }),
    ]).then(([brandData, brandsData, categoriesData, productsData]) => {
      setBrand(brandData);
      setAllBrands(brandsData);
      setCategories(categoriesData);
      setProducts(productsData);
    });
  }, [id]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) {
      return products;
    }

    return products.filter((product) => product.categoryId === selectedCategoryId);
  }, [products, selectedCategoryId]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {brand ? `${brand.name} Urunleri` : 'Marka'}
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <SidebarFilters
            categories={categories}
            brands={allBrands}
            selectedCategoryId={selectedCategoryId}
            selectedBrandId={Number(id)}
            onCategoryChange={(value) => {
              const params = new URLSearchParams(searchParams);
              if (value === null) {
                params.delete('category');
              } else {
                params.set('category', String(value));
              }
              setSearchParams(params);
            }}
            onBrandChange={(value) => {
              if (value === null) {
                navigate('/');
                return;
              }
              navigate(`/brand/${value}`);
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={2}>
            {filteredProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                <ProductCard
                  product={product}
                  brandName={brand?.name || ''}
                  onAddToCart={(item) => addToCart(item, 1)}
                />
              </Grid>
            ))}
          </Grid>

          {!filteredProducts.length && (
            <Box sx={{ mt: 2 }}>
              <Typography color="text.secondary">Bu marka icin urun bulunamadi.</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
