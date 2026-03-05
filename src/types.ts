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
  user_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
  likes_count: number;
}

export interface Post {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  title: string;
  content: string;
  image?: string;
  location: string;
  created_at: string;
  likes_count: number;
  category: string;
  comments_count: number;
  comments?: Comment[];
}
