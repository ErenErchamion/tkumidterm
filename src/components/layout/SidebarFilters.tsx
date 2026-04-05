import { Box, Divider, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import type { Brand, Category } from '../../types/models';

type SidebarFiltersProps = {
  categories: Category[];
  brands: Brand[];
  selectedCategoryId: number | null;
  selectedBrandId: number | null;
  onCategoryChange: (value: number | null) => void;
  onBrandChange: (value: number | null) => void;
};

export default function SidebarFilters({
  categories,
  brands,
  selectedCategoryId,
  selectedBrandId,
  onCategoryChange,
  onBrandChange,
}: SidebarFiltersProps) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, position: 'sticky', top: 88 }}>
      <Typography variant="subtitle1" sx={{ px: 1, pb: 1 }}>
        Filtreler
      </Typography>

      <Typography variant="caption" sx={{ px: 1, color: 'text.secondary' }}>
        Kategoriler
      </Typography>
      <List dense>
        <ListItemButton
          selected={!selectedCategoryId}
          onClick={() => onCategoryChange(null)}
          sx={{
            borderRadius: 1.5,
            '&.Mui-selected': { bgcolor: 'primary.50' },
            '& .MuiListItemText-primary': { color: 'text.primary' },
          }}
        >
          <ListItemText primary="Tumu" />
        </ListItemButton>
        {categories.map((category) => (
          <ListItemButton
            key={category.id}
            selected={selectedCategoryId === category.id}
            onClick={() => onCategoryChange(category.id)}
            sx={{
              borderRadius: 1.5,
              '&.Mui-selected': { bgcolor: 'primary.50' },
              '& .MuiListItemText-primary': { color: 'text.primary' },
            }}
          >
            <ListItemText primary={category.name} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      <Typography variant="caption" sx={{ px: 1, color: 'text.secondary' }}>
        Markalar
      </Typography>
      <List dense>
        <ListItemButton
          selected={!selectedBrandId}
          onClick={() => onBrandChange(null)}
          sx={{
            borderRadius: 1.5,
            '&.Mui-selected': { bgcolor: 'secondary.50' },
            '& .MuiListItemText-primary': { color: 'text.primary' },
          }}
        >
          <ListItemText primary="Tumu" />
        </ListItemButton>
        {brands.map((brand) => (
          <ListItemButton
            key={brand.id}
            selected={selectedBrandId === brand.id}
            onClick={() => onBrandChange(brand.id)}
            sx={{
              borderRadius: 1.5,
              '&.Mui-selected': { bgcolor: 'secondary.50' },
              '& .MuiListItemText-primary': { color: 'text.primary' },
            }}
          >
            <ListItemText primary={brand.name} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ height: 8 }} />
    </Paper>
  );
}

