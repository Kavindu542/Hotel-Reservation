import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container, Typography, Box, Paper, Grid, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { hotelsAPI } from '../services/api';

const emptyForm = {
  name: '', description: '', address: '', city: '', state: '', country: '', zip_code: '',
  phone: '', email: '', website: '', rating: 0, price_per_night: '', total_rooms: '', available_rooms: '',
  amenities: '', images: ''
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate('/');
      return;
    }
    fetchHotels();
  }, [user]);

  const fetchHotels = async () => {
    try {
      const res = await hotelsAPI.getHotels({ per_page: 100 });
      setHotels(res.hotels || []);
    } catch (e) {
      setError(e.message);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (hotel) => {
    setEditingId(hotel.id);
    setForm({
      ...emptyForm,
      ...hotel,
      amenities: (hotel.amenities || []).join(', '),
      images: (hotel.images || []).join(', '),
    });
    setDialogOpen(true);
  };

  const saveHotel = async () => {
    try {
      setError('');
      const payload = {
        ...form,
        rating: Number(form.rating || 0),
        price_per_night: Number(form.price_per_night),
        total_rooms: Number(form.total_rooms),
        available_rooms: Number(form.available_rooms),
        amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
        images: form.images ? form.images.split(',').map(a => a.trim()).filter(Boolean) : [],
      };
      if (editingId) {
        await hotelsAPI.updateHotel(editingId, payload);
      } else {
        await hotelsAPI.createHotel(payload);
      }
      setDialogOpen(false);
      await fetchHotels();
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteHotel = async (id) => {
    if (!confirm('Delete this hotel?')) return;
    try {
      await hotelsAPI.deleteHotel(id);
      await fetchHotels();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Admin - Manage Hotels</Typography>
        <Button startIcon={<Add />} variant="contained" color="primary" onClick={openCreate}>Add Hotel</Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Price/Night</TableCell>
              <TableCell>Available</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.map((h) => (
              <TableRow key={h.id} hover>
                <TableCell>{h.name}</TableCell>
                <TableCell>{h.city}</TableCell>
                <TableCell>{h.country}</TableCell>
                <TableCell>${h.price_per_night}</TableCell>
                <TableCell>{h.available_rooms}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEdit(h)} color="primary"><Edit /></IconButton>
                  <IconButton onClick={() => deleteHotel(h.id)} color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit Hotel' : 'Add Hotel'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" name="name" fullWidth value={form.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="City" name="city" fullWidth value={form.city} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address" name="address" fullWidth value={form.address} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="State" name="state" fullWidth value={form.state} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Country" name="country" fullWidth value={form.country} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Zip Code" name="zip_code" fullWidth value={form.zip_code} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone" name="phone" fullWidth value={form.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" type="email" fullWidth value={form.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Website" name="website" fullWidth value={form.website} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Rating" name="rating" type="number" inputProps={{ step: 0.1, min: 0, max: 5 }} fullWidth value={form.rating} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Price per Night" name="price_per_night" type="number" fullWidth value={form.price_per_night} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Total Rooms" name="total_rooms" type="number" fullWidth value={form.total_rooms} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Available Rooms" name="available_rooms" type="number" fullWidth value={form.available_rooms} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" name="description" fullWidth multiline minRows={3} value={form.description} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Amenities (comma separated)" name="amenities" fullWidth value={form.amenities} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Image URLs (comma separated)" name="images" fullWidth value={form.images} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveHotel}>{editingId ? 'Save Changes' : 'Create Hotel'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}


