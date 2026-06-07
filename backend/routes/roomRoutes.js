import express from 'express';
import { getRooms, getRoomById, createRoom } from '../controllers/roomController.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(createRoom);

router.route('/:id')
  .get(getRoomById);

export default router;
