
export type UserRole = 'user' | 'provider' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  balance: number;
  createdAt: string;
  phone_number?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  providerId: string;
  providerName: string;
  rating: number;
  imageUrl: string;
  category: string;
  location: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  providerId: string;
  status: 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';
  price: number;
  createdAt: string;
}
