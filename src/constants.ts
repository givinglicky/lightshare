import { Post, User } from './types';

export const currentUser: User = {
  id: 'u1',
  name: '溫暖的小光',
  avatar: 'https://picsum.photos/seed/user1/200',
  location: 'Seattle, WA',
  joinDate: '2023年10月',
  bio: '傳遞光芒，分享溫暖',
};

export const mockPosts: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://picsum.photos/seed/user2/200',
    title: '這週需要採購雜貨的幫助',
    content: '大家好，我叫 Sarah。最近因為身體不適且剛動完一個小手術，目前無法自行開車出門，家裡的日常用品和雜貨已經快要用完了。\n\n希望能有附近的鄰居在採購時順便幫忙帶一些必需品（主要是鮮奶、雞蛋、一些新鮮蔬菜和水果）。我已經列好了清單，並且會透過線上轉帳或現金支付所有相關費用。\n\n非常感謝大家的關心與幫助！在這個困難的時刻，鄰里間的支援對我來說意義重大。如果您這兩天剛好要去超市，請與我聯繫，謝謝！',
    image: 'https://picsum.photos/seed/post1/600/400',
    location: '3 英里外',
    timestamp: '2小時前',
    likes: 12,
    category: '情緒支持',
    comments: [
      {
        id: 'c1',
        userId: 'u3',
        userName: 'David Chen',
        userAvatar: 'https://picsum.photos/seed/user3/200',
        content: '加油！我也住在附近，正好明天要去連鎖超市，可以幫忙採購後放在您家門口。',
        timestamp: '1小時前',
        likes: 5,
      },
      {
        id: 'c2',
        userId: 'u4',
        userName: 'Elena Rodriguez',
        userAvatar: 'https://picsum.photos/seed/user4/200',
        content: '希望一切順利！手術後的休養很重要，請好好休息，別太擔心雜貨的事。',
        timestamp: '45分鐘前',
        likes: 3,
      }
    ]
  },
  {
    id: 'p2',
    userId: 'u5',
    userName: 'Marcus Chen',
    userAvatar: 'https://picsum.photos/seed/user5/200',
    title: '年長鄰居需要花園整理協助',
    content: 'My neighbor Mrs. Gable is struggling to keep up with her backyard. Looking for 2 volunteers this Saturday morning for light weeding and planting some seasonal flowers. She always provides lemonade and great stories!',
    location: '這週六',
    timestamp: '5小時前',
    likes: 8,
    category: '情緒支持',
    comments: []
  }
];
