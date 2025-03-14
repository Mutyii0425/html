import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#333',
        color: 'white',
        padding: '10px',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        borderTop: '3px solid #ffffff', // Add white border at the top
        boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.2)' // Add subtle shadow for depth
      }}
    >
      <Typography variant="body2">
        © 2025 Adali Clothing. Minden jog fenntartva.
      </Typography>
    </Box>
  );
};

export default Footer;