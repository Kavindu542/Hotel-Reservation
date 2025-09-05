import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, LocationOn, Star, Hotel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { hotelsAPI } from '../services/api';
// ConnectionTest removed from UI

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedHotels();
  }, []);

  const fetchFeaturedHotels = async () => {
    try {
      setLoading(true);
      // Get first 6 hotels for featured section
      const response = await hotelsAPI.getHotels({ per_page: 6 });
      setFeaturedHotels(response.hotels);
    } catch (err) {
      setError('Failed to load featured hotels. Please try again later.');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchData.location) {
      navigate('/hotels', { state: { searchData } });
    }
  };

  const handleHotelClick = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: 'white',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop)',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        <Container 
          maxWidth="xl" 
          sx={{ 
            position: 'relative', 
            zIndex: 1,
            width: '100%',
            px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' }
            }}
          >
            Find Your Perfect Stay
          </Typography>
          <Typography 
            variant="h5" 
            paragraph 
            sx={{ 
              mb: 4,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            Discover amazing hotels and book your next adventure with ease
          </Typography>
          
          {/* Search Form */}
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            backgroundColor: 'rgba(255,255,255,0.95)', 
            color: 'text.primary',
            width: '100%'
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Location"
                  value={searchData.location}
                  onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Check-in"
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Check-out"
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Guests"
                  type="number"
                  value={searchData.guests}
                  onChange={(e) => setSearchData({ ...searchData, guests: parseInt(e.target.value) })}
                  inputProps={{ min: 1, max: 10 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  sx={{ height: '56px' }}
                >
                  Search Hotels
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Paper>

      {/* Featured Hotels */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          width: '100%',
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }
        }}
      >
        {/* Connection test removed */}
        
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom 
          sx={{ 
            mb: 4,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
          }}
        >
          Featured Hotels
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={4}>
            {featuredHotels.map((hotel) => (
              <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}
                  onClick={() => handleHotelClick(hotel.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={hotel.images && hotel.images.length > 0 ? hotel.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'}
                    alt={hotel.name}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {hotel.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      {hotel.city}, {hotel.country}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                      <Typography variant="body2">{hotel.rating}</Typography>
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${hotel.price_per_night}/night
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {hotel.amenities && hotel.amenities.slice(0, 4).map((amenity, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          sx={{
                            backgroundColor: 'grey.100',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            mr: 1,
                            display: 'inline-block',
                          }}
                        >
                          {amenity}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Why Choose Us */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' }
            }}
          >
            Why Choose Our Platform?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Hotel sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Wide Selection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose from thousands of hotels worldwide, from budget-friendly to luxury accommodations.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Star sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Best Prices
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We guarantee the best rates and exclusive deals you won't find anywhere else.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Search sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Easy Booking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Simple and secure booking process with instant confirmation and 24/7 support.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
