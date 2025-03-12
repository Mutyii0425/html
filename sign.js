import React, { useState, useEffect, useRef } from 'react';
import Menu from './menu';
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
import { Card, CardContent } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`; 
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [email, setEmail] = useState(''); // E-mail hozzáadása

  const navigate = useNavigate();

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
    let isComponentMounted = true;  // Új flag a komponens életciklusának követésére
    
    const handleResize = () => {
      if (isComponentMounted) {  // Csak akkor frissítünk, ha a komponens még él
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
  
    handleResize();
    window.addEventListener('resize', handleResize);
  
    const update = () => {
      if (!isComponentMounted) return;  // Ha már unmounted, nem futtatjuk tovább
      
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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setErrorMessage(data.error);
        setErrorAlert(true);
        setTimeout(() => setErrorAlert(false), 3000);
        return;
      }
  
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoggedInUsername(data.user.username);
        setSuccessAlert(true);
        setTimeout(() => {
          setSuccessAlert(false);
          navigate('/kezdolap');
        }, 2000);
      }
  
    } catch (error) {
      setErrorMessage('Szerverhiba történt!');
      setErrorAlert(true);
      setTimeout(() => setErrorAlert(false), 3000);
    }
  };
  
  
  

  return (
    <div
      style={{
        backgroundColor: darkMode ? '#555' : '#f5f5f5',
        color: darkMode ? 'white' : 'black',
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

      <Menu />
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '35%',
        }}
      >
        <Box
          id="form-box"
          sx={{
            padding: 3,
            borderRadius: 3,
            boxShadow: 2,
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? 'white' : 'black',
            width: '100%',
            position: 'relative',
            border: darkMode ? 'black' : 'black',
          }}
        >
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            name="email"
            required
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // E-mail kezelés
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

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 2,
            }}
          >
            <Button
              onClick={handleLogin}
              type="submit"
              variant="contained"
              style={{ color: darkMode ? 'white' : 'black' }}
              sx={{
                backgroundColor: darkMode ? '#555' : '#ddd',
                border: '2px solid',
                borderColor: 'black',
              }}
            >
              Bejelentkezés
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
            zIndex: 1,
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
                sx={{
                  color: 'black',
                }}
                checked={darkMode} // Csak ezt használd
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
            top: '4%',
          }}
        />
        {successAlert && (
  <Box
    sx={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1400,
      animation: 'popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      '@keyframes popIn': {
        '0%': {
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.5)',
        },
        '50%': {
          transform: 'translate(-50%, -50%) scale(1.05)',
        },
        '100%': {
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)',
        },
      },
    }}
  >
    <Card
      sx={{
        minWidth: 350,
        backgroundColor: darkMode ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        color: darkMode ? '#fff' : '#000',
        boxShadow: darkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
          : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #00C853, #B2FF59)',
          animation: 'loadingBar 2s ease-in-out',
          '@keyframes loadingBar': {
            '0%': { width: '0%' },
            '100%': { width: '100%' }
          }
        }}
      />
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              mb: 1,
              background: darkMode 
                ? 'linear-gradient(45deg, #90caf9, #42a5f5)' 
                : 'linear-gradient(45deg, #1976d2, #1565c0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
          Üdvözlünk újra, {loggedInUsername}!
          </Typography>
          <Typography variant="body1" sx={{ color: darkMode ? '#aaa' : '#666' }}>
            Sikeres bejelentkezés
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Box>
)}


{errorAlert && (
  <Box
    sx={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1400,
      animation: 'popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      '@keyframes popIn': {
        '0%': {
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.5)',
        },
        '50%': {
          transform: 'translate(-50%, -50%) scale(1.05)',
        },
        '100%': {
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)',
        },
      },
    }}
  >
    <Card
      sx={{
        minWidth: 350,
        backgroundColor: darkMode ? 'rgba(45, 45, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        color: darkMode ? '#fff' : '#000',
        boxShadow: darkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
          : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #FF5252, #FF1744)',
          animation: 'loadingBar 3s ease-in-out',
          '@keyframes loadingBar': {
            '0%': { width: '0%' },
            '100%': { width: '100%' }
          }
        }}
      />
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              mb: 1,
              background: darkMode 
                ? 'linear-gradient(45deg, #FF5252, #FF1744)' 
                : 'linear-gradient(45deg, #D32F2F, #C62828)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Bejelentkezési hiba!
          </Typography>
          <Typography variant="body1" sx={{ color: darkMode ? '#aaa' : '#666' }}>
            {errorMessage}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Box>
)}
      </Container>
    </div>
  );
}