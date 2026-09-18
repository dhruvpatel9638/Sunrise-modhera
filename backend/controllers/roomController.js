import { Room } from '../models/Room.js';

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving rooms', error: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving room', error: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const newRoom = await Room.create(req.body);
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: 'Error creating room', error: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ message: 'Error updating room', error: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};

export const restoreDefaultRooms = async (req, res) => {
  try {
    const count = await Room.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Rooms already exist in the inventory.' });
    }

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

    const created = await Room.create(defaultRooms);
    res.status(201).json({ message: 'Default rooms restored successfully', rooms: created });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring rooms', error: error.message });
  }
};
