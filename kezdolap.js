import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  IconButton, 
  FormGroup, 
  FormControlLabel, 
  Switch, 
  Box,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Card,
  Dialog,
  CardContent,
  Stack,
  Container,
  Style
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo2 from './logo2.png';
import polok from './polok.png';
import pulcsik from './pulcsik.png';
import gatyak from './gatyak.png';
import Footer from './footer';
import Menu from './menu2';
import { useInView } from 'react-intersection-observer';




import { useNavigate } from 'react-router-dom';
  const Home = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [sideMenuActive, setSideMenuActive] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [wonPrize, setWonPrize] = useState('')
    const [spinComplete, setSpinComplete] = useState(false);
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);
   



    
    

    const [ref, inView] = useInView({
      threshold: 0.2,
      triggerOnce: true
    });


    const [initialPosition, setInitialPosition] = useState({
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    });

    useEffect(() => {
      const updatePosition = () => {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        setInitialPosition({
          top: `${viewportHeight / 2}px`,
          left: `${viewportWidth / 2}px`,
          transform: 'translate(-50%, -50%)'
        });
      };
    
      updatePosition();
      window.addEventListener('resize', updatePosition);
    
      return () => window.removeEventListener('resize', updatePosition);
    }, []);
    
    

    const prizes = [
      { option: 'Nincs nyeremény', style: { backgroundColor: '#34495E', textColor: '#fff' }},
      { option: '10% kedvezmény', style: { backgroundColor: '#2ECC71', textColor: '#fff' }},
      { option: '5% kedvezmény', style: { backgroundColor: '#34495E', textColor: '#fff' }},
      { option: '25% kedvezmény', style: { backgroundColor: '#2ECC71', textColor: '#fff' }},
      { option: '20% kedvezmény', style: { backgroundColor: '#34495E', textColor: '#fff' }},
      { option: '15% kedvezmény', style: { backgroundColor: '#2ECC71', textColor: '#fff' }}
    ];
    
    const saveCouponToDatabase = async (coupon) => {
      const userData = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await fetch('http://localhost:4000/update-coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userData.email,
            coupon: coupon
          })
        });
        if (response.ok) {
          userData.kupon = coupon;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Kupon mentési hiba:', error);
      }
    };
    
    const CouponAlert = ({ open, onClose, darkMode }) => {
      const [currentPrize, setCurrentPrize] = useState('');
      const [isSpinning, setIsSpinning] = useState(false);
  ;
    
  const spinCoupon = () => {
    setIsSpinning(true);
    let spins = 0;
    const maxSpins = 30;
    const interval = setInterval(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)].option;
      setCurrentPrize(randomPrize);
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(interval);
        const finalPrize = prizes[Math.floor(Math.random() * prizes.length)].option;
        
        // Update user data with both prize and spin status
        const user = JSON.parse(localStorage.getItem('user'));
        user.hasWonPrize = true;
        user.hasSpun = true; // Add this flag
        user.kupon = finalPrize;
        delete user.isNewRegistration;
        localStorage.setItem('user', JSON.stringify(user));
  
        setCurrentPrize(finalPrize);
        setWonPrize(finalPrize);
        setShowWelcomeDialog(false);
        
        setTimeout(() => {
          setIsSpinning(false);
          setTimeout(() => {
            saveCouponToDatabase(finalPrize);
            setShowSuccessAlert(true);
            onClose();
          }, 800);
        }, 10);
      }
    }, 100);
  };
  
    
      return (
        <Dialog
          open={open}
          sx={{
            '& .MuiDialog-paper': {
              backgroundColor: darkMode ? '#1E1E1E' : '#fff',
              borderRadius: '25px',
              padding: '3rem',
              minWidth: '450px',
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-out',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(-20px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#60BA97', 
              mb: 3,
              animation: 'slideDown 0.5s ease-out',
              '@keyframes slideDown': {
                from: { opacity: 0, transform: 'translateY(-20px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            Nyerj Kedvezményt!
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              color: darkMode ? '#fff' : '#333', 
              mb: 4,
              transition: 'all 0.3s ease',
              transform: isSpinning ? 'scale(1.1)' : 'scale(1)',
              animation: isSpinning ? 'pulse 0.5s infinite alternate' : 'none',
              '@keyframes pulse': {
                from: { opacity: 0.8, transform: 'scale(1)' },
                to: { opacity: 1, transform: 'scale(1.1)' }
              }
            }}
          >
            {isSpinning ? currentPrize : 'Kattints a sorsoláshoz!'}
          </Typography>
    
          <Button
            onClick={spinCoupon}
            disabled={isSpinning}
            sx={{
              background: 'linear-gradient(45deg, #60BA97, #4e9d7e)',
              padding: '15px 40px',
              color: '#fff',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 20px rgba(96,186,151,0.4)'
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, #60BA97, #4e9d7e)',
                opacity: 0.7
              }
            }}
          >
            {isSpinning ? 'Sorsolás...' : 'Sorsol'}
          </Button>
    
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: darkMode ? '#60BA97' : '#4e9d7e',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'rotate(90deg)',
                color: '#60BA97'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Dialog>
        
      );
    };
    
    
    
    useEffect(() => {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        // Only show welcome dialog if new registration AND hasn't spun yet
        if (user.isNewRegistration && !user.hasSpun) {
          setShowWelcomeDialog(true);
        }
      }
    }, []);
    
  
    const handleSpinComplete = (prize) => {
      setSpinComplete(true);
      setShowWelcomeDialog(false);
      // Itt kezeljük a nyereményt
      const user = JSON.parse(localStorage.getItem('user'));
      user.hasWonPrize = true;
      delete user.isNewRegistration;
      localStorage.setItem('user', JSON.stringify(user));
    };
  
   
    
    
    const images = [
      {
        img: polok,
        title: "Új kollekció érkezett!",
        subtitle: "Fedezd fel a legújabb pólóinkat és találd meg a stílusodhoz illőt!",
        imageStyle: {} 
      },
      {
        img: gatyak,
        title: "Nyári kollekció",
        subtitle: "Könnyű, szellős darabok a meleg napokra",
        imageStyle: { transform: 'translateY(-50px)' }
      },
      {
        img: pulcsik,
        title: "Limitált széria",
        subtitle: "Szerezd meg egyedi darabjainkat, amíg készleten vannak",
        imageStyle: {}
      }
    ];

    const styles = {
      root: {
        overflowX: 'hidden',  // Prevents horizontal scrolling
        width: '100%',
        position: 'relative'
      }
    };

    

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event = {}) => {
      if (event.target && anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };

    const handleListKeyDown = (event) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const handleLogout = () => {
      setShowLogoutAlert(true);
      setOpen(false);
    };
    
    const confirmLogout = () => {
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setShowLogoutAlert(false);
      navigate('/sign');
    };

    const toggleSideMenu = () => {
      setSideMenuActive((prev) => !prev);
    };

    const handleCartClick = () => {
      navigate('/kosar');
    };

    useEffect(() => {
      images.forEach(image => {
        const img = new Image();
        img.src = image.img;
      });
    }, []);

    useEffect(() => {
      if (sideMenuActive) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }, [sideMenuActive]);

    useEffect(() => {
      const checkLoginStatus = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setIsLoggedIn(true);
          setUserName(user.username || user.felhasznalonev || 'Felhasználó');
        }
      };
      checkLoginStatus();
    }, []);
      const [isAnimating, setIsAnimating] = useState(false);

      useEffect(() => {
        const timer = setInterval(() => {
          if (!isAnimating) {
            setIsAnimating(true);
      
            const imageElement = document.getElementById('slideImage');
            const textElement = document.getElementById('slideText');
      
            if (imageElement && textElement) {
              // Kicsúszás
              imageElement.style.animation = 'slideOutLeft 1.5s ease-in-out';
              textElement.style.animation = 'slideOutRight 1.5s ease-in-out';
        
              // Váltás és becsúszás
              setTimeout(() => {
                setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
          
                requestAnimationFrame(() => {
                  imageElement.style.animation = 'slideInLeft 1.5s ease-in-out';
                  textElement.style.animation = 'slideInRight 1.5s ease-in-out';
            
                  setTimeout(() => {
                    setIsAnimating(false);
                  }, 1500);
                });
              }, 1500);
            }
          }
        }, 4500);

        
        
        
        
        
        return () => clearInterval(timer);
      }, [isAnimating]);  

    return (

// A fő div-nél adjuk hozzá a transition tulajdonságot:
<div style={{
  backgroundColor: darkMode ? '#333' : '#f5f5f5',
  backgroundImage: darkMode 
    ? 'radial-gradient(#444 1px, transparent 1px)'
    : 'radial-gradient(#e0e0e0 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  color: darkMode ? 'white' : 'black',
  minHeight: '100vh',
  transition: 'all 0.3s ease-in-out' // Ez adja az átmenetet
}}>


        

        <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: sideMenuActive ? 0 : '-250px',
          width: '250px',
          height: '100%',
          backgroundColor: '#fff',
          boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.2)',
          zIndex: 1200,
          transition: 'left 0.1s ease-in-out',
        }}
      >
        <IconButton
          onClick={toggleSideMenu}
          sx={{
            position: 'absolute',
            zIndex: 1300,
            top: '10px',
            right: '10px',
          }}
        >
          <CloseIcon />
        </IconButton>
        <Menu sideMenuActive={sideMenuActive} toggleSideMenu={toggleSideMenu} />
      </Box>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: darkMode ? '#333' : '#333',
          padding: '10px 20px',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <IconButton
          onClick={toggleSideMenu}
          style={{ color: darkMode ? 'white' : 'white' }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h1"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 'bold',
            fontSize: '2rem',
            color: darkMode ? 'white' : 'white',
            margin: 0,
          }}
        >
          Adali Clothing
        </Typography>
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
           <IconButton
  onClick={handleCartClick}
  sx={{
    color: '#fff',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }
  }}
