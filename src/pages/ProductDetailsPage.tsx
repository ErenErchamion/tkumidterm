import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Stack, 
  Typography, 
  TextField, 
  Rating, 
  Card, 
  CardContent,
  Alert
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getAllBrands } from '../services/brandService';
import { getProductById } from '../services/productService';
import { api } from '../utils/api';
import type { Brand, Product } from '../types/models';
import { formatTRY } from '../utils/currency';

type Review = {
  id: number;
  productId: number;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type Question = {
  id: number;
  productId: number;
  userEmail: string;
  questionText: string;
  answerText: string | null;
  createdAt: string;
  answeredAt: string | null;
};

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Reviews and Q&A state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Form states
  const [ratingVal, setRatingVal] = useState<number | null>(5);
  const [commentVal, setCommentVal] = useState('');
  const [questionVal, setQuestionVal] = useState('');

  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  const loadReviewsAndQuestions = (productId: string) => {
    api.get<Review[]>(`/products/${productId}/reviews`).then(setReviews).catch(console.error);
    api.get<Question[]>(`/products/${productId}/questions`).then(setQuestions).catch(console.error);
  };

  useEffect(() => {
    if (!id) return;

    getProductById(id).then(setProduct);
    getAllBrands().then(setBrands);
    loadReviewsAndQuestions(id);
  }, [id]);

  const brand = useMemo(() => brands.find((item) => item.id === product?.brandId), [brands, product]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !ratingVal || !commentVal.trim()) return;

    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, {
        rating: ratingVal,
        comment: commentVal
      });
      setCommentVal('');
      setRatingVal(5);
      loadReviewsAndQuestions(id);
      alert('Yorumunuz başarıyla eklendi.');
    } catch (err) {
      console.error(err);
      alert('Yorum eklenirken bir hata oluştu.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !questionVal.trim()) return;

    setSubmittingQuestion(true);
    try {
      await api.post(`/products/${id}/questions`, {
        questionText: questionVal
      });
      setQuestionVal('');
      loadReviewsAndQuestions(id);
      alert('Sorunuz başarıyla iletildi. Admin cevapladığında burada listelenecektir.');
    } catch (err) {
      console.error(err);
      alert('Soru gönderilirken bir hata oluştu.');
    } finally {
      setSubmittingQuestion(false);
    }
  };

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Yukleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.name}
              sx={{ width: '100%', borderRadius: 2, objectFit: 'cover', maxHeight: 460 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight="bold">{product.name}</Typography>

            <Typography
              component={RouterLink}
              to={`/brand/${product.brandId}`}
              sx={{ mt: 1, display: 'inline-block', textDecoration: 'none', color: 'secondary.main', fontWeight: 600 }}
            >
              {brand?.name}
            </Typography>

            <Typography variant="h5" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
              {formatTRY(product.price)}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 2 }}>
              {product.description}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 4 }}>
              <Button variant="outlined" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                -
              </Button>
              <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 'bold' }}>{quantity}</Typography>
              <Button variant="outlined" onClick={() => setQuantity((value) => value + 1)}>
                +
              </Button>
            </Stack>

            <Button 
              sx={{ mt: 3, px: 4, py: 1.5, borderRadius: 2.5, fontWeight: 'bold' }} 
              size="large" 
              variant="contained" 
              onClick={() => addToCart(product, quantity)}
            >
              Sepete Ekle
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={4}>
        {/* REVIEWS SECTION */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2.5 }}>
            Değerlendirmeler & Yorumlar
          </Typography>

          {user ? (
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Yorum Yazın
                </Typography>
                <form onSubmit={handleAddReview}>
                  <Box sx={{ mb: 2 }}>
                    <Rating
                      name="rating-select"
                      value={ratingVal}
                      onChange={(_event, newValue) => {
                        setRatingVal(newValue);
                      }}
                    />
                  </Box>
                  <TextField
                    label="Yorumunuz"
                    fullWidth
                    multiline
                    rows={3}
                    value={commentVal}
                    onChange={(e) => setCommentVal(e.target.value)}
                    disabled={submittingReview}
                    sx={{ mb: 2 }}
                  />
                  <Button type="submit" variant="contained" disabled={submittingReview}>
                    Gönder
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Yorum yazmak için lütfen önce giriş yapın.
            </Alert>
          )}

          <Stack spacing={2}>
            {reviews.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Bu ürün için henüz yorum yapılmamış. İlk yorumu siz yapın!
              </Typography>
            ) : (
              reviews.map((rev) => (
                <Paper key={rev.id} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {rev.userEmail}
                    </Typography>
                    <Rating value={rev.rating} readOnly size="small" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {rev.comment}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 1 }}>
                    {new Date(rev.createdAt).toLocaleDateString('tr-TR')}
                  </Typography>
                </Paper>
              ))
            )}
          </Stack>
        </Grid>

        {/* Q&A SECTION */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2.5 }}>
            Ürün Soru & Cevapları
          </Typography>

          {user ? (
            <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Soru Sorun
                </Typography>
                <form onSubmit={handleAddQuestion}>
                  <TextField
                    label="Sorunuz"
                    fullWidth
                    multiline
                    rows={3}
                    value={questionVal}
                    onChange={(e) => setQuestionVal(e.target.value)}
                    disabled={submittingQuestion}
                    sx={{ mb: 2 }}
                  />
                  <Button type="submit" variant="contained" disabled={submittingQuestion}>
                    Soru Sor
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Soru sormak için lütfen önce giriş yapın.
            </Alert>
          )}

          <Stack spacing={2.5}>
            {questions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Bu ürün hakkında henüz soru sorulmamış.
              </Typography>
            ) : (
              questions.map((q) => (
                <Paper key={q.id} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', boxShadow: 'none', bgcolor: '#fafafa' }}>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                      Soru ({q.userEmail}):
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 1, borderLeft: '2px solid #ccc' }}>
                      {q.questionText}
                    </Typography>
                  </Box>
                  {q.answerText ? (
                    <Box sx={{ mt: 1.5, pl: 2, borderLeft: '2px solid #1a237e' }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary">
                        Cevap (Admin):
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {q.answerText}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', display: 'block', mt: 1 }}>
                      Henüz cevaplanmamış.
                    </Typography>
                  )}
                </Paper>
              ))
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailsPage;
