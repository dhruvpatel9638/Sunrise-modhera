import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MOCK_DB_FILE = path.join(__dirname, '../mock_db.json');

// Check if we should run in mock mode
export const isMockMode = !process.env.MONGODB_URI;

// Initialize mock database file with base schema collections
const initMockDb = () => {
  if (!fs.existsSync(MOCK_DB_FILE)) {
    const initialData = {
      rooms: [],
      bookings: [],
      inquiries: [],
      reviews: []
    };
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    console.log(`📂 Created mock database file at: ${MOCK_DB_FILE}`);
  } else {
    console.log(`📂 Loaded mock database from: ${MOCK_DB_FILE}`);
  }
};

export const connectDB = async () => {
  if (isMockMode) {
    console.log('⚠️  No MONGODB_URI found. Running in MOCK DATABASE mode (local JSON file-based database).');
    initMockDb();
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🔌 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('⚠️ Falling back to MOCK DATABASE mode.');
    // Force mock mode
    initMockDb();
  }
};

// --- Mock Model Base Class ---
class MockModel {
  constructor(collectionName, data = {}) {
    this._collection = collectionName;
    Object.assign(this, data);
    if (!this._id) {
      this._id = Math.random().toString(36).substring(2, 9);
    }
  }

  static _read() {
    try {
      const content = fs.readFileSync(MOCK_DB_FILE, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      return { rooms: [], bookings: [], inquiries: [], reviews: [] };
    }
  }

  static _write(data) {
    fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  async save() {
    const db = MockModel._read();
    const collection = db[this._collection] || [];
    
    // Convert this instance to a plain object
    const saveData = { ...this };
    delete saveData._collection;

    const index = collection.findIndex(item => item._id === this._id);
    if (index >= 0) {
      collection[index] = saveData;
    } else {
      collection.push(saveData);
    }
    
    db[this._collection] = collection;
    MockModel._write(db);
    return this;
  }

  static async find(query = {}) {
    const db = MockModel._read();
    const collection = db[this.collectionName] || [];
    
    return collection.filter(item => {
      for (const key in query) {
        if (query[key] !== item[key]) {
          return false;
        }
      }
      return true;
    });
  }

  static async findById(id) {
    const db = MockModel._read();
    const collection = db[this.collectionName] || [];
    const found = collection.find(item => item._id === id);
    if (!found) return null;
    return new this(found);
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    const db = MockModel._read();
    const collection = db[this.collectionName] || [];
    const index = collection.findIndex(item => item._id === id);
    if (index === -1) return null;

    const current = collection[index];
    const updated = { ...current, ...update };
    collection[index] = updated;
    db[this.collectionName] = collection;
    MockModel._write(db);
    
    return new this(updated);
  }

  static async create(data) {
    const db = MockModel._read();
    const collection = db[this.collectionName] || [];
    
    const items = Array.isArray(data) ? data : [data];
    const createdItems = items.map(item => {
      const newItem = {
        _id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        ...item
      };
      collection.push(newItem);
      return newItem;
    });

    db[this.collectionName] = collection;
    MockModel._write(db);

    return Array.isArray(data) ? createdItems.map(i => new this(i)) : new this(createdItems[0]);
  }

  static async findByIdAndDelete(id) {
    const db = MockModel._read();
    const collection = db[this.collectionName] || [];
    const index = collection.findIndex(item => item._id === id);
    if (index === -1) return null;

    const deleted = collection.splice(index, 1)[0];
    db[this.collectionName] = collection;
    MockModel._write(db);
    return deleted;
  }

  static async deleteMany(query = {}) {
    const db = MockModel._read();
    const collection = db[this.collectionName] || [];
    const remaining = collection.filter(item => {
      for (const key in query) {
        if (query[key] === item[key]) {
          return false;
        }
      }
      return true;
    });
    db[this.collectionName] = remaining;
    MockModel._write(db);
    return { deletedCount: collection.length - remaining.length };
  }
}

export class MockRoom extends MockModel {
  static get collectionName() { return 'rooms'; }
  constructor(data) { super('rooms', data); }
}

export class MockBooking extends MockModel {
  static get collectionName() { return 'bookings'; }
  constructor(data) { super('bookings', data); }
}

export class MockInquiry extends MockModel {
  static get collectionName() { return 'inquiries'; }
  constructor(data) { super('inquiries', data); }
}

export class MockReview extends MockModel {
  static get collectionName() { return 'reviews'; }
  constructor(data) { super('reviews', data); }
}
