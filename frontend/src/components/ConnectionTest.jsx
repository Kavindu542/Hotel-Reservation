import { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, Paper } from '@mui/material';
import { healthAPI } from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  const checkConnection = async () => {
    try {
      setStatus('checking');
      setMessage('Checking backend connection...');
      
      const response = await healthAPI.checkHealth();
      
      setStatus('success');
      setMessage(`Backend is healthy! Status: ${response.status}, Timestamp: ${response.timestamp}`);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      setStatus('error');
      setMessage(`Connection failed: ${error.message}`);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'checking':
        return 'info';
      default:
        return 'info';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'checking':
        return '⏳';
      default:
        return '❓';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Backend Connection Status
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Alert severity={getStatusColor()}>
          {getStatusIcon()} {message}
        </Alert>
      </Box>
      
      {lastChecked && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Last checked: {lastChecked}
        </Typography>
      )}
      
      <Button 
        variant="outlined" 
        onClick={checkConnection}
        disabled={status === 'checking'}
      >
        Test Connection
      </Button>
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Backend URL: http://localhost:5000
      </Typography>
    </Paper>
  );
};

export default ConnectionTest;

