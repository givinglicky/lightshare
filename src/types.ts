export interface User {
  id: string;
  name: string;
  avatar: string;
  location?: string;
  joinDate?: string;
  bio?: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
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
  category: string;
  privacy: 'public' | 'anonymous';
  created_at: string;
  likes_count: number;
  comments_count: number;
  supporters_count?: number;
  is_liked?: number;
  is_bookmarked?: number;
  is_supported?: number;
  comments?: Comment[];
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'support' | 'system';
  title: string;
  content: string;
  is_read: number;
  related_post_id?: string;
  created_at: string;
}

export interface NotificationData {
  notifications: Notification[];
  unreadCount: number;
}
