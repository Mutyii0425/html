import React, { useState, useEffect, useRef } from 'react';

import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import logo from './logo02.png';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Card, CardContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Dialog } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`; 
};

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);



  const dvdLogoRef = useRef({
    x: 90,
    y: 90,
    width: 150,
    height: 150,
    dx: 2,
    dy: 2,
    color: randomColor(),
  });

  useEffect(() => {
    const canvas = document.getElementById('dvdCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image(); 
    img.src = logo; 
    
    let animationFrameId;
    let isComponentMounted = true;
    
    const handleResize = () => {
      if (isComponentMounted) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
  
    const update = () => {
      if (!isComponentMounted) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      
      const radius = dvdLogoRef.current.width / 2;
      const centerX = dvdLogoRef.current.x + radius;
      const centerY = dvdLogoRef.current.y + radius;
      
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.clip();
      
      ctx.drawImage(
        img,
        dvdLogoRef.current.x,
        dvdLogoRef.current.y,
        dvdLogoRef.current.width,
        dvdLogoRef.current.height
      );
      
      ctx.restore();
      
      dvdLogoRef.current.x += dvdLogoRef.current.dx;
      dvdLogoRef.current.y += dvdLogoRef.current.dy;
      
      if (dvdLogoRef.current.x <= 0 || dvdLogoRef.current.x + dvdLogoRef.current.width >= canvas.width) {
        dvdLogoRef.current.dx *= -1;
      }
      
      if (dvdLogoRef.current.y <= 0 || dvdLogoRef.current.y + dvdLogoRef.current.height >= canvas.height) {
        dvdLogoRef.current.dy *= -1;
      }
      
      animationFrameId = requestAnimationFrame(update);
    };
  
    img.onload = update;
  
    return () => {
      isComponentMounted = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      const canvas = document.getElementById('dvdCanvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, []);

  
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);
  const navigate = useNavigate();
     
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({
          ...data.user,
          isNewRegistration: true
        }));
        setShowRegistrationSuccess(true);
        setTimeout(() => {
          navigate('/kezdolap');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? '#555' : '#f5f5f5', // Dark mode background vs light mode background
        color: darkMode ? 'white' : 'black', // Text color adjustment for dark and light modes
        height: '100vh',
        zIndex: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#333',
          color: '#fff',
          padding: '10px 20px',
        }}
      >
        <IconButton sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h1"
        sx={{
          position: 'absolute',
          top: '3.5%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: 'bold',
          fontSize: '2rem',
          textAlign: 'center',
          color: darkMode ? 'white' : 'white',}}>
          Adali Clothing
       
      </Typography>
        <Box sx={{ display: 'flex', gap: '10px' }}>
        <Button
            component={Link}
            to="/sign"
            sx={{
              color: '#fff',
              border: '1px solid #fff',
              borderRadius: '5px',
              padding: '5px 10px',
              '&:hover': {
                backgroundColor: '#fff',
                color: '#333',
              },
            }}
          >
            Sign In
          </Button>
          <Button
            component={Link}
            to="/signup"
            sx={{
              color: '#fff',
              border: '1px solid #fff',
              borderRadius: '5px',
              padding: '5px 10px',
              '&:hover': {
                backgroundColor: '#fff',
                color: '#333',
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>

   
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Box
          id="form-box"
         
          sx={{

            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? 'white' : 'black',
            width: '100%',
            position: 'relative',
            border: darkMode ? '' : '2px solid black',
          }}
        >
          <TextField
            label="Név"
            variant="outlined"
            name="name"
            required
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              style: { color: darkMode ? 'white' : 'black' },
            }}
            InputLabelProps={{
              style: { color: darkMode ? 'white' : 'black' },
            }}
            sx={{
              '& input': {
                backgroundColor: darkMode ? '#333' : '#fff',
              },
            }}
          />
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            name="email"
            required
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: { color: darkMode ? 'white' : 'black' },
            }}
            InputLabelProps={{
              style: { color: darkMode ? 'white' : 'black' },
            }}
            sx={{
              '& input': {
                backgroundColor: darkMode ? '#333' : '#fff',
              },
            }}
          />

          <TextField
            label="Jelszó"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            name="password"
            required
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { color: darkMode ? 'white' : 'black' },
              endAdornment: password && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    style={{ color: 'gray' }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: darkMode ? 'white' : 'black' },
            }}
            sx={{
              '& input': {
                backgroundColor: darkMode ? '#333' : '#fff',
              },
            }}
          />

          <TextField
            label="Jelszó megerősítése"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            name="confirmPassword"
            required
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              style: { color: darkMode ? 'white' : 'black' },
              endAdornment: confirmPassword && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                    style={{ color: 'gray' }}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: darkMode ? 'white' : 'black' },
            }}
            sx={{
              '& input': {
                backgroundColor: darkMode ? '#333' : '#fff',
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 2,
            }}
          >
            <Button
              onClick={handleSubmit}
              type="submit"
              variant="contained"
              style={{ color: darkMode ? 'white' : 'black' }}
              sx={{
                backgroundColor: darkMode ? '#555' : '#ddd',
                border: '2px solid',
                borderColor: darkMode ? 'black' : 'black',
              }}
            >
              Regisztráció
            </Button>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => window.history.back()}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#444',
            alignItems: 'center',
            position: 'absolute',
            top: 12,
            left: 16,
            zIndex: 1000,
            transition: 'background-color 0.3s ease',
            '&:hover': {
              backgroundColor: '#666',
              transform: 'scale(1.05)',
            },
          }}
        >
          <ArrowBackIcon sx={{ marginRight: 1 }} />
        </Button>

        <FormGroup
          sx={{
            position: 'absolute',
            top: 60,
            right: 20,
          }}
        >
          <FormControlLabel
            control={
              <Switch
              color="default"
              sx={{ color: 'black' }}
              checked={darkMode}  // Keep the checked prop
              onChange={() => setDarkMode((prev) => !prev)}
          />
            }
            label="Dark Mode"
          />
        </FormGroup>

        <canvas
          id="dvdCanvas"
          style={{
            position: 'absolute',
            zIndex: -1,
            width: '104%',
            height: '100%',
            bottom: '',
            top: '4%',
          }}
        />
        
      </Container>
      <Dialog
  open={showRegistrationSuccess}
  sx={{
    '& .MuiDialog-paper': {
      backgroundColor: darkMode ? '#1E1E1E' : '#fff',
      borderRadius: '25px',
      padding: '3rem',
      minWidth: '450px',
      textAlign: 'center',
      boxShadow: darkMode 
        ? '0 8px 32px rgba(96,186,151,0.3)' 
        : '0 8px 32px rgba(0,0,0,0.2)',
      border: '2px solid',
      borderColor: darkMode ? '#60BA97' : '#4e9d7e',
      position: 'relative',
      overflow: 'hidden'
    }
  }}
>
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #60BA97, #4e9d7e)',
      animation: 'loadingBar 2s ease-in-out',
      '@keyframes loadingBar': {
        '0%': { width: '0%' },
        '100%': { width: '100%' }
      }
    }}
  />
  <Box sx={{ position: 'relative' }}>    
    <Typography 
      variant="h4" 
      sx={{ 
        color: darkMode ? '#60BA97' : '#4e9d7e',
        mb: 3,
        fontWeight: 800,
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}
    >
      Sikeres regisztráció!
    </Typography>
    
    <Typography 
      variant="h6" 
      sx={{ 
        color: darkMode ? '#fff' : '#333',
        mb: 4,
        fontWeight: 400,
        lineHeight: 1.6
      }}
    >
      Köszönjük, hogy csatlakoztál az Adali Clothing közösségéhez!
    </Typography>
  </Box>
</Dialog>


    </div>
  );
}