
import { Photo } from './types';

export const COLORS = {
  primary: '#d946ef', // Fuchsia/Purple
  secondary: '#f472b6', // Pink
  accent: '#a21caf', // Deep Purple
  soft: '#fce7f3', // Light Pink
};

// --- PERMANENT DATA BLOCK ---
// When you get your "Memory Package", I will paste it here!
export const INITIAL_DATA = {
  photos: [] as Photo[],
  audio: {
    // Updated to a known working Pixabay audio URL as a placeholder
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    title: "Raindance - Tems & Dave"
  }
};

export const ANNIVERSARY_YEARS = 8;
export const ANNIVERSARY_MONTH = "February";
