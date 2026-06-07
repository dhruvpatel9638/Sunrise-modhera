const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sunrise-resort';

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Sunrise Resort Modhera API Server.' });
});

// Auto seed rooms helper
async function autoSeedRooms() {
  try {
    const count = await Room.countDocuments();
    if (count === 0) {
      console.log('No rooms found in database. Seeding initial rooms data...');
      const initialRooms = [
        {
          title: 'Luxury Bhunga',
          description: 'Traditional circular dwellings reimagined with modern luxury and earthy charm, perfect for experiencing local culture with top-tier comforts.',
          image: '/images/bhunga.png',
          price: 8500,
          tags: ['Traditional', 'AC', 'Private Garden'],
          maxGuests: 2
        },
        {
          title: 'Forest Cottage',
          description: 'Minimalist wooden cottages with expansive glass walls, offering total immersion in the serene forest canopy and absolute privacy.',
          image: '/images/cottage.png',
          price: 12000,
          tags: ['Modern', 'Forest View', 'Luxury Tub'],
          maxGuests: 2
        },
        {
          title: 'Premium Tent',
          description: 'Ultra-luxurious glamping experience under the Modhera sky with five-star amenities and an outdoor deck for stargazing.',
          image: '/images/tent.png',
          price: 6500,
          tags: ['Glamping', 'Starlit Sky', 'Adventure'],
          maxGuests: 3
        }
      ];
      await Room.insertMany(initialRooms);
      console.log('Seeded initial rooms data successfully!');
    } else {
      console.log(`Database already populated with ${count} rooms.`);
    }
  } catch (err) {
    console.error('Error auto-seeding rooms:', err.message);
  }
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    await autoSeedRooms();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
  });
