import express from 'express';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config({ path: './backend.env' });

// Database connection
const db = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'webshoppp',
  password: process.env.DB_PASS || 'Premo900',
  database: process.env.DB_NAME || 'webshoppp'
});

console.log('Connected to database');

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 🔹 Regisztráció
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const [users] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (users.length > 0) {
      return res.status(400).json({ error: 'Ez az email már regisztrálva van!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO user (felhasznalonev, email, jelszo) VALUES (?, ?, ?)', [name, email, hashedPassword]);

    // Küldjük vissza a newUser flag-et
    res.status(201).json({ 
      message: 'Sikeres regisztráció!',
      user: {
        username: name,
        email: email,
        newUser: true  // Ez jelzi, hogy új regisztráció történt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Adatbázis hiba!' });
  }
});


console.log('Database connection:', db);

app.post('/update-coupon', async (req, res) => {
  const { email, coupon } = req.body;
  console.log('Beérkezett adatok:', email, coupon);
  
  try {
    // Először lekérjük a felhasználót
    const [user] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    console.log('Talált felhasználó:', user);

    if (user.length > 0) {
      // Ha van felhasználó, frissítjük a kupont
      const [result] = await db.execute(
        'UPDATE user SET kupon = ? WHERE email = ?', 
        [coupon, email]
      );
      console.log('Frissítés eredménye:', result);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Felhasználó nem található' });
    }
  } catch (error) {
    console.log('Részletes hiba:', error);
    res.status(500).json({ error: 'Adatbázis hiba' });
  }
});



app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.jelszo);
      
      if (isMatch) {
        return res.json({ 
          success: true,
          message: 'Sikeres bejelentkezés!',
          user: {
            username: user.felhasznalonev,
            email: user.email,
            f_azonosito: user.f_azonosito  // Add this line
          }
        });
      }
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Szerver hiba!' });
  }
});






sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-confirmation', async (req, res) => {
  const { email, name, orderId, items, totalPrice, shippingAddress, discount } = req.body;
  
  const itemsList = items.map(item => 
    `- ${item.nev} (${item.mennyiseg} db) - ${item.ar * item.mennyiseg} Ft`
  ).join('\n');

  const msg = {
    to: email,
    from: 'adaliclothing@gmail.com',
    subject: 'Rendelés visszaigazolás - Adali Clothing',
    html: `
      <h2>Kedves ${name}!</h2>
      <p>Köszönjük a rendelését!</p>
      <p>Rendelési azonosító: #${orderId}</p>
      
      <h3>Rendelt termékek:</h3>
      <pre>${itemsList}</pre>
      
      <p>Kedvezmény: ${discount}%</p>
      <p>Végösszeg: ${totalPrice} Ft</p>
      
      <h3>Szállítási cím:</h3>
      <p>${shippingAddress}</p>
    `
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Email küldési hiba' });
  }
});



const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 



