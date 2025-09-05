import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  Chip,
  Rating,
  Button,
  InputAdornment,
} from '@mui/material';
import { Search, LocationOn, Star, FilterList } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const HotelList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 1000],
    rating: 0,
    amenities: [],
    location: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock hotel data
  const mockHotels = [
    {
      id: 1,
      name: 'Luxury Grand Hotel',
      location: 'New York, NY',
      rating: 4.8,
      price: 299,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
      description: 'Luxurious 5-star hotel in the heart of Manhattan',
    },
    {
      id: 2,
      name: 'Seaside Resort & Spa',
      location: 'Miami, FL',
      rating: 4.6,
      price: 199,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
      amenities: ['Beach Access', 'Spa', 'Pool', 'Bar', 'Restaurant'],
      description: 'Beautiful beachfront resort with stunning ocean views',
    },
    {
      id: 3,
      name: 'Mountain View Lodge',
      location: 'Denver, CO',
      rating: 4.7,
      price: 159,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
      amenities: ['Mountain View', 'Hiking', 'Restaurant', 'Fireplace', 'WiFi'],
      description: 'Cozy mountain lodge with breathtaking views',
    },
    {
      id: 4,
      name: 'Urban Boutique Hotel',
      location: 'San Francisco, CA',
      rating: 4.5,
      price: 249,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
      amenities: ['WiFi', 'Restaurant', 'Bar', 'Gym', 'Business Center'],
      description: 'Modern boutique hotel in the heart of the city',
    },
    {
      id: 5,
      name: 'Historic Inn',
      location: 'Boston, MA',
      rating: 4.3,
      price: 179,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
      amenities: ['WiFi', 'Restaurant', 'Historic Charm', 'Garden'],
      description: 'Charming historic inn with modern amenities',
    },
    {
      id: 6,
      name: 'Beachfront Paradise',
      location: 'Los Angeles, CA',
      rating: 4.9,
      price: 399,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
      amenities: ['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym'],
      description: 'Exclusive beachfront resort with luxury amenities',
    },
  ];

  useEffect(() => {
    setHotels(mockHotels);
    setFilteredHotels(mockHotels);

    // Check if search data was passed from home page
    if (location.state?.searchData) {
      const { searchData } = location.state;
      setFilters(prev => ({
        ...prev,
        location: searchData.location || '',
        search: searchData.location || '',
      }));
    }
  }, [location.state]);

  useEffect(() => {
    applyFilters();
  }, [filters, hotels]);

  const applyFilters = () => {
    let filtered = hotels.filter(hotel => {
      // Search filter
      if (filters.search && !hotel.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !hotel.location.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Price filter
      if (hotel.price < filters.priceRange[0] || hotel.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && hotel.rating < filters.rating) {
        return false;
      }

      // Location filter
      if (filters.location && !hotel.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0 && !filters.amenities.every(amenity => 
        hotel.amenities.includes(amenity))) {
        return false;
      }

      return true;
    });

    setFilteredHotels(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      priceRange: [0, 1000],
      rating: 0,
      amenities: [],
      location: '',
    });
  };

  const allAmenities = ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Beach Access', 'Mountain View', 'Hiking', 'Fireplace', 'Business Center', 'Historic Charm', 'Garden'];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Your Perfect Hotel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover amazing accommodations that match your preferences
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search hotels..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        {showFilters && (
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Typography>
                <Slider
                  value={filters.priceRange}
                  onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Minimum Rating
                </Typography>
                <Rating
                  value={filters.rating}
                  onChange={(e, newValue) => handleFilterChange('rating', newValue)}
                  precision={0.5}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>
                  Amenities
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {allAmenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      size="small"
                      onClick={() => {
                        const newAmenities = filters.amenities.includes(amenity)
                          ? filters.amenities.filter(a => a !== amenity)
                          : [...filters.amenities, amenity];
                        handleFilterChange('amenities', newAmenities);
                      }}
                      color={filters.amenities.includes(amenity) ? 'primary' : 'default'}
                      variant={filters.amenities.includes(amenity) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{ mt: 2 }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">
          {filteredHotels.length} hotels found
        </Typography>
      </Box>

      {/* Hotel Grid */}
      <Grid container spacing={4}>
        {filteredHotels.map((hotel) => (
          <Grid item xs={12} md={6} lg={4} key={hotel.id}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(`/hotel/${hotel.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={hotel.image}
                alt={hotel.name}
              />
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {hotel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  {hotel.location}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={hotel.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {hotel.rating}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {hotel.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                  ${hotel.price}/night
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {hotel.amenities.slice(0, 3).map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {hotel.amenities.length > 3 && (
                    <Chip
                      label={`+${hotel.amenities.length - 3} more`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredHotels.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No hotels found matching your criteria
          </Typography>
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default HotelList;
