const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; 

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER ||'root',
  password:  process.env.DB_PASSWORD || 'Sai@6303',
  database: process.env.DB_NAME || 'job_tracker',
  port: process.env.DB_PORT || 3306
});


db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});



// Register


app.post('/api/users',async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (
        firstName, lastName, email, password, phoneNumber,
        createdAt, createdBy, updatedAt, updatedBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,  ?)
    `;

    const values = [
      firstName,
      lastName,
      email,
      hashedPassword,
      phoneNumber,
      createdAt,
      createdBy,
      updatedAt,
      updatedBy
    ];

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, message: 'User created successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong while creating user' });
  }
});


app.post('/api/login', (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({ error: 'Phone number and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE phoneNumber = ?';
  db.query(sql, [phoneNumber], async (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }

    const user = results[0];
    console.log('User found:', user);

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid phone number or password' });
      }

      const token = jwt.sign(
        { Id: user.Id, phoneNumber: user.phoneNumber },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ token, userId: user.Id, message: 'Login successful' });
    } catch (compareError) {
      console.error('Password comparison error:', compareError);
      res.status(500).json({ error: 'Something went wrong during login' });
    }
  });
});


// =======================
// AUTH MIDDLEWARE
// =======================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

// =======================
// PROTECTED ROUTES
// =======================


app.get('/api/jobs', (req, res) => {
  db.query('SELECT * FROM jobapplications ORDER BY applicationDate DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

//by id
app.get('/api/jobs/:id', (req, res) => {
  const jobId = req.params.id;

  db.query('SELECT * FROM jobapplications WHERE id = ?', [jobId], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(results[0]);
  });
});



app.post('/api/jobs',  (req, res) => {
  const { companyName, jobTitle, jobLocation, jobType, applicationDate, status, salary, notes ,createdBy=0, updatedBy=0} = req.body;
 

  const sql = `
    INSERT INTO jobapplications 
    (companyName, jobTitle, jobLocation, jobType, applicationDate, status, salary, notes, createdBy, updatedBy) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [companyName, jobTitle, jobLocation, jobType, applicationDate, status, salary, notes,createdBy, updatedBy ], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
});

app.put('/api/jobs/:id',(req, res) => {
  const { companyName,jobTitle,jobLocation,jobType, applicationDate, status,salary, notes} = req.body;
  const sql = 'UPDATE jobapplications SET companyName = ?,jobTitle = ?,jobLocation = ?,jobType = ?, applicationDate = ?, status = ?,salary = ?, notes = ? WHERE id = ?';
  db.query(sql, [ companyName,jobTitle,jobLocation,jobType, applicationDate, status,salary, notes, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Job updated successfully' });
  });
});

app.delete('/api/jobs/:id', (req, res) => {
  db.query('DELETE FROM jobapplications WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Job deleted successfully' });
  });
});

app.get('/api/stats',(req, res) => {
  const query = `
    SELECT 
      COUNT(*) AS total,
      SUM(status = 'Applied') AS Applied,
      SUM(status = 'Offered') AS offers,
      SUM(status = 'Rejected') AS rejected
      
    FROM jobapplications;
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
