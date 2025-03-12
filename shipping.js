import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Dialog, Zoom, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  createTheme,
  ThemeProvider
} from '@mui/material';

export default function Shipping() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { cartItems, totalPrice } = location.state;
  const [discountPercentage, setDiscountPercentage] = useState(0);
const [orderSuccess, setOrderSuccess] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [darkMode, setDarkMode] = useState(true);
const [orderData, setOrderData] = useState({
  nev: '',
  telefonszam: '',
  email: '',
  irsz: '',
  telepules: '',
  kozterulet: ''
});

// Then calculate discount amounts
const discountAmount = Math.round((totalPrice * discountPercentage) / 100);
const finalPrice = totalPrice - discountAmount + 1590;
 
  const handleSubmitOrder = async () => {
    setIsLoading(true);
    try {
      // Create order with discounted price
      const vevoResponse = await fetch('http://localhost:5000/vevo/create', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          vegosszeg: finalPrice // Include discounted final price
        })
      });
  
      const vevoResult = await vevoResponse.json();

      // Rendelések létrehozása minden termékhez
      for (const item of cartItems) {
        await fetch('http://localhost:5000/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            termek: item.id,
            statusz: 'Feldolgozás alatt',
            mennyiseg: item.mennyiseg,
            vevo_id: vevoResult.id
          })
        });
      }

        // Email küldés
        const emailResponse = await fetch('http://localhost:4000/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: orderData.email,
            name: orderData.nev,
            orderId: vevoResult.id,
            items: cartItems,
            totalPrice: finalPrice,
            shippingAddress: `${orderData.irsz} ${orderData.telepules}, ${orderData.kozterulet}`,
            discount: discountPercentage
          })
        });
      

        const emailResult = await emailResponse.json();
        if (emailResult.success) {
          console.log('Email sikeresen elküldve!');
        } else {
          console.error('Hiba az email küldésekor:', emailResult.error);
        }
  
        setOrderSuccess(true);
      
        // További kód...
        localStorage.removeItem('cartItems');
      
        // Átirányítás 3 másodperc után
        setTimeout(() => {
          navigate('/kezdolap');
        }, 3000);
  
      } catch (error) {
        console.error('Rendelési hiba:', error);
        alert('Hiba történt a rendelés során!');
      }
      setIsLoading(false);
    };

 

  // Define textFieldStyle here
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderRadius: 2,
      color: '#fff'
    },
    '& .MuiInputLabel-root': {
      color: '#fff'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.3)'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255,255,255,0.5)'
    }
  };

  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: darkMode ? '#666' : '#333',
              },
              '&.Mui-focused fieldset': {
                borderColor: darkMode ? '#888' : '#444',
              }
            }
          }
        }
      }
    }
  });     
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.kupon) {
        // Extract percentage from coupon string
        const percentage = parseInt(user.kupon.match(/\d+/)[0]);
        setDiscountPercentage(percentage);
      }
    }
  }, []);

  

    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: '100vh',
            background: darkMode 
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
            padding: '40px 0'
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                gap: 4,
                flexDirection: { xs: 'column', md: 'row' }
              }}
            >
              {/* Bal oldali szállítási űrlap */}
              <Card
                elevation={8}
                sx={{
                  flex: 2,
                  backgroundColor: darkMode ? '#333' : '#fff',
                  borderRadius: 3,
                  padding: 4,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    color: darkMode ? '#fff' : '#333',
                    borderBottom: '2px solid',
                    borderColor: darkMode ? '#555' : '#ddd',
                    paddingBottom: 2,
                    marginBottom: 4
                  }}
                >
                  Szállítási adatok
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Név"
                    value={orderData.nev}
                    onChange={(e) => setOrderData({...orderData, nev: e.target.value})}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Telefonszám"
                    value={orderData.telefonszam}
                    onChange={(e) => setOrderData({...orderData, telefonszam: e.target.value})}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={orderData.email}
                    onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Irányítószám"
                    value={orderData.irsz}
                    onChange={(e) => setOrderData({...orderData, irsz: e.target.value})}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Település"
                    value={orderData.telepules}
                    onChange={(e) => setOrderData({...orderData, telepules: e.target.value})}
                    sx={textFieldStyle}
                  />
                  <TextField
                    fullWidth
                    label="Közterület"
                    value={orderData.kozterulet}
                    onChange={(e) => setOrderData({...orderData, kozterulet: e.target.value})}
                    sx={textFieldStyle}
                  />
                </Box>
              </Card>
              {/* Jobb oldali összegzés */}
              <Card
                elevation={8}
                sx={{
                  flex: 1,
                  backgroundColor: darkMode ? '#333' : '#fff',
                  borderRadius: 3,
                  padding: 4,
                  height: 'fit-content',
                  position: 'sticky',
                  top: 20
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: darkMode ? '#fff' : '#333',
                    marginBottom: 3,
                    borderBottom: '2px solid',
                    borderColor: darkMode ? '#555' : '#ddd',
                    paddingBottom: 2
                  }}
                >
                  Rendelés összegzése
                </Typography>

                <Box sx={{ mb: 4 }}>
                  {cartItems.map((item, index) => (
                    <Box 
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 2,
                        padding: 2,
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderRadius: 2
                      }}
                    >
           <Typography sx={{ color: '#fff' }}>
    {item.nev} (x{item.mennyiseg})
    </Typography>

    <Typography sx={{ color: '#fff' }}>
    {(item.ar * item.mennyiseg).toLocaleString()} Ft
    </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: '#fff' }}>Részösszeg:</Typography>
                    <Typography sx={{ color: '#fff' }}>{totalPrice.toLocaleString()} Ft</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ color: '#fff' }}>Szállítási költség:</Typography>
                    <Typography sx={{ color: '#fff' }}>1590 Ft</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
  <Typography sx={{ color: '#fff' }}>Kedvezmény ({discountPercentage}%):</Typography>
  <Typography sx={{ color: '#fff' }}>-{discountAmount.toLocaleString()} Ft</Typography>
