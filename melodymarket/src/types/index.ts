export interface User {
  id: string;
  name: string;
  email: string;
  isArtist: boolean;
  profileImage?: string;
  purchasedTracks: string[];
  purchasedAlbums: string[];
  downloadedAlbums: string[];
  following: string[];
  followers: string[];
  bio?: string;
  socialLinks?: Record<string, string>;
  balance: number;
  phoneNumber?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  duration: string;
  fileUrl?: string;
  previewUrl?: string;
  albumId?: string;
  trackNumber: number;
  price: number;
  isFree: boolean;
  streamCount: number;
  purchaseCount: number;
  genre: string;
  coverImageUrl?: string;
  createdAt: Date;
  tags: string[];
  isDownloaded: boolean;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  price: number;
  coverImageUrl: string;
  tracks: Track[];
  createdAt: Date;
  genre: string;
  description: string;
  isDownloaded: boolean;
}

export interface Purchase {
  id: string;
  userId: string;
  albumId: string;
  purchaseDate: Date;
  price: number;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface Payment {
  id: string;
  userId: string;
  trackId: string;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  createdAt: Date;
  transactionId?: string;
  phoneNumber?: string;
}