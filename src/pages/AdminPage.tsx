import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Tab, 
  Tabs, 
  TextField, 
  Button, 
  Grid, 
  CircularProgress, 
  MenuItem, 
  Checkbox, 
  FormControlLabel, 
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StorageIcon from '@mui/icons-material/Storage';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { getAllProducts } from '../services/productService';
import { getAllCategories } from '../services/categoryService';
import { getAllBrands } from '../services/brandService';
import type { Product, Category, Brand } from '../types/models';

type Question = {
  id: number;
  productId: number;
  userId: string;
  userEmail: string;
  questionText: string;
  answerText: string | null;
  createdAt: string;
};

export const AdminPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Lists
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState<Question[]>([]);

  // Add Product Form State
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productSummary, setProductSummary] = useState('');
  const [productPromoted, setProductPromoted] = useState(false);

  // Update Stock Form State
  const [selectedStockProduct, setSelectedStockProduct] = useState('');
  const [newStockValue, setNewStockValue] = useState('');

  // Answer Form State
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Status Alerts
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }

    // Fetch all metadata
    Promise.all([
      getAllProducts(),
      getAllCategories(),
      getAllBrands(),
      api.get<Question[]>('/admin/questions/unanswered')
    ])
      .then(([productsData, categoriesData, brandsData, questionsData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
        setUnansweredQuestions(questionsData);
      })
      .catch((err) => {
        console.error('Error fetching admin metadata:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, isAdmin, authLoading, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productPrice || !productCategory || !productBrand || !productStock) {
      setErrorMsg('Lütfen zorunlu alanları doldurun.');
      return;
    }

    setSuccessMsg(null);
    setErrorMsg(null);

    const payload = {
      name: productName,
      price: Number(productPrice),
      description: productDesc,
      categoryId: Number(productCategory),
      brandId: Number(productBrand),
      stockCount: Number(productStock),
      imageUrl: productImage || 'https://dummyimage.com/600x400/ccc/000&text=No+Image',
      summary: productSummary,
      is_promoted: productPromoted
    };

    try {
      const created = await api.post<Product>('/admin/products', payload);
      setProducts((prev) => [...prev, created]);
      setSuccessMsg('Ürün başarıyla eklendi.');
      // Reset form
      setProductName('');
      setProductPrice('');
      setProductDesc('');
      setProductCategory('');
      setProductBrand('');
      setProductStock('');
      setProductImage('');
      setProductSummary('');
      setProductPromoted(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Ürün eklenirken hata oluştu.');
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockProduct || !newStockValue) {
      setErrorMsg('Lütfen bir ürün seçin ve yeni stok miktarını girin.');
      return;
    }

    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const updated = await api.put<Product>(`/admin/products/${selectedStockProduct}/stock?stockCount=${newStockValue}`);
      setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
      setSuccessMsg('Stok adedi başarıyla güncellendi.');
      setSelectedStockProduct('');
      setNewStockValue('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Stok güncellenirken hata oluştu.');
    }
  };

  const handleAnswerQuestion = async (questionId: number) => {
    const answerText = answers[questionId];
    if (!answerText || !answerText.trim()) {
      alert('Lütfen bir cevap yazın.');
      return;
    }

    try {
      await api.put(`/admin/questions/${questionId}/answer`, { answerText });
      setUnansweredQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setAnswers((prev) => {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
      alert('Soru başarıyla cevaplandı.');
    } catch (err) {
      console.error(err);
      alert('Cevap gönderilirken hata oluştu.');
    }
  };

  const getProductName = (productId: number) => {
    return products.find((p) => p.id === productId)?.name ?? `Ürün ID: ${productId}`;
  };

  if (authLoading || loading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="800" sx={{ mb: 4 }} color="primary">
        Yönetici Paneli (Admin Portal)
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="fullWidth" 
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab icon={<AddCircleOutlineIcon />} label="Ürün Ekleme" sx={{ fontWeight: 'bold' }} />
        <Tab icon={<StorageIcon />} label="Stok Güncelleme" sx={{ fontWeight: 'bold' }} />
        <Tab icon={<QuestionAnswerIcon />} label="Müşteri Soruları" sx={{ fontWeight: 'bold' }} />
      </Tabs>

      {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{errorMsg}</Alert>}

      {/* TAB 1: ADD PRODUCT */}
      {activeTab === 0 && (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Yeni Ürün Detayları
            </Typography>
            <form onSubmit={handleAddProduct}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    label="Ürün Adı *" 
                    fullWidth 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    label="Fiyat (TL) *" 
                    type="number" 
                    fullWidth 
                    value={productPrice} 
                    onChange={(e) => setProductPrice(e.target.value)} 
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Kategori *"
                    fullWidth
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Marka *"
                    fullWidth
                    value={productBrand}
                    onChange={(e) => setProductBrand(e.target.value)}
                  >
                    {brands.map((b) => (
                      <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    label="Stok Adedi *" 
                    type="number" 
                    fullWidth 
                    value={productStock} 
                    onChange={(e) => setProductStock(e.target.value)} 
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    label="Görsel URL (Image URL)" 
                    fullWidth 
                    value={productImage} 
                    onChange={(e) => setProductImage(e.target.value)} 
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    label="Özet Bilgi (Summary)" 
                    fullWidth 
                    value={productSummary} 
                    onChange={(e) => setProductSummary(e.target.value)} 
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    label="Açıklama (Description)" 
                    multiline 
                    rows={4} 
                    fullWidth 
                    value={productDesc} 
                    onChange={(e) => setProductDesc(e.target.value)} 
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={productPromoted} 
                        onChange={(e) => setProductPromoted(e.target.checked)} 
                        color="primary"
                      />
                    }
                    label="Vitrin Ürünü mü? (Promoted)"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained" size="large">
                    Ürünü Ekle
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: UPDATE STOCK */}
      {activeTab === 1 && (
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Mevcut Ürün Stok Miktarını Güncelle
            </Typography>
            <form onSubmit={handleUpdateStock}>
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField
                    select
                    label="Stok Değişecek Ürün *"
                    fullWidth
                    value={selectedStockProduct}
                    onChange={(e) => setSelectedStockProduct(e.target.value)}
                  >
                    {products.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name} (Mevcut Stok: {p.stockCount})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField 
                    label="Yeni Stok Adedi *" 
                    type="number" 
                    fullWidth 
                    value={newStockValue} 
                    onChange={(e) => setNewStockValue(e.target.value)} 
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Button type="submit" variant="contained" size="large" fullWidth>
                    Stoğu Güncelle
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: CUSTOMER QUESTIONS */}
      {activeTab === 2 && (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ürün</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Kullanıcı (E-Posta)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Soru</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Cevap Yaz</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {unansweredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      Cevaplanmamış soru bulunmamaktadır.
                    </TableCell>
                  </TableRow>
                ) : (
                  unansweredQuestions.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell>{getProductName(q.productId)}</TableCell>
                      <TableCell>{q.userEmail}</TableCell>
                      <TableCell>{q.questionText}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            size="small"
                            placeholder="Cevabınız..."
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                          />
                          <Button 
                            variant="contained" 
                            size="small" 
                            onClick={() => handleAnswerQuestion(q.id)}
                          >
                            Cevapla
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default AdminPage;
