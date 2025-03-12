import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton, 
  FormGroup, 
  FormControlLabel, 
  Switch ,
  Grid
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '../menu2';


export default function Tadmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nev: '',
    ar: '',
    termekleiras: '',
    kategoria: '',
    imageUrl: '',
    kategoriaId: ''
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = React.useRef(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sideMenuActive, setSideMenuActive] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuActive(!sideMenuActive);
  };

  const kategoriak = [
    { id: 2, name: 'Nadrágok' },
    { id: 4, name: 'Pólók' },
    { id: 5, name: 'Pulóverek' }
  ];

  const handleChange = (e) => {
    if (e.target.name === 'kategoria') {
      const selectedKategoria = kategoriak.find(k => k.name === e.target.value);
      setFormData({
        ...formData,
        kategoria: e.target.value,
        kategoriaId: selectedKategoria.id
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
          
          setSelectedImages(prev => [...prev, compressedImage]);
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedFormData = {
      ...formData,
      imageUrl: selectedImages[0]
    };

    try {
      const response = await fetch('http://localhost:5000/termekek/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData)
      });

      const data = await response.json();
  
      if (data.success) {
        alert('Termék sikeresen hozzáadva!');
        setFormData({
          nev: '',
          ar: '',
          termekleiras: '',
          kategoria: '',
          imageUrl: '',
          kategoriaId: ''
        });
      }
    } catch (error) {
      console.error('Hiba történt:', error);
    }
  };
  return (
    <Box sx={{ backgroundColor: darkMode ? '#333' : '#f5f5f5', minHeight: '100vh' }}>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#333',
      color: 'gray',
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
      color: 'gray',
      backgroundColor: '#fff',
      transition: 'left 0.3s',
      zIndex: 1200,
    }}>
      <Menu sideMenuActive={sideMenuActive} toggleSideMenu={toggleSideMenu} />
    </Box>

    <FormGroup sx={{ position: 'absolute', top: 60, right: 20, color: 'gray' }}>
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
    
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, color: 'gray' }}>
        <Typography variant="h4" sx={{ mb: 4, color: 'gray' }}>
          Új termék hozzáadása
        </Typography>
      
        <Card sx={{ p: 4, color: 'gray' }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column',  color: 'gray', gap: 3 }}>
              <TextField
                name="nev"
                label="Termék neve"
                value={formData.nev}
                onChange={handleChange}
                required
                fullWidth
                sx={{ color: 'gray' }}
              />

              <TextField
                name="ar"
                label="Ár"
                type="number"
                value={formData.ar}
                onChange={handleChange}
                required
                fullWidth
                sx={{ color: 'gray' }}
              />

              <TextField
                name="termekleiras"
                label="Termék leírása"
                multiline                
                rows={4}
                value={formData.termekleiras}
                onChange={handleChange}
                required
                fullWidth
                sx={{ color: 'gray' }}
              />

              <FormControl fullWidth>
                <InputLabel>Kategória</InputLabel>
                <Select
                  name="kategoria"
                  value={formData.kategoria}
                  onChange={handleChange}
                  required
                >
                  {kategoriak.map((kategoria) => (
                    <MenuItem key={kategoria.id} value={kategoria.name}>
                      {kategoria.name} (ID: {kategoria.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
              <InputLabel>Kategória ID</InputLabel>
              <Select
                  name="kategoriaId"
                  value={formData.kategoriaId}
                  onChange={handleChange}
                  required
              >
                  <MenuItem value={2}>2 - Nadrágok</MenuItem>
                  <MenuItem value={4}>4 - Pólók</MenuItem>
                  <MenuItem value={5}>5 - Pulóverek</MenuItem>
              </Select>
              </FormControl>

              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: darkMode ? 'grey.500' : 'grey.300',
                  borderRadius: 2,
                  p: 3,
                  color: 'gray',
                  mb: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  hidden
                  multiple
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                
                {selectedImages && selectedImages.length > 0 ? (
                  <Grid container spacing={2}>
                    {selectedImages.map((image, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box
                          sx={{
                            position: 'relative',
                            height: '200px',
                            color: 'white',
                            width: '100%',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={image}
                            alt={`Feltöltött kép ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography  sx={{ color: 'gray' }}>
                      Húzd ide a képeket vagy kattints a feltöltéshez
                    </Typography>
                  </Box>
                )}
              </Box>

              <Button 
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Termék hozzáadása
              </Button>
            </Box>
          </form>
 
        </Card>
      </Box>
      
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
