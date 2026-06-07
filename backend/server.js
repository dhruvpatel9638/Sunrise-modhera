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
app.use(express.json());

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
          title: "Traditional Bhunga (Kutch Mud Hut)",
          type: "bhunga",
          price: 6500,
          maxGuests: 3,
          size: 450,
          description: "Circular, authentic Kutch-style mud houses with conical thatched roofs. Artfully decorated with traditional hand-crafted mirror-work (lipan kaam) on the interior walls. Upgraded with premium king-size bedding, writing desk, and quiet air conditioning for luxury comfort in a rustic ambiance.",
          amenities: ["Air Conditioning", "King Size Bed", "Premium Linens", "Attached Luxury Bath", "Lipan Kaam Decor", "Tea/Coffee Maker", "Mineral Water", "Free Wi-Fi"],
          images: [
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
          ],
          availableCount: 4
        },
        {
          title: "Luxury Glamping Tent",
          type: "tent",
          price: 5500,
          maxGuests: 2,
          size: 400,
          description: "Glamour camping (Glamping) setups giving a raw, immersive nature feel. Nestled under dense green tree canopies, each tent features premium mattress setups, fine fabrics, and a fully attached modern concrete bathroom. Includes a private wood-deck verandah for viewing free-roaming peacocks and bird watching.",
          amenities: ["Private Sit-out Verandah", "Attached Concrete Bathroom", "Hot & Cold Shower", "Air Cooler/AC", "Complimentary Breakfast", "Nature View Deck", "Tea Kettle"],
          images: [
            "https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80"
          ],
          availableCount: 6
        },
        {
          title: "Super Cottage / Deluxe Garden Room",
          type: "cottage",
          price: 7500,
          maxGuests: 4,
          size: 625,
          description: "Spacious standard brick-and-mortar luxury bungalows with high ceilings and wide french windows. Each cottage opens up directly to a panoramic private garden space. Equipped with premium double beds, a cozy seating lounge, double vanity bathrooms, and upscale contemporary furnishings.",
          amenities: ["Panoramic Garden View", "French Windows", "Double Vanity Bathroom", "Air Conditioning", "In-Room Electronic Safe", "Mini Fridge", "Flat Screen Smart TV", "Lounge Seating Area"],
          images: [
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
          ],
          availableCount: 5
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
