import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(120deg, #3f51b5 0%, #00897b 100%)',
        color: '#fff',
        borderRadius: 4,
        p: { xs: 3.5, md: 6 },
        mb: 5,
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={2.5} maxWidth={620}>
          <Typography variant="overline" sx={{ letterSpacing: 1.2, opacity: 0.9 }}>
            TKU Market
          </Typography>
          <Typography variant="h3">
            Modern e-ticaret deneyimi: hizli, sade ve backend entegrasyonuna hazir.
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }}>
            Urunleri kesfet, detaylari incele ve tek tikla sepete ekle. Servis katmani sayesinde
            bu yapi Spring Boot API gecisinde minimum degisiklikle kullanilabilir.
          </Typography>
          <Box>
            <Button
              component={RouterLink}
              to="/"
              endIcon={<ArrowForwardIcon />}
              variant="contained"
              color="secondary"
            >
              Alisverise Basla
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