</Box>

                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mt: 3,
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      padding: 2,
                      borderRadius: 2
                    }}
                  >
                    <Typography sx={{ color: '#fff' }} variant="h6">Végösszeg:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
  {(totalPrice - discountAmount + 1590).toLocaleString()} Ft
</Typography>

                  </Box>
                </Box>

                <Box sx={{ 
    display: 'flex', 
    gap: 2, 
    mt: 3,
    justifyContent: 'space-between', // Jobb térközök
    alignItems: 'center' // Függőleges középre igazítás
    }}>
    <Button
    variant="outlined"
    size="large"
    startIcon={<ArrowBackIcon />}
    onClick={() => navigate('/kezdolap')}
    sx={{
      width: '40%', // Kisebb szélesség
      py: 1.5,
      borderColor: darkMode ? '#666' : '#333',
      color: darkMode ? '#fff' : '#333',
      '&:hover': {
        borderColor: darkMode ? '#777' : '#444',
        backgroundColor: 'rgba(255,255,255,0.05)',
        transform: 'scale(1.02)'
      },
      transition: 'all 0.3s ease'
    }}
    >
    Vissza
    </Button>

    <Button
    variant="contained"
    size="large"
    onClick={handleSubmitOrder}
    sx={{
      width: '55%', // Nagyobb szélesség
      py: 1.5,
      backgroundColor: darkMode ? '#666' : '#333',
      '&:hover': {
        backgroundColor: darkMode ? '#777' : '#444',
        transform: 'scale(1.02)'
      },
      transition: 'all 0.3s ease'
    }}
    >
    Rendelés véglegesítése
    </Button>
    </Box>
              </Card>
            </Box>
  
            {/* Loading indicator here */}
            {isLoading && (
              <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <CircularProgress />
              </Box>
            )}

            {/* Dialog component */}
            <Dialog
              open={orderSuccess}
              TransitionComponent={Zoom}
              sx={{
                '& .MuiDialog-paper': {
                  backgroundColor: darkMode ? '#333' : '#fff',
                  borderRadius: 3,
                  padding: 4,
                  textAlign: 'center'
                }
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h5" sx={{ color: darkMode ? '#fff' : '#333', mb: 2 }}>
                Köszönjük a rendelését!
              </Typography>
              <Typography sx={{ color: darkMode ? '#ccc' : '#666' }}>
                A rendelés visszaigazolását elküldtük emailben.
              </Typography>
            </Dialog>
          </Container>
        </Box>
      </ThemeProvider>
    )
  
};