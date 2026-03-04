export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  location?: string;
  joinDate?: string;
  bio?: string;
  role?: string;
  created_at?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  image?: string;
  location: string;
  timestamp: string;
  likes: number;
  category: string;
  comments: Comment[];
}
