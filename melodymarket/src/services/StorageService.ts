import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Album, Track, Purchase } from '../types';

class StorageService {
  private static readonly USER_KEY = 'current_user';
  private static readonly ALBUMS_KEY = 'albums';
  private static readonly PURCHASES_KEY = 'purchases';
  private static readonly IS_INITIALIZED_KEY = 'is_initialized';

  static async init(): Promise<void> {
    const isInitialized = await AsyncStorage.getItem(this.IS_INITIALIZED_KEY);
    if (!isInitialized) {
      await this.createSampleData();
      await AsyncStorage.setItem(this.IS_INITIALIZED_KEY, 'true');
    }
  }

  private static async createSampleData(): Promise<void> {
    const sampleAlbums: Album[] = [
      {
        id: '1',
        title: 'Midnight Vibes',
        artistId: 'artist1',
        artistName: 'Luna Eclipse',
        price: 12.99,
        coverImageUrl: 'https://picsum.photos/400/400?random=1',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        genre: 'Electronic',
        description: 'A collection of ambient electronic tracks perfect for late-night listening.',
        isDownloaded: false,
        tracks: [
          {
            id: '1-1',
            title: 'Neon Dreams',
            artist: 'Luna Eclipse',
            artistId: 'artist1',
            duration: '4:32',
            albumId: '1',
            trackNumber: 1,
            price: 2.50,
            isFree: false,
            streamCount: 1542,
            purchaseCount: 89,
            genre: 'Electronic',
            coverImageUrl: 'https://picsum.photos/400/400?random=1',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            tags: ['electronic', 'ambient', 'chill'],
            isDownloaded: false,
          },
          {
            id: '1-2',
            title: 'City Lights',
            artist: 'Luna Eclipse',
            artistId: 'artist1',
            duration: '3:47',
            albumId: '1',
            trackNumber: 2,
            price: 2.50,
            isFree: false,
            streamCount: 1289,
            purchaseCount: 67,
            genre: 'Electronic',
            coverImageUrl: 'https://picsum.photos/400/400?random=1',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            tags: ['electronic', 'upbeat'],
            isDownloaded: false,
          },
        ],
      },
      {
        id: '2',
        title: 'Acoustic Soul',
        artistId: 'artist2',
        artistName: 'River Stone',
        price: 9.99,
        coverImageUrl: 'https://picsum.photos/400/400?random=2',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        genre: 'Acoustic',
        description: 'Heartfelt acoustic melodies that speak to the soul.',
        isDownloaded: false,
        tracks: [
          {
            id: '2-1',
            title: 'Morning Coffee',
            artist: 'River Stone',
            artistId: 'artist2',
            duration: '3:28',
            albumId: '2',
            trackNumber: 1,
            price: 1.99,
            isFree: false,
            streamCount: 892,
            purchaseCount: 45,
            genre: 'Acoustic',
            coverImageUrl: 'https://picsum.photos/400/400?random=2',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            tags: ['acoustic', 'folk', 'morning'],
            isDownloaded: false,
          },
        ],
      },
      {
        id: '3',
        title: 'Beat Drop',
        artistId: 'artist3',
        artistName: 'DJ Thunder',
        price: 15.99,
        coverImageUrl: 'https://picsum.photos/400/400?random=3',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        genre: 'EDM',
        description: 'High-energy electronic dance music to get you moving.',
        isDownloaded: false,
        tracks: [
          {
            id: '3-1',
            title: 'Bass Explosion',
            artist: 'DJ Thunder',
            artistId: 'artist3',
            duration: '5:43',
            albumId: '3',
            trackNumber: 1,
            price: 2.99,
            isFree: false,
            streamCount: 2341,
            purchaseCount: 156,
            genre: 'EDM',
            coverImageUrl: 'https://picsum.photos/400/400?random=3',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            tags: ['edm', 'bass', 'party'],
            isDownloaded: false,
          },
        ],
      },
    ];

    await AsyncStorage.setItem(this.ALBUMS_KEY, JSON.stringify(sampleAlbums));
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(this.USER_KEY);
      if (userJson) {
        const userData = JSON.parse(userJson);
        return {
          ...userData,
          createdAt: new Date(userData.createdAt),
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  static async setCurrentUser(name: string, email: string, isArtist = false): Promise<void> {
    const user: User = {
      id: Date.now().toString(),
      name,
      email,
      isArtist,
      purchasedTracks: [],
      purchasedAlbums: ['1', '2'], // Sample purchases
      downloadedAlbums: ['1'], // Sample download
      following: [],
      followers: [],
      balance: 0,
    };
    await this.saveUser(user);

    // Add corresponding purchase records
    const purchase1: Purchase = {
      id: Date.now().toString(),
      userId: user.id,
      albumId: '1',
      purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      price: 12.99,
    };
    const purchase2: Purchase = {
      id: (Date.now() + 1).toString(),
      userId: user.id,
      albumId: '2',
      purchaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      price: 9.99,
    };

    const purchases = await this.getPurchases();
    purchases.push(purchase1, purchase2);
    await AsyncStorage.setItem(this.PURCHASES_KEY, JSON.stringify(purchases));
  }

  static async getAlbums(): Promise<Album[]> {
    try {
      const albumsJson = await AsyncStorage.getItem(this.ALBUMS_KEY);
      if (albumsJson) {
        const albumsData = JSON.parse(albumsJson);
        return albumsData.map((album: any) => ({
          ...album,
          createdAt: new Date(album.createdAt),
          tracks: album.tracks.map((track: any) => ({
            ...track,
            createdAt: new Date(track.createdAt),
          })),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting albums:', error);
      return [];
    }
  }

  static async saveAlbum(album: Album): Promise<void> {
    try {
      const albums = await this.getAlbums();
      const existingIndex = albums.findIndex(a => a.id === album.id);
      if (existingIndex >= 0) {
        albums[existingIndex] = album;
      } else {
        albums.push(album);
      }
      await AsyncStorage.setItem(this.ALBUMS_KEY, JSON.stringify(albums));
    } catch (error) {
      console.error('Error saving album:', error);
    }
  }

  static async getPurchases(): Promise<Purchase[]> {
    try {
      const purchasesJson = await AsyncStorage.getItem(this.PURCHASES_KEY);
      if (purchasesJson) {
        const purchasesData = JSON.parse(purchasesJson);
        return purchasesData.map((purchase: any) => ({
          ...purchase,
          purchaseDate: new Date(purchase.purchaseDate),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting purchases:', error);
      return [];
    }
  }

  static async savePurchase(purchase: Purchase): Promise<void> {
    try {
      const purchases = await this.getPurchases();
      purchases.push(purchase);
      await AsyncStorage.setItem(this.PURCHASES_KEY, JSON.stringify(purchases));

      const user = await this.getCurrentUser();
      if (user) {
        const updatedUser = {
          ...user,
          purchasedAlbums: [...user.purchasedAlbums, purchase.albumId],
        };
        await this.saveUser(updatedUser);
      }
    } catch (error) {
      console.error('Error saving purchase:', error);
    }
  }

  static async hasUserPurchasedAlbum(albumId: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.purchasedAlbums.includes(albumId) ?? false;
  }

  static async getUserPurchasedAlbums(): Promise<Album[]> {
    const user = await this.getCurrentUser();
    if (!user || user.purchasedAlbums.length === 0) return [];

    const allAlbums = await this.getAlbums();
    return allAlbums.filter(album => user.purchasedAlbums.includes(album.id));
  }

  static async getUserDownloadedAlbums(): Promise<Album[]> {
    const user = await this.getCurrentUser();
    if (!user || user.downloadedAlbums.length === 0) return [];

    const allAlbums = await this.getAlbums();
    return allAlbums.filter(album => user.downloadedAlbums.includes(album.id));
  }

  static async markAlbumAsDownloaded(albumId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (user && !user.downloadedAlbums.includes(albumId)) {
      const updatedUser = {
        ...user,
        downloadedAlbums: [...user.downloadedAlbums, albumId],
      };
      await this.saveUser(updatedUser);
    }
  }
}

export default StorageService;