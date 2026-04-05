import { Button, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h4">Sayfa Bulunamadi</Typography>
        <Typography color="text.secondary">
          Ulasmaya calistiginiz sayfa mevcut degil veya tasinmis olabilir.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Ana Sayfaya Don
        </Button>
      </Stack>
    </Paper>
  );
};

