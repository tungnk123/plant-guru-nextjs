import { NavItem } from '@/types';
export type Post = {
  id: string; // Unique identifier for the post
  userId: string; // ID of the user who created the post
  user: string | null; // Optional user object or null if not available
  title: string; // Title of the post
  description: string; // Description of the post
  imageUrl: string; // URL of the post's image
  tag: string; // Tag or category for the post
  background: string; // URL of the background image for the post
  postUpvotes: any[]; // Array of upvotes (can be refined further)
  postDevotes: any[]; // Array of downvotes (can be refined further)
  postComments: any[]; // Array of comments (can be refined further)
  postShares: any[]; // Array of shares (can be refined further)
  createdAt: string; // Creation date of the post in ISO format
  lastModifiedAt: string | null; // Last modification date or null if not modified
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
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Post',
    url: '/admin/dashboard/post',
    icon: 'post',
    shortcut: ['e', 'e'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Category',
    url: '/admin/dashboard/category',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Plant Encyclopedia',
    url: '/admin/dashboard/wiki',
    icon: 'post',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Plant Guide',
    url: '/admin/dashboard/guide',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'User',
    url: '/admin/dashboard/user',
    icon: 'user',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Membership',
    url: '/admin/dashboard/membership',
    icon: 'user',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Sales',
    url: '/admin/dashboard/sales',
    icon: 'billing',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Report',
    url: '/admin/dashboard/report',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  }
];
