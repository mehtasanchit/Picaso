import axios from 'axios';
import { HTTP_BACKEND } from '../config';

export async function getExistingShapes(roomId: string) {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/shapes/${roomId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch shapes:", err);
    return [];
  }
}
