import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Model imports (for seeding)
import { Room } from './models/Room.js';
import { Review } from './models/Review.js';

// Load env vars
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Status Route
app.get('/api/status', (req, res) => {
  res.status(200).json({ 
    status: 'online', 
    timestamp: new Date(), 
    message: 'Modhera Sunrise Resort API is fully functional' 
  });
});

// Use Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/reviews', reviewRoutes);

// Seeding function to populate default data if empty
const seedDatabase = async () => {
  try {
    const roomCount = await Room.find({});
    if (roomCount.length === 0) {
      console.log('🌱 Database is empty. Seeding initial rooms data...');
      
      const defaultRooms = [
        {
          title: "Traditional AC Bhunga (Kutchi Mud Hut)",
          type: "bhunga",
          price: 3200,
          maxGuests: 3,
          size: 380,
          description: "Authentic circular Kutch-style mud house with conical thatched roof. Artfully adorned with traditional hand-crafted mirror-work (lipan kaam), king-size bed, quiet air conditioning, and attached luxury bathroom.",
          amenities: ["Air Conditioning", "King Size Bed", "Lipan Kaam Decor", "Attached Modern Bath", "Garden View", "Complimentary Breakfast", "Free Wi-Fi", "Tea/Coffee Maker"],
          images: [
            "/images/rooms/bhunga_village.jpg",
            "/images/rooms/bhunga_interior.jpg",
            "/images/rooms/resort_pathways.jpg"
          ],
          availableCount: 5
        },
        {
          title: "Family AC Cottage",
          type: "cottage",
          price: 3800,
          maxGuests: 4,
          size: 480,
          description: "Standalone brick-and-mortar cottage with private sit-out verandah opening directly to lush resort lawns. Equipped with comfortable double bedding, sitting lounge, and modern en-suite amenities.",
          amenities: ["Panoramic Garden Porch", "Air Conditioning", "Double Beds", "Attached Bathroom", "Flat Screen TV", "Mini Fridge", "Free Wi-Fi", "Electric Kettle"],
          images: [
            "/images/rooms/cottage_exterior.jpg",
            "/images/rooms/cottage_interior.jpg",
            "/images/rooms/resort_evening.jpg"
          ],
          availableCount: 4
        },
        {
          title: "Deluxe AC Room",
          type: "deluxe",
          price: 2600,
          maxGuests: 2,
          size: 280,
          description: "Well-appointed contemporary resort room offering serene views of surrounding garden pathways. Features a king bed, work desk, silent air conditioning, and spotless private bath.",
          amenities: ["Air Conditioning", "King Bed", "Garden View", "En-suite Bathroom", "Tea/Coffee Maker", "Flat Screen TV", "Free Wi-Fi", "Daily Housekeeping"],
          images: [
            "/images/rooms/deluxe_room_interior.jpg",
            "/images/rooms/garden_fountain.jpg",
            "/images/rooms/village_serene.jpg"
          ],
          availableCount: 6
        },
        {
          title: "Luxury Glamping Tent",
          type: "tent",
          price: 2800,
          maxGuests: 2,
          size: 320,
          description: "Immersive nature-stay canvas tent sheltered under native tree canopies with attached concrete bathroom, hot & cold shower, air cooler/AC, and private wooden sit-out deck for birdwatching.",
          amenities: ["Private Wood Deck", "Attached Bathroom", "Hot & Cold Shower", "Air Cooler/AC", "Nature Canopy", "Complimentary Breakfast", "Morning Birdwatching"],
          images: [
            "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1000&q=85",
            "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1000&q=85",
            "/images/rooms/resort_swing.jpg"
          ],
          availableCount: 6
        }
      ];

      await Room.create(defaultRooms);
      console.log('✅ Default rooms seeded successfully!');
    }

    const reviewCount = await Review.find({});
    if (reviewCount.length === 0) {
      console.log('🌱 Seeding initial reviews...');
      const defaultReviews = [
        {
          guestName: "Ramesh Patel",
          rating: 5,
          comment: "Unbeatable location! The UNESCO Modhera Sun Temple is literally directly behind the resort. Walking there for the morning sunrise was magical. The Pure Veg Gujarati food was fresh, hot, and highly satisfying. peacocks roam freely in the lawns!",
          date: "May 28, 2026",
          approved: true
        },
        {
          guestName: "Sarah Jenkins",
          rating: 4,
          comment: "We loved staying in the traditional Bhunga. The mirror-work inside is stunning and it stayed cool even during the day. The staff is extremely polite, showing us the local organic farms. Excellent hospitality.",
          date: "May 15, 2026",
          approved: true
        },
        {
          guestName: "Dr. Ananya Mehta",
          rating: 5,
          comment: "Ideal weekend getaway from Ahmedabad (~99 km). Kids loved the swimming pool and play zone. The candlelight dining in the jungle restaurant area was extremely romantic. We requested Jain food and they accommodated us perfectly.",
          date: "April 22, 2026",
          approved: true
        }
      ];
      await Review.create(defaultReviews);
      console.log('✅ Default reviews seeded successfully!');
    }
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
