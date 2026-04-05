import { Divider, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import type { Brand, Category } from '../../types/models';

type FilterSidebarProps = {
  categories: Category[];
  brands: Brand[];
  selectedCategoryId: number | null;
  selectedBrandId: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  onBrandSelect: (brandId: number | null) => void;
};

export const FilterSidebar = ({
  categories,
  brands,
  selectedCategoryId,
  selectedBrandId,
  onCategorySelect,
  onBrandSelect,
}: FilterSidebarProps) => {
  return (
    <Paper sx={{ p: 2.25, position: { md: 'sticky' }, top: { md: 96 } }}>
      <Typography variant="subtitle1" fontWeight={700} mb={1}>
        Kategoriler
      </Typography>
      <List disablePadding>
        <ListItemButton
          selected={selectedCategoryId === null}
          onClick={() => onCategorySelect(null)}
          sx={{ borderRadius: 1.5, mb: 0.5 }}
        >
          <ListItemText primary="Tum Kategoriler" />
        </ListItemButton>
        {categories.map((category) => (
          <ListItemButton
            key={category.id}
            selected={selectedCategoryId === category.id}
            onClick={() => onCategorySelect(category.id)}
            sx={{ borderRadius: 1.5, mb: 0.5 }}
          >
            <ListItemText primary={category.name} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1.5 }} />

      <Typography variant="subtitle1" fontWeight={700} mb={1}>
        Markalar
      </Typography>
      <List disablePadding>
        <ListItemButton
          selected={selectedBrandId === null}
          onClick={() => onBrandSelect(null)}
          sx={{ borderRadius: 1.5, mb: 0.5 }}
        >
          <ListItemText primary="Tum Markalar" />
        </ListItemButton>
        {brands.map((brand) => (
          <ListItemButton
            key={brand.id}
            selected={selectedBrandId === brand.id}
            onClick={() => onBrandSelect(brand.id)}
            sx={{ borderRadius: 1.5, mb: 0.5 }}
          >
            <ListItemText primary={brand.name} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

