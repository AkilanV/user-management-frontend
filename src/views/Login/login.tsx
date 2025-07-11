import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField,
  Button, Box, Paper, Checkbox, FormControlLabel
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import carImg from '../../assets/Images/bigstock-Car-Service.jpg';
import { axiosInstance } from '../../utils/axiosinstance';


const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

const handleLogin = async () => {
  try {
    const response = await axiosInstance.post('/login', { email, password });
    const token = response.data.token;

    if (token) {
      Cookies.set('_mbname', token, { expires: rememberMe ? 7 : undefined });
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/Dashboard');
    } else {
      enqueueSnackbar('Login failed. Token not received.', { variant: 'error' });
    }
  } catch (error) {
    enqueueSnackbar('Login failed. Please check credentials.', { variant: 'error' });
  }
};


  return (
      <Box
      sx={{
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      backgroundImage: `url(${carImg})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      }}
      >

        <Box
          sx={{
            width: '100%',
            maxWidth: 480,
            mx: 2,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              backdropFilter: 'blur(6px)',
              backgroundColor: 'rgba(255,255,255,0.85)',
              width: '100%',
            }}
          >
            <Box display="flex" flexDirection="column" gap={3}>
              <Typography variant="h4" textAlign="center">Login</Typography>

              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                }
                label="Remember Me"
              />

              <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
                Sign In
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
  );
};

export default Login;
