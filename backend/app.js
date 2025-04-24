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
    updatedBy,
    role
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (
        firstName, lastName, email, password, phoneNumber,
        createdAt, createdBy, updatedAt, updatedBy,role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,  ?,? )
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
      updatedBy,
      role
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

      // 🔑 Include role in token if needed
      const token = jwt.sign(
        {
          Id: user.Id,
          phoneNumber: user.phoneNumber,
          role: user.role   // 👈 include role in JWT payload (optional)
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // 🟢 Include role in response
      res.json({
        token,
        userId: user.Id,
        role: user.role,          // 👈 add this
        message: 'Login successful'
      });
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

//get all jobs for all users
app.get('/api/jobs', (req, res) => {
  const query = 'SELECT * FROM jobs';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      return res.status(500).json({ error: 'Database error while fetching jobs' });
    }

    res.json(results);
  });
});


// Get jobs by recruiterId
app.get('/api/jobs/:recruiterId', (req, res) => {
  const recruiterId = req.params.recruiterId;

  const query = 'SELECT * FROM jobs WHERE recruiterId = ?';
  
  db.query(query, [recruiterId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No jobs found for this recruiter' });
    }

    res.json(results);
  });
});



//by id
app.get('/api/user-applications/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
      j.companyName,
      j.jobTitle,
      a.status,
      a.jobId
    FROM 
      jobapplications a
    JOIN 
      jobs j ON a.jobId = j.id
    WHERE 
      a.userId = ?
   
  `;

  console.log("Executing query for userId:", userId);  // Log userId for debugging
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching applications:', err);
      return res.status(500).json({ error: err.message  });
    }
    res.json(results);
  });
});


//click
app.get('/api/job-applications/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  console.log('Received jobId:', jobId);  // Log the jobId here
  
  const query = `
    SELECT 
      ja.id AS applicationId, 
      ja.userId, 
      ja.jobId, 
      ja.status AS applicationStatus, 
      u.firstName AS userFirstName, 
      u.lastName AS userLastName, 
      u.email AS userEmail 
    FROM jobapplications ja
    JOIN users u ON ja.userId = u.id
    WHERE ja.jobId = ?
  `;
  
  db.query(query, [jobId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No applications found for this job.' });
    }
    res.json(results); // Send user application details
  });
});




//for recruiter
app.post('/api/jobs',  (req, res) => {
  const { companyName, jobTitle, jobLocation, jobType, salary, notes ,recruiterId} = req.body;
 

  const sql = `
    INSERT INTO jobs
    (companyName, jobTitle, jobLocation, jobType,  salary, notes, recruiterId) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [companyName, jobTitle, jobLocation, jobType,  salary, notes,recruiterId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
});


//for user
app.post('/api/jobs/apply', (req, res) => {
  const { jobId, userId, resumeUrl, status } = req.body;

  const query = 'INSERT INTO jobapplications (jobId, userId, resumeUrl, status) VALUES (?, ?, ?, ?)';

  db.query(query, [jobId, userId, resumeUrl, status || 'Applied'], (err, result) => {
    if (err) {
      console.error('Application error:', err);
      return res.status(500).json({ error: 'Failed to apply to job' });
    }

    res.status(201).json({ message: 'Application submitted successfully' });
  });
});


app.put('/api/jobs/:id',(req, res) => {
  const {  ResumeUrl} = req.body;
  const sql = 'UPDATE jobapplications SET ResumeUrl=? WHERE jobId = ?';
  db.query(sql, [ ResumeUrl, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Job updated successfully' });
  });
});

app.delete('/api/jobs/:id', (req, res) => {
  const jobId = req.params.id;

  if (!jobId) {
    return res.status(400).json({ error: 'Job ID is required' });
  }

  db.query('DELETE FROM jobapplications WHERE jobId = ?', [jobId], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Job deleted successfully' });
  });
});




app.get('/api/stats', (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const query = `
  SELECT 
  COUNT(*) AS total,
  SUM(LOWER(status) = 'applied') AS Applied,
  SUM(LOWER(status) = 'offered') AS offers,
  SUM(LOWER(status) = 'rejected') AS rejected
FROM jobapplications
WHERE userId = ?;
  `;

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result[0]);
  });
});




// //
app.put('/api/jobs/job-applications/:applicationId', (req, res) => {
  const applicationId = req.params.applicationId;
  const { status } = req.body;

  const validStatuses = ['Applied', 'Interviewed', 'Offered', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const updatedAt = new Date();

  // ✅ **Fixed SQL query: Removed the trailing comma after status**
  db.query(
    'UPDATE jobapplications SET status = ?, updatedAt = ? WHERE id = ?', // No comma before WHERE
    [status, updatedAt, applicationId],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Database error',
          details: err.message 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json({ 
        message: 'Application status updated successfully',
        applicationId,
        newStatus: status
      });
    }
  );
});






app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
