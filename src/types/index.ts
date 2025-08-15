export interface User {
  id: string;
  name: string;
  email: string;
  isArtist: boolean;
  profileImage?: string;
  purchasedTracks: string[];
  following: string[];
  followers: string[];
  bio?: string;
  socialLinks?: Record<string, string>;
  balance: number;
  phoneNumber?: string;
  createdAt: Date;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  duration: string;
  fileUrl?: string;
  previewUrl?: string;
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

export interface Analytics {
  trackId: string;
  totalStreams: number;
  totalPurchases: number;
  totalEarnings: number;
  dailyStats: DailyStats[];
}

export interface DailyStats {
  date: Date;
  streams: number;
  purchases: number;
  earnings: number;
}

export interface ArtistAnalytics {
  artistId: string;
  totalFollowers: number;
  totalStreams: number;
  totalEarnings: number;
  topTracks: Analytics[];
  monthlyStreams: Record<string, number>;
}