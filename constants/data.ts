import { NavItem } from '@/types';
export type Post = {
  id: string; // Post ID
  userId: string; // User ID
  userNickName: string; // User's nickname
  userAvatar: string; // User's avatar URL
  title: string; // Post title
  description: string; // Post description
  imageUrl: string; // Post image URL
  tag: string; // Post tag
  background: string; // Post background image URL
  postUpvotes: number; // Number of upvotes
  postDevotes: number; // Number of downvotes
  postComments: number; // Number of comments
  postShares: number; // Number of shares
  createdAt: string; // Post creation date
};


export interface User {
  userId: string;
  name: string;
  avatar: string;
  email: string;
  isHavePremium: boolean;
}

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard/overview',
    icon: 'dashboard',
    isActive: true,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Post',
    url: '/admin/dashboard/post',
    icon: 'post',
    shortcut: ['e', 'e'],
    isActive: false,
    items: []
  },
  {
    title: 'Plant Wiki',
    url: '/admin/dashboard/wiki',
    icon: 'post',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Plant Guide',
    url: '/admin/dashboard/guide',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: []
  },
  {
    title: 'User',
    url: '/admin/dashboard/user',
    icon: 'user',
    shortcut: ['k', 'k'],
    isActive: false,
    items: []
  },
  {
    title: 'Membership',
    url: '/admin/dashboard/membership',
    icon: 'userPen',
    shortcut: ['k', 'k'],
    isActive: false,
    items: []
  },
  {
    title: 'Sales',
    url: '/admin/dashboard/sales',
    icon: 'billing',
    shortcut: ['k', 'k'],
    isActive: false,
    items: []
  },
  {
    title: 'Report',
    url: '/admin/dashboard/report',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: []
  }
];
