import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';


export default function Admin() {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const adminPages = [
    {
      title: 'Felhasználók kezelése',
      description: 'Felhasználói fiókok megtekintése és kezelése',
      icon: <PeopleIcon sx={{ fontSize: 40 }}/>,
      path: '/fadmin',
      color: '#4CAF50'
    },
    {
      title: 'Termékek áttekintése',
      description: 'Összes termék megtekintése és kezelése',
      icon: <ShoppingBasketIcon sx={{ fontSize: 40 }}/>,
      path: '/user',
      color: '#2196F3'
    },
    {
      title: 'Új termék hozzáadása',
      description: 'Új termékek feltöltése az áruházba',
      icon: <AddCircleIcon sx={{ fontSize: 40 }}/>,
      path: '/tadmin',
      color: '#FF9800'
    },
    {
      title: 'Termékek szerkesztése',
      description: 'Meglévő termékek módosítása',
      icon: <EditIcon sx={{ fontSize: 40 }}/>,
      path: '/termadmin',
      color: '#9C27B0'
    },
    {
        title: 'Értékelések kezelése',
        description: 'Felhasználói értékelések megtekintése és moderálása',
        icon: <StarIcon sx={{ fontSize: 40 }}/>,
        path: '/rateadmin',
        color: '#FF4081'  // Pink color to distinguish it
      }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: darkMode ? '#333' : '#f5f5f5',
      backgroundImage: darkMode 
        ? 'radial-gradient(#444 1px, transparent 1px)'
        : 'radial-gradient(#e0e0e0 1px, transparent 1px)',
      backgroundSize: '20px 20px',
      pt: 4
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          sx={{ 
            color: darkMode ? '#fff' : '#333',
            mb: 4,
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          Admin Vezérlőpult
        </Typography>

        <Grid container spacing={4}>
          {adminPages.map((page, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card 
                sx={{
                  height: '100%',
                  backgroundColor: darkMode ? '#444' : '#fff',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 20px ${darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}`,
                    cursor: 'pointer'
                  }
                }}
                onClick={() => navigate(page.path)}
              >
                <CardContent sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  p: 4
                }}>
                  <Box sx={{
                    backgroundColor: page.color,
                    borderRadius: '50%',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    {page.icon}
                  </Box>
                  <Typography variant="h5" sx={{ color: darkMode ? '#fff' : '#333' }}>
                    {page.title}
                  </Typography>
                  <Typography sx={{ color: darkMode ? '#ccc' : '#666', textAlign: 'center' }}>
                    {page.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button
          onClick={() => navigate('/')}
          variant="contained"
          sx={{
            mt: 4,
            mb: 4,
            bgcolor: darkMode ? '#555' : '#333',
            '&:hover': {
              bgcolor: darkMode ? '#666' : '#444'
            }
          }}
        >
          Vissza a főoldalra
        </Button>
      </Container>
    </Box>
  );
}
