import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  Badge
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '../menu2';

export default function Fadmin() {
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [sideMenuActive, setSideMenuActive] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log('Hiba:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirmation = window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?");
    
    if (confirmation) {
      try {
        const response = await fetch(`http://localhost:5000/users/${userId}`, {
          method: 'DELETE'
        });
      
        if (response.ok) {
          setUsers(users.filter(user => user.f_azonosito !== userId));
        }
      } catch (error) {
        console.log('Törlési hiba:', error);
      }
    }
  };

  const toggleSideMenu = () => {
    setSideMenuActive(!sideMenuActive);
  };



  return (
    <Box sx={{ backgroundColor: darkMode ? '#333' : '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333',
        padding: '10px 20px',
        position: 'relative',
      }}>
        <IconButton onClick={toggleSideMenu} sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h1" sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 'bold',
          fontSize: '2rem',
          color: 'white',
        }}>
          Adali Clothing
        </Typography>

       
          
        
      </Box>

      <Box sx={{
        position: 'fixed',
        top: 0,
        left: sideMenuActive ? 0 : '-250px',
        width: '250px',
        height: '100%',
        backgroundColor: '#fff',
        transition: 'left 0.3s',
        zIndex: 1200,
      }}>
        <Menu sideMenuActive={sideMenuActive} toggleSideMenu={toggleSideMenu} />
      </Box>

      <FormGroup sx={{ position: 'absolute', top: 60, right: 20 }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="primary"
            />
          }
          label="Dark Mode"
        />
      </FormGroup>

      <Container sx={{ pt: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, color: darkMode ? 'white' : 'black' }}>
          Felhasználók Kezelése
        </Typography>

        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.f_azonosito}>
              <Card sx={{ 
                backgroundColor: darkMode ? '#444' : 'white',
                color: darkMode ? 'white' : 'black'
              }}>
                <CardContent>
                  <Typography variant="h6">
                    {user.felhasznalonev || 'Névtelen felhasználó'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Email: {user.email}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      onClick={() => handleDelete(user.f_azonosito)}
                      sx={{
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        '&:hover': { backgroundColor: 'red', color: 'white' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button
                    onClick={() => navigate('/admin')}
                    variant="contained"
                    sx={{ 
                      mt: 4,
                      mb: 3,
                      bgcolor: '#333',
                      '&:hover': {
                        bgcolor: '#555'
                      }
                    }}
                  >
                    Vissza az admin felületre
                  </Button>
      </Container>
    </Box>
  );
}