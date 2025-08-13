import React, { useState, useEffect } from 'react';
import { Album, User } from '../types/index.js';
import { Search, Bell, TrendingUp, Star } from 'lucide-react';
import AlbumCard from '../components/AlbumCard.js';
import StorageService from '../services/StorageService.js';

const DiscoverScreen: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const genres = ['All', 'Electronic', 'Acoustic', 'EDM', 'Jazz', 'Rock'];

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const albumsData = await StorageService.getAlbums();
      const userData = await StorageService.getCurrentUser();
      
      if (!userData) {
        await StorageService.setCurrentUser('Music Lover', 'user@melodymarket.com');
        const newUser = await StorageService.getCurrentUser();
        setCurrentUser(newUser);
      } else {
        setCurrentUser(userData);
      }
      
      setAlbums(albumsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAlbums = selectedGenre === 'All' 
    ? albums 
    : albums.filter(album => album.genre === selectedGenre);

  const purchaseAlbum = async (album: Album) => {
    if (!currentUser) return;

    const confirmed = window.confirm(
      `Purchase "${album.title}" by ${album.artistName} for $${album.price.toFixed(2)}?`
    );

    if (confirmed) {
      const purchase = {
        id: Date.now().toString(),
        userId: currentUser.id,
        albumId: album.id,
        purchaseDate: new Date(),
        price: album.price,
      };
      
      await StorageService.savePurchase(purchase);
      
      // Update current user
      const updatedUser = await StorageService.getCurrentUser();
      setCurrentUser(updatedUser);
      
      alert(`Successfully purchased "${album.title}"!`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Discover Music 🎵</h1>
              <p className="text-gray-600">{filteredAlbums.length} albums available</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Search size={24} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Featured Section */}
        {filteredAlbums.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Album</h2>
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10 flex items-center">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{filteredAlbums[0].title}</h3>
                  <p className="text-white/90 mb-4">by {filteredAlbums[0].artistName}</p>
                  <button className="bg-white text-primary-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                    Listen Now
                  </button>
                </div>
                <img
                  src={filteredAlbums[0].coverImageUrl}
                  alt={filteredAlbums[0].title}
                  className="w-32 h-32 rounded-xl object-cover ml-6"
                />
              </div>
            </div>
          </div>
        )}

        {/* Genre Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Genres</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Albums Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">All Albums</h3>
            <button 
              onClick={() => setSelectedGenre('All')}
              className="text-primary-500 font-semibold hover:text-primary-600 transition-colors"
            >
              View All
            </button>
          </div>
          
          {filteredAlbums.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No music found</h3>
              <p className="text-gray-600">Try selecting a different genre or check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAlbums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onTap={() => console.log('Navigate to album detail:', album.title)}
                  onPurchase={() => purchaseAlbum(album)}
                  isPurchased={currentUser?.purchasedAlbums.includes(album.id) ?? false}
                  isDownloaded={currentUser?.downloadedAlbums.includes(album.id) ?? false}
                />
              ))}
            </div>
          )}
        </div>

        {/* Trending Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp size={24} className="text-primary-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-900">Trending Now</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.slice(0, 3).map((album, index) => (
              <div key={album.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <img
                    src={album.coverImageUrl}
                    alt={album.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{album.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{album.artistName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-500">${album.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{album.tracks.length} tracks</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverScreen;