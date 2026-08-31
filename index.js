require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.json({ message: 'TripVault API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/profile', profileRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
