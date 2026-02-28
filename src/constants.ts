import { Post, User } from './types';

export const currentUser: User = {
  id: 'u1',
  name: '溫暖的小光',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsKtfmz4c8AP3FCouqlCPe-tmfXfJGPuwSAKI4jj-iDrQOVzCLjzlUNBnUP_JhplGqi2fTsY1G_Iza8cxyH6zF5P9LHIOBFavfQI9ceBnS-2D7XZW6pPjXo1OU47LBkhtwH3MNItjIotEKP9AU3Bx-ZmnPOa2y4F45OTQfcYnviVhBTQPbagq7OYjoy_bFr8--QzcG8yBxrEtrrroW-n8piJMmneCi3Cm8HZaHKYsyPbG7Q8q-mhlg8x7HTV26jDww7BaswdcUuh_I',
  location: 'Seattle, WA',
  joinDate: '2023年10月',
  bio: '傳遞光芒，分享溫暖',
};

export const mockPosts: Post[] = [
  {
    id: 'p1',
    user_id: 'u2',
    author_name: 'Sarah Jenkins',
    author_avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5zK_j8MxeYEVbPbGcjEY89bnfMYjtUuuyUtwpgX1hWyLLIMRHYWPXXE9aYvvGCHNuFizpKP3CzVYfyCh2s5enRLtSf_kcaQsabWJBEzYJOcUtg_mpQxIcdpp5AIlJoecRH8dB665yCkVaT6zUFmeDMkhfcElTXosZkuBsjaSNsfp8GxSlEkVy3jkkNDos5ENJNGaJS-iYHMRb_TLUDzQ7zBUiYQBfQUV70NruvSJVXgZ44QNizP5NPPpMy2VQNST4aATRV_NsNs-F',
    title: '這週需要採購雜貨的幫助',
    content: '大家好，我叫 Sarah。最近因為身體不適且剛動完一個小手術，目前無法自行開車出門，家裡的日常用品和雜貨已經快要用完了。\n\n希望能有附近的鄰居在採購時順便幫忙帶一些必需品（主要是鮮奶、雞蛋、一些新鮮蔬菜和水果）。我已經列好了清單，並且會透過線上轉帳或現金支付所有相關費用。\n\n非常感謝大家的關心與幫助！在這個困難的時刻，鄰里間的支援對我來說意義重大。如果您這兩天剛好要去超市，請與我聯繫，謝謝！',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNTXODuaFk0rHz88zheGWVSGoNhH16joxELhBCikkj_UFP_VZ0gJFW7JPkZAFlNecVQzbW2NX6V2fAWoObApRj0WxJD_NQei5ilcrODrxOplhJhStTJ6I16MYw70abvwMR0ArXe2SIQeA32RUT4VZsjagSxd6p6nN9lULmWV-zJm8fIm__1wnZA6wyhQbuB4fR-giQ_ewysJjnB5CQmt14NMMyh2vgWwvrJjgZT0kecQw5WykIgkT2ilxSFlJnBZIz78DdqYhP29zC',
    location: '3 英里外',
    created_at: '2026-02-28 07:00:00',
    likes_count: 12,
    comments_count: 2,
    category: '情緒支持',
    privacy: 'public',
    comments: [
      {
        id: 'c1',
        post_id: 'p1',
        user_id: 'u3',
        author_name: 'David Chen',
        author_avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfnoteGr6pPZ9PEQRxcTSBGR-FpuAv2e70W5pUSWIcqzcS-yJFZ_jSzNRrSuDv-wrCKwVJRxjAjJWE7acDOI3Kd-llMH_092TMuO2fi_7SCDP8HQxir-h566sLN3OWV_EbihJExR2RB_RfzsCDzxnAi4BqBcevNI7vH84HZlyf5p4r0MuN3ZSNt_qwWZnmyyuB_K5SljYGRejyhyrEhkV6pbPYlmaJy7oJCsH44NpFi2wSKvV1s3QnHwPRzcsNGtL2IPSgkPUy10QX',
        content: '加油！我也住在附近，正好明天要去連鎖超市，可以幫忙採購後放在您家門口。',
        created_at: '2026-02-28 08:00:00',
      },
      {
        id: 'c2',
        post_id: 'p1',
        user_id: 'u4',
        author_name: 'Elena Rodriguez',
        author_avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyrNjv5qUJNH4YPPRtTLItnvVhol71g1IUtxn49UzxH-TiELPqtvyuIEPjo0JMgvp3eHLsB_QDCZLN3dRKF0DlNBoiOXdBF0knPhT_T1ngeuk7lFrLNcXcBmo2YQvzG3ZHt6qVkZNi84qSo9JvQgI0Pf1XdhDepMdUd-ikZ3EF-VZ5nU2YJlpCt33WAPghjZkP22pQx_ugQ_LyioSmhQP_0rUS5H2yKGWUrHNy9EsPU0Yo_WtZ6FGGG-ox6wta1nwkVIOsjcV3xLMZ',
        content: '希望一切順利！手術後的休養很重要，請好好休息，別太擔心雜貨的事。',
        created_at: '2026-02-28 08:15:00',
      }
    ]
  },
  {
    id: 'p2',
    user_id: 'u5',
    author_name: 'Marcus Chen',
    author_avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMLs3YsHpGiyDMWelXaJ2sXBOI7tXiZyt2ZMANzcEjdIVqjh3m0ANNkLdKdfBPPGMXVI3wuybax-OC0S0MWXhPS_OfC_XzREdqaLnxceQP25cftA2qqiuqx_ptt0LlZgmBz9yw7BaHqSwVu3IbIxk7_7huZslETu_T1rXEQYsashYMlJ26Z3ZCs3plp6HLpZBXg506oAp_CeY40MLOKVP4pUyEI95y7FPhARvkWvbHJOjfBMD-XkOIPf7hn3GkiazrMYwcCTCp1fwi',
    title: '年長鄰居需要花園整理協助',
    content: 'My neighbor Mrs. Gable is struggling to keep up with her backyard. Looking for 2 volunteers this Saturday morning for light weeding and planting some seasonal flowers. She always provides lemonade and great stories!',
    location: '這週六',
    created_at: '2026-02-28 04:00:00',
    likes_count: 8,
    comments_count: 0,
    category: '情緒支持',
    privacy: 'public',
    comments: []
  }
];