>
  <ShoppingCartIcon />
</IconButton>

<Button
                  ref={anchorRef}
                  onClick={handleToggle}
                  sx={{
                    color: '#fff',
                    zIndex: 1300,
                    border: '1px solid #fff',
                    borderRadius: '5px',
                    padding: '5px 10px',
                  }}
                >
                  Profil
                </Button>
                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  placement="bottom-start"
                  transition
                  disablePortal
                  sx={{ zIndex: 1300 }}  // Ez az érték magasabb mint a dark mode switch z-indexe
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === 'bottom-start' ? 'left top' : 'left bottom',
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                            <MenuItem onClick={handleClose}>{userName} profilja</MenuItem>
                            <MenuItem onClick={() => {
      handleClose();
      navigate('/fiokom');
    }}>
      Fiókom
    </MenuItem>
                            <MenuItem onClick={handleLogout}>Kijelentkezés</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>
            ) : (
              <>
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
              </>
            )}
          </Box>
        </div>

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
              defaultChecked
              color="default"
              sx={{
                color: 'black',
              }}
              checked={darkMode}
              onChange={() => setDarkMode((prev) => !prev)}
            />
          }
          label="Dark Mode"
        />
      </FormGroup>

      <div
        style={{
          textAlign: 'center',
          padding: '40px',
        }}
      >
        <Typography
          variant="h1"
          style={{
            fontSize: '36px',
          }}
        >
          Üdvözlünk az Adali Clothing Webáruházban
        </Typography>
      </div>



      <div 
  ref={ref}
  style={{
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    opacity: 0,
    transform: 'translateY(50px)',
    animation: inView ? 'fadeInUp 0.8s forwards' : 'none'
  }}
