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
  supporters_count: number; // 加油支持者數量
  is_supported?: number;     // 當前用戶是否已支持 (1 or 0)
  is_liked?: number;         // 當前用戶是否已點讚 (1 or 0)
  comments?: Comment[];
}
