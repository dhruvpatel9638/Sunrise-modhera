const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  maxGuests: {
    type: Number,
    default: 2,
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