>
  <Card
    sx={{
      flex: '1 1 300px',
      maxWidth: '600px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: darkMode ? '#555' : '#fff',
      borderRadius: '10px',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: darkMode 
          ? '0 20px 40px rgba(0,0,0,0.4)'
          : '0 20px 40px rgba(0,0,0,0.2)',
      }
    }}
  >
          <Link to="/vinted">
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={logo2}
                alt="Vinted"
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
          </Link>
         

          <Typography
            variant="body1"
            style={{
              fontSize: '18px',
              padding: '10px',
              color: 'white',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              marginTop: '10px',
            }}
          >
            Nézd meg a felhasználók által feltöltött termékeket!
          </Typography>
          </Card>
        

          <Card
    sx={{
      flex: '1 1 300px',
      maxWidth: '600px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: darkMode ? '#555' : '#fff',
      borderRadius: '10px',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: darkMode 
          ? '0 20px 40px rgba(0,0,0,0.4)'
          : '0 20px 40px rgba(0,0,0,0.2)',
      }
    }}
  >
          <Link to="/oterm">
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={logo2}
                alt="All Products"
                style={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>
          </Link>
          <Typography
            variant="body1"
            style={{
              fontSize: '18px',
              padding: '10px',
              color: 'white',
              textAlign: 'center',
              transition: 'transform 0.3s ease',
              marginTop: '10px',
            }}
          >
            Nézd meg az összes termékünket
          </Typography>
          </Card>
          <Card
    sx={{
      flex: '1 1 300px',
      maxWidth: '600px',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: darkMode ? '#555' : '#fff',
      borderRadius: '10px',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: darkMode 
          ? '0 20px 40px rgba(0,0,0,0.4)'
          : '0 20px 40px rgba(0,0,0,0.2)',
      }
    }}
  >
            <Link to="/add">
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={logo2}
                  alt="Upload"
                  style={{
                    width: '100%',
                    height: '500px',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
            </Link>
            <Typography
              variant="body1"
              style={{
                fontSize: '18px',
                padding: '10px',
                color: 'white',
                textAlign: 'center',
                transition: 'transform 0.3s ease',
                marginTop: '10px',
              }}
            >
              Töltsd fel a ruháidat
            </Typography>
          
          </Card>
          </div>
        <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    '& > div': {
      transform: 'translateY(50px)',
      opacity: 0,
      animation: 'slideUp 0.6s forwards',
      '&:nth-of-type(2)': {
        animationDelay: '0.2s'
      },
      '&:nth-of-type(3)': {
        animationDelay: '0.4s'
      }
    },
    '@keyframes slideUp': {
      to: {
        transform: 'translateY(0)',
        opacity: 1
      }
    }
  }}
