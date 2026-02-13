
export interface Photo {
  id: string;
  url: string;
  caption: string;
  category: 'then' | 'now' | 'us';
}

export interface CelebrationMessage {
  id: string;
  text: string;
  author: string;
}
