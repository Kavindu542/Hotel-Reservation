import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  LocationOn,
  Star,
  Wifi,
  Pool,
  Restaurant,
  Spa,
  FitnessCenter,
  LocalBar,
  BeachAccess,
  Hiking,
  BusinessCenter,
  CheckCircle,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: '',
  });

  // Mock hotel data
  const mockHotel = {
    id: parseInt(id),
    name: 'Luxury Grand Hotel',
    location: 'New York, NY',
    rating: 4.8,
    price: 299,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    ],
    amenities: [
      { name: 'Free WiFi', icon: <Wifi /> },
      { name: 'Swimming Pool', icon: <Pool /> },
      { name: 'Restaurant', icon: <Restaurant /> },
      { name: 'Spa & Wellness', icon: <Spa /> },
      { name: 'Fitness Center', icon: <FitnessCenter /> },
      { name: 'Bar & Lounge', icon: <LocalBar /> },
      { name: 'Business Center', icon: <BusinessCenter /> },
    ],
    description: 'Experience luxury at its finest in the heart of Manhattan. Our 5-star hotel offers world-class amenities, elegant rooms, and exceptional service. Perfect for both business and leisure travelers.',
    longDescription: `Nestled in the vibrant heart of Manhattan, the Luxury Grand Hotel stands as a beacon of sophistication and comfort. Our establishment combines classic elegance with modern convenience, offering guests an unparalleled experience in the city that never sleeps.

    From the moment you step through our doors, you'll be greeted by our attentive staff and immersed in an atmosphere of refined luxury. Our rooms and suites are meticulously designed to provide the perfect balance of comfort and style, featuring premium bedding, state-of-the-art technology, and breathtaking city views.

    Our hotel boasts an array of world-class amenities including a rooftop swimming pool with panoramic city views, a full-service spa offering rejuvenating treatments, and multiple dining options ranging from casual cafes to fine dining restaurants. The fitness center is equipped with the latest exercise equipment, and our business center provides all the tools needed for productive work sessions.

    Located within walking distance of major attractions, shopping districts, and business centers, the Luxury Grand Hotel serves as the perfect base for exploring New York City. Whether you're here for business meetings, shopping excursions, or cultural experiences, our central location ensures you're never far from where you want to be.

    We pride ourselves on delivering exceptional service that exceeds expectations. Our staff is available 24/7 to assist with any request, from restaurant reservations to arranging transportation. Every detail is carefully considered to ensure your stay is nothing short of extraordinary.`,
    rooms: [
      {
        id: 1,
        name: 'Deluxe King Room',
        description: 'Spacious room with king bed, city view, and luxury amenities',
        price: 299,
        capacity: 2,
        size: '400 sq ft',
        features: ['King Bed', 'City View', 'Balcony', 'Mini Bar', 'Room Service'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      },
      {
        id: 2,
        name: 'Executive Suite',
        description: 'Luxurious suite with separate living area and premium services',
        price: 499,
        capacity: 3,
        size: '600 sq ft',
        features: ['King Bed', 'Living Room', 'City View', 'Premium Amenities', 'Concierge Service'],
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
      },
      {
        id: 3,
        name: 'Presidential Suite',
        description: 'Ultimate luxury with panoramic views and exclusive services',
        price: 999,
        capacity: 4,
        size: '1200 sq ft',
        features: ['King Bed', 'Multiple Rooms', 'Panoramic View', 'Private Butler', 'Exclusive Access'],
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
      },
    ],
    policies: [
      'Check-in: 3:00 PM | Check-out: 11:00 AM',
      'Free cancellation up to 24 hours before arrival',
      'No smoking in rooms (designated smoking areas available)',
      'Pet-friendly (additional fee applies)',
      'Free WiFi throughout the property',
      'Valet parking available (additional fee)',
    ],
    reviews: [
      {
        id: 1,
        user: 'Sarah M.',
        rating: 5,
        comment: 'Absolutely fantastic hotel! The service was impeccable and the room was beautiful.',
        date: '2024-01-15',
      },
      {
        id: 2,
        user: 'Michael R.',
        rating: 4,
        comment: 'Great location and comfortable rooms. Staff was very helpful.',
        date: '2024-01-10',
      },
      {
        id: 3,
        user: 'Jennifer L.',
        rating: 5,
        comment: 'Perfect stay! The amenities exceeded my expectations.',
        date: '2024-01-05',
      },
    ],
  };

  useEffect(() => {
    setHotel(mockHotel);
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleRoomSelection = (room) => {
    setSelectedRoom(room);
    setBookingData(prev => ({ ...prev, roomType: room.name }));
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (selectedRoom && bookingData.checkIn && bookingData.checkOut) {
      navigate(`/booking/${id}`, { 
        state: { 
          hotel, 
          room: selectedRoom, 
          bookingData 
        } 
      });
    }
  };

  if (!hotel) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{ paddingTop: '20px' }}>
      {value === index && children}
    </div>
  );

  return (
    <Container maxWidth="lg">
      {/* Hotel Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {hotel.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            {hotel.location}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Rating value={hotel.rating} precision={0.1} readOnly size="large" />
          <Typography variant="h6" sx={{ ml: 1 }}>
            {hotel.rating}
          </Typography>
        </Box>
      </Box>

      {/* Main Image */}
      <Box sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          height="400"
          image={hotel.images[0]}
          alt={hotel.name}
          sx={{ borderRadius: 2 }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Rooms" />
          <Tab label="Amenities" />
          <Tab label="Policies" />
          <Tab label="Reviews" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              About This Hotel
            </Typography>
            <Typography variant="body1" paragraph>
              {hotel.longDescription}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Quick Booking
              </Typography>
              <TextField
                fullWidth
                label="Check-in"
                type="date"
                value={bookingData.checkIn}
                onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Check-out"
                type="date"
                value={bookingData.checkOut}
                onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Guests"
                type="number"
                value={bookingData.guests}
                onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                inputProps={{ min: 1, max: 10 }}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleBooking}
                disabled={!bookingData.checkIn || !bookingData.checkOut}
              >
                Check Availability
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Available Rooms
        </Typography>
        <Grid container spacing={3}>
          {hotel.rooms.map((room) => (
            <Grid item xs={12} md={4} key={room.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  border: selectedRoom?.id === room.id ? 2 : 1,
                  borderColor: selectedRoom?.id === room.id ? 'primary.main' : 'divider',
                  transition: 'all 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                }}
                onClick={() => handleRoomSelection(room)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={room.image}
                  alt={room.name}
                />
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {room.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {room.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Capacity: {room.capacity} guests
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {room.size}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                    ${room.price}/night
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {room.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Hotel Amenities
        </Typography>
        <Grid container spacing={2}>
          {hotel.amenities.map((amenity, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 2, color: 'primary.main' }}>
                  {amenity.icon}
                </Box>
                <Typography variant="body1">
                  {amenity.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={3}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Hotel Policies
        </Typography>
        <List>
          {hotel.policies.map((policy, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary={policy} />
            </ListItem>
          ))}
        </List>
      </TabPanel>

      <TabPanel value={selectedTab} index={4}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Guest Reviews
        </Typography>
        <Grid container spacing={3}>
          {hotel.reviews.map((review) => (
            <Grid item xs={12} md={6} key={review.id}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {review.user}
                  </Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {review.date}
                </Typography>
                <Typography variant="body1">
                  {review.comment}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Booking Section */}
      {selectedRoom && (
        <Paper sx={{ p: 3, mt: 4, backgroundColor: 'primary.light', color: 'white' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Selected Room: {selectedRoom.name}
              </Typography>
              <Typography variant="body1">
                ${selectedRoom.price}/night • {selectedRoom.capacity} guests
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleBooking}
                sx={{ backgroundColor: 'white', color: 'primary.main' }}
              >
                Book Now
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default HotelDetail;
