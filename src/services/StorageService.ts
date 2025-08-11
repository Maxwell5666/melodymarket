import { User, Album, Track, Purchase } from '../types';

class StorageService {
  private static readonly USER_KEY = 'melodymarket_user';
  private static readonly ALBUMS_KEY = 'melodymarket_albums';
  private static readonly PURCHASES_KEY = 'melodymarket_purchases';
  private static readonly INITIALIZED_KEY = 'melodymarket_initialized';

  static async init(): Promise<void> {
    const isInitialized = localStorage.getItem(this.INITIALIZED_KEY);
    if (!isInitialized) {
      await this.createSampleData();
      localStorage.setItem(this.INITIALIZED_KEY, 'true');
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
        coverImageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
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
            streamCount: 15420,
            purchaseCount: 89,
            genre: 'Electronic',
            coverImageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
            previewUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
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
            streamCount: 12890,
            purchaseCount: 67,
            genre: 'Electronic',
            coverImageUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
            previewUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav',
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
        coverImageUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
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
            streamCount: 8920,
            purchaseCount: 45,
            genre: 'Acoustic',
            coverImageUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
            previewUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            tags: ['acoustic', 'folk', 'morning'],
            isDownloaded: false,
          },
          {
            id: '2-2',
            title: 'River Flow',
            artist: 'River Stone',
            artistId: 'artist2',
            duration: '4:12',
            albumId: '2',
            trackNumber: 2,
            price: 1.99,
            isFree: false,
            streamCount: 7340,
            purchaseCount: 38,
            genre: 'Acoustic',
            coverImageUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
            previewUrl: 'https://www.soundjay.com/misc/sounds/clock-chimes-01.wav',
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            tags: ['acoustic', 'nature'],
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
        coverImageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
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
            streamCount: 23410,
            purchaseCount: 156,
            genre: 'EDM',
            coverImageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
            previewUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            tags: ['edm', 'bass', 'party'],
            isDownloaded: false,
          },
          {
            id: '3-2',
            title: 'Rhythm Machine',
            artist: 'DJ Thunder',
            artistId: 'artist3',
            duration: '4:28',
            albumId: '3',
            trackNumber: 2,
            price: 2.99,
            isFree: false,
            streamCount: 18750,
            purchaseCount: 134,
            genre: 'EDM',
            coverImageUrl: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
            previewUrl: 'https://www.soundjay.com/misc/sounds/magic-chime-02.wav',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            tags: ['edm', 'rhythm'],
            isDownloaded: false,
          },
        ],
      },
      {
        id: '4',
        title: 'Jazz Nights',
        artistId: 'artist4',
        artistName: 'Smooth Quartet',
        price: 11.99,
        coverImageUrl: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        genre: 'Jazz',
        description: 'Smooth jazz compositions for elegant evenings.',
        isDownloaded: false,
        tracks: [
          {
            id: '4-1',
            title: 'Blue Moon',
            artist: 'Smooth Quartet',
            artistId: 'artist4',
            duration: '6:22',
            albumId: '4',
            trackNumber: 1,
            price: 2.25,
            isFree: false,
            streamCount: 9840,
            purchaseCount: 72,
            genre: 'Jazz',
            coverImageUrl: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
            previewUrl: 'https://www.soundjay.com/misc/sounds/clock-chimes-01.wav',
            createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
            tags: ['jazz', 'smooth', 'classic'],
            isDownloaded: false,
          },
        ],
      },
      {
        id: '5',
        title: 'Rock Anthem',
        artistId: 'artist5',
        artistName: 'Electric Storm',
        price: 13.99,
        coverImageUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        genre: 'Rock',
        description: 'Powerful rock anthems with electrifying guitar solos.',
        isDownloaded: false,
        tracks: [
          {
            id: '5-1',
            title: 'Thunder Strike',
            artist: 'Electric Storm',
            artistId: 'artist5',
            duration: '4:18',
            albumId: '5',
            trackNumber: 1,
            price: 2.99,
            isFree: false,
            streamCount: 16780,
            purchaseCount: 98,
            genre: 'Rock',
            coverImageUrl: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
            previewUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
            tags: ['rock', 'electric', 'powerful'],
            isDownloaded: false,
          },
        ],
      },
    ];

    localStorage.setItem(this.ALBUMS_KEY, JSON.stringify(sampleAlbums));
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
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
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
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
      purchasedAlbums: ['1', '2'], // Sample purchases for demo
      downloadedAlbums: ['1'], // Sample download for demo
      following: [],
      followers: [],
      balance: 0,
      createdAt: new Date(),
    };
    await this.saveUser(user);

    // Add sample purchase records
    const purchases: Purchase[] = [
      {
        id: Date.now().toString(),
        userId: user.id,
        albumId: '1',
        purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        price: 12.99,
      },
      {
        id: (Date.now() + 1).toString(),
        userId: user.id,
        albumId: '2',
        purchaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        price: 9.99,
      },
    ];

    localStorage.setItem(this.PURCHASES_KEY, JSON.stringify(purchases));
  }

  static async getAlbums(): Promise<Album[]> {
    try {
      const albumsJson = localStorage.getItem(this.ALBUMS_KEY);
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
      localStorage.setItem(this.ALBUMS_KEY, JSON.stringify(albums));
    } catch (error) {
      console.error('Error saving album:', error);
    }
  }

  static async getPurchases(): Promise<Purchase[]> {
    try {
      const purchasesJson = localStorage.getItem(this.PURCHASES_KEY);
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
      localStorage.setItem(this.PURCHASES_KEY, JSON.stringify(purchases));

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

  static async hasUserPurchasedAlbum(albumId: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.purchasedAlbums.includes(albumId) ?? false;
  }
}

export default StorageService;