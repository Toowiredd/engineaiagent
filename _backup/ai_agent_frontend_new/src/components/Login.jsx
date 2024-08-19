import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Container, Alert, Tab, Tabs } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { login, register } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const { login: contextLogin } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      let userData;
      if (tab === 0) {
        userData = await login(username, password);
      } else {
        await register(username, password);
        userData = await login(username, password);
      }
      contextLogin(userData);
      navigate('/');
    } catch (err) {
      setError(tab === 0 ? 'Invalid username or password' : 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {tab === 0 ? 'Sign in' : 'Register'}
        </Typography>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 2 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {tab === 0 ? 'Sign In' : 'Register'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;