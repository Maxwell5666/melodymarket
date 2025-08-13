import React, { useState, useEffect } from 'react';
import { Album } from '../types/index.js';
import { Download, Library, Music } from 'lucide-react';
import AlbumCard from '../components/AlbumCard.js';
import StorageService from '../services/StorageService.js';

const LibraryScreen: React.FC = () => {
  const [purchasedAlbums, setPurchasedAlbums] = useState<Album[]>([]);
  const [downloadedAlbums, setDownloadedAlbums] = useState<Album[]>([]);
  const [activeTab, setActiveTab] = useState<'downloaded' | 'purchased'>('downloaded');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    try {
      const purchased = await StorageService.getUserPurchasedAlbums();
      const downloaded = await StorageService.getUserDownloadedAlbums();
      
      setPurchasedAlbums(purchased);
      setDownloadedAlbums(downloaded);
    } catch (error) {
      console.error('Error loading library data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAlbum = async (album: Album) => {
    const confirmed = window.confirm(
      `Download "${album.title}" for offline listening?`
    );

    if (confirmed) {
      try {
        await StorageService.markAlbumAsDownloaded(album.id);
        await loadLibraryData();
        alert(`"${album.title}" downloaded successfully!`);
      } catch (error) {
        alert('Failed to download album');
      }
    }
  };

  const EmptyState: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    subtitle: string; 
  }> = ({ icon, title, subtitle }) => (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{subtitle}</p>
    </div>
  );

  const AlbumGrid: React.FC<{ albums: Album[]; showDownload?: boolean }> = ({ 
    albums, 
    showDownload = false 
  }) => {
    if (albums.length === 0) {
      return (
        <EmptyState
          icon={activeTab === 'downloaded' ? 
            <Download size={40} className="text-gray-400" /> : 
            <Library size={40} className="text-gray-400" />
          }
          title={activeTab === 'downloaded' ? 'No downloaded albums' : 'No purchased albums'}
          subtitle="Purchase some albums to start building your collection"
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            onTap={() => console.log('Navigate to album detail:', album.title)}
            isPurchased={true}
            isDownloaded={downloadedAlbums.some(downloaded => downloaded.id === album.id)}
            showPurchaseButton={false}
            onDownload={
              showDownload && !downloadedAlbums.some(downloaded => downloaded.id === album.id)
                ? () => downloadAlbum(album)
                : undefined
            }
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Library 📚</h1>
            <p className="text-gray-600">Your music collection</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('downloaded')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'downloaded'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Download size={20} />
                <span>Downloaded</span>
                {downloadedAlbums.length > 0 && (
                  <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                    {downloadedAlbums.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('purchased')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'purchased'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Library size={20} />
                <span>Purchased</span>
                {purchasedAlbums.length > 0 && (
                  <span className="bg-secondary-500 text-white text-xs px-2 py-1 rounded-full">
                    {purchasedAlbums.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'downloaded' ? (
          <AlbumGrid albums={downloadedAlbums} />
        ) : (
          <AlbumGrid albums={purchasedAlbums} showDownload={true} />
        )}
      </div>
    </div>
  );
};

export default LibraryScreen;