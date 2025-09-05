import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, Container, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HotelIcon from '@mui/icons-material/Hotel';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar position="static" sx={{ width: '100%', boxShadow: '0 6px 18px rgba(27, 67, 50, 0.18)' }}>
      <Container maxWidth="xl" sx={{ width: '100%' }}>
        <Toolbar sx={{ px: { xs: 0, sm: 1 } }}>
          <HotelIcon sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }} />
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 700
            }}
          >
            Hotel Reservation
          </Typography>
          
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={toggleMobileMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              
              {mobileMenuOpen && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(180deg, rgba(27,67,50,0.98) 0%, rgba(45,106,79,0.98) 100%)',
                    zIndex: 1000,
                    py: 2,
                    px: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {(!isAuthenticated || !user?.is_admin) && (
                      <Button 
                        color="inherit" 
                        component={Link} 
                        to="/hotels"
                        fullWidth
                        sx={{ justifyContent: 'flex-start', color: 'common.white' }}
                      >
                        Hotels
                      </Button>
                    )}
                    
                    {isAuthenticated ? (
                      <>
                        {user?.is_admin && (
                          <Button 
                            color="inherit" 
                            component={Link} 
                            to="/admin"
                            fullWidth
                            sx={{ justifyContent: 'flex-start', color: 'common.white' }}
                          >
                            Admin
                          </Button>
                        )}
                        {!user?.is_admin && (
                          <Button 
                            color="inherit" 
                            component={Link} 
                            to="/my-bookings"
                            fullWidth
                            sx={{ justifyContent: 'flex-start', color: 'common.white' }}
                          >
                            My Bookings
                          </Button>
                        )}
                        <Button 
                          color="inherit" 
                          onClick={handleLogout}
                          fullWidth
                          sx={{ justifyContent: 'flex-start', color: 'common.white' }}
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          color="inherit" 
                          component={Link} 
                          to="/login"
                          fullWidth
                          sx={{ justifyContent: 'flex-start', color: 'common.white' }}
                        >
                          Login
                        </Button>
                        <Button 
                          color="inherit" 
                          component={Link} 
                          to="/register"
                          fullWidth
                          sx={{ justifyContent: 'flex-start', color: 'common.white' }}
                        >
                          Register
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isAuthenticated || !user?.is_admin ? (
                <Button color="inherit" component={Link} to="/hotels" sx={{ px: 2 }}>
                  Hotels
                </Button>
              ) : null}
              
              {isAuthenticated ? (
                <>
                  {user?.is_admin && (
                    <Button color="inherit" component={Link} to="/admin" sx={{ px: 2 }}>
                      Admin
                    </Button>
                  )}
                  {!user?.is_admin && (
                    <Button color="inherit" component={Link} to="/my-bookings" sx={{ px: 2 }}>
                      My Bookings
                    </Button>
                  )}
                  <Avatar
                    onClick={handleMenu}
                    sx={{ cursor: 'pointer', bgcolor: 'secondary.main', width: 36, height: 36, ml: 1 }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>
                      <Typography>Welcome, {user?.name}</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login" sx={{ px: 2 }}>
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register" sx={{ px: 2 }}>
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