>
  <Box 
    id="slideContainer"
    sx={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '90%',
      maxWidth: '1400px',
      margin: '0 auto',
      animation: 'slideIn 1.5s ease-in-out'
    }}
  >
<Box
  id="slideImage"
  component="img"
  src={images[currentImageIndex].img}
  sx={{
    height: '550px',
    width: '550px',
    objectFit: 'cover',
    flex: '0 0 auto',
    position: 'relative',
    left: '50px',
    marginRight: '50px',
    ...images[currentImageIndex].imageStyle
  }}
/><Box
  id="slideText"
  sx={{
    flex: '0 0 500px', // Fixed width for text container
    padding: '40px',
    position: 'relative',
    right: '50px' // Consistent positioning from right
  }}
>
  <Typography variant="h2" sx={{ mb: 3, color: darkMode ? 'white' : 'black', fontSize: '2.5rem' }}>
    {images[currentImageIndex].title}
  </Typography>
  <Typography variant="h4" sx={{ color: darkMode ? 'grey.300' : 'grey.700', fontSize: '1.5rem' }}>
    {images[currentImageIndex].subtitle}
  </Typography>
</Box>
  </Box>

  <style>
  {`
    @keyframes slideInLeft {
      from { 
        transform: translateX(-100%) translateY(${currentImageIndex === 1 ? '-50px' : '0'}); 
        opacity: 0; 
      }
      to { 
        transform: translateX(0) translateY(${currentImageIndex === 1 ? '-50px' : '0'}); 
        opacity: 1; 
      }
    }
    @keyframes slideOutLeft {
      from { 
        transform: translateX(0) translateY(${currentImageIndex === 1 ? '-50px' : '0'}); 
        opacity: 1; 
      }
      to { 
        transform: translateX(-100%) translateY(${currentImageIndex === 1 ? '-50px' : '0'}); 
        opacity: 0; 
      }
    }
      @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
      

  `}
</style>

</Box>

{showLogoutAlert && (
  <Box
  sx={{
    position: 'fixed',
    top: initialPosition.top,
    left: initialPosition.left,
    transform: initialPosition.transform,
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
        transform: initialPosition.transform,
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
            Kijelentkezés
          </Typography>
          <Typography variant="body1" sx={{ color: darkMode ? '#aaa' : '#666' }}>
            Biztosan ki szeretnél jelentkezni?
          </Typography>
        </Box>
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2,
            justifyContent: 'space-between'
          }}
        >
          <Button
            onClick={() => setShowLogoutAlert(false)}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: '12px',
              backgroundColor: darkMode ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.1)',
              color: darkMode ? '#90caf9' : '#1976d2',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(144, 202, 249, 0.2)' : 'rgba(25, 118, 210, 0.2)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Mégse
          </Button>
          <Button
            onClick={confirmLogout}
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: '12px',
              background: darkMode 
              ? 'linear-gradient(45deg, #90caf9, #42a5f5)' 
              : 'linear-gradient(45deg, #1976d2, #1565c0)',
              color: '#fff',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              }
            }}
          >
            Kijelentkezés
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Box>
)}

 


<CouponAlert 
  open={showWelcomeDialog} 
  onClose={() => setShowWelcomeDialog(false)}
  darkMode={darkMode}
/>

<Dialog
  open={showSuccessAlert}
  onClose={() => setShowSuccessAlert(false)}
  sx={{
    '& .MuiDialog-paper': {
      backgroundColor: darkMode ? '#1E1E1E' : '#fff',
      borderRadius: '25px',
      padding: '2rem',
      minWidth: '400px',
      textAlign: 'center',
      animation: 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      '@keyframes popIn': {
        '0%': { transform: 'scale(0.8)', opacity: 0 },
        '100%': { transform: 'scale(1)', opacity: 1 }
      }
    }
  }}
>
  <Typography variant="h5" sx={{ color: '#60BA97', mb: 2 }}>
    Gratulálunk!
  </Typography>
  <Typography variant="body1" sx={{ color: darkMode ? '#fff' : '#333', mb: 3 }}>
    Nyereményed: {wonPrize}
  </Typography>
  <Button
    onClick={() => setShowSuccessAlert(false)}
    sx={{
      background: 'linear-gradient(45deg, #60BA97, #4e9d7e)',
      color: '#fff',
      '&:hover': { transform: 'scale(1.05)' }
    }}
  >
    Rendben
  </Button>
</Dialog>

<CouponAlert 
  open={showWelcomeDialog} 
  onClose={() => setShowWelcomeDialog(false)}
  darkMode={darkMode}
  onSpinComplete={handleSpinComplete}
/>

<Footer />

      </div>
    );
};

export default Home;
