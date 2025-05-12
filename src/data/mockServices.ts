
import { Service } from '@/types';

export const mockServices: Service[] = [
  {
    id: '1',
    title: 'Professional House Cleaning',
    description: 'Complete house cleaning service by certified professionals. We bring all supplies and equipment.',
    price: 250000,
    duration: '3 hours',
    providerId: '101',
    providerName: 'CleanHome Services',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Home Services',
    location: 'Jakarta'
  },
  {
    id: '2',
    title: 'Plumbing Repair',
    description: 'Professional plumbing repair services. Fix leaks, replace pipes, and resolve drainage issues.',
    price: 350000,
    duration: '2 hours',
    providerId: '102',
    providerName: 'Fix-it Plumbing',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Home Services',
    location: 'Jakarta'
  },
  {
    id: '3',
    title: 'Hair Styling and Makeup',
    description: 'Professional hair styling and makeup services for any occasion - weddings, parties, or photoshoots.',
    price: 500000,
    duration: '2 hours',
    providerId: '103',
    providerName: 'Glow Beauty',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Beauty & Wellness',
    location: 'Bandung'
  },
  {
    id: '4',
    title: 'Tutoring - Mathematics',
    description: 'Expert math tutoring for high school and college students. Algebra, calculus, and statistics.',
    price: 200000,
    duration: '1.5 hours',
    providerId: '104',
    providerName: 'MathPro Tutoring',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Education',
    location: 'Surabaya'
  },
  {
    id: '5',
    title: 'Smartphone Screen Repair',
    description: 'Quick and reliable smartphone screen replacement. Most models supported with same-day service.',
    price: 400000,
    duration: '1 hour',
    providerId: '105',
    providerName: 'TechRepair Pro',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1546027031-7fb5093ee749?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Electronics',
    location: 'Jakarta'
  },
  {
    id: '6',
    title: 'Garden Landscaping',
    description: 'Complete garden design and maintenance services. Plant selection, layout, and ongoing care.',
    price: 1500000,
    duration: '1 day',
    providerId: '106',
    providerName: 'Green Thumb Gardens',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Home Services',
    location: 'Bandung'
  }
];

export const serviceCategories = [
  'All Categories',
  'Home Services',
  'Beauty & Wellness',
  'Education',
  'Electronics',
  'Transportation',
  'Professional',
  'Events'
];

export const locations = [
  'All Locations',
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Bali',
  'Medan',
  'Makassar'
];
