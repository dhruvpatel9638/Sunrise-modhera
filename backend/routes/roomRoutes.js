import express from 'express';
import { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, restoreDefaultRooms } from '../controllers/roomController.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(createRoom);

router.post('/restore-defaults', restoreDefaultRooms);

router.route('/:id')
  .get(getRoomById)
  .put(updateRoom)
  .delete(deleteRoom);

export default router;
