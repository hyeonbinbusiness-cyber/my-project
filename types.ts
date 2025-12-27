export interface Project {
  id: number;
  title: string;
  category: string;
  image?: string;
  youtubeId?: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}