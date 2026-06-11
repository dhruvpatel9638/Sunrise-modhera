import express from 'express';
import { getRooms, getRoomById, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(createRoom);

router.route('/:id')
  .get(getRoomById)
  .put(updateRoom)
  .delete(deleteRoom);

export default router;
