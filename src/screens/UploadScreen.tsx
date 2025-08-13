import React, { useState, useEffect } from 'react';
import { User, Album, Track } from '../types/index.js';
import { CloudUpload, Image, Music, Plus, X, Info } from 'lucide-react';
import StorageService from '../services/StorageService.js';

const UploadScreen: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('Pop');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const genres = [
    'Pop', 'Rock', 'Jazz', 'Electronic', 'Hip Hop', 'R&B', 'Country',
    'Classical', 'Blues', 'Folk', 'Reggae', 'EDM', 'Acoustic'
  ];

  const sampleImages = [
    'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  useEffect(() => {
    loadCurrentUser();
    setSelectedImageUrl(sampleImages[0]);
  }, []);

  const loadCurrentUser = async () => {
    const user = await StorageService.getCurrentUser();
    setCurrentUser(user);
  };

  const addTrack = () => {
    const trackTitle = prompt('Enter track title:');
    if (trackTitle?.trim()) {
      const newTrack: Track = {
        id: `track_${Date.now()}`,
        title: trackTitle.trim(),
        artist: currentUser?.name || 'Unknown Artist',
        artistId: currentUser?.id || 'unknown',
        duration: '3:30',
        albumId: 'temp_album',
        trackNumber: tracks.length + 1,
        price: 0,
        isFree: true,
        streamCount: 0,
        purchaseCount: 0,
        genre,
        createdAt: new Date(),
        tags: [],
        isDownloaded: false,
      };
      setTracks([...tracks, newTrack]);
    }
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const uploadAlbum = async () => {
    if (!title.trim()) {
      alert('Please enter an album title');
      return;
    }

    if (!price.trim()) {
      alert('Please enter a price');
      return;
    }

    if (tracks.length === 0) {
      alert('Please add at least one track');
      return;
    }

    if (!currentUser) {
      alert('User not found');
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const albumId = Date.now().toString();
      const album: Album = {
        id: albumId,
        title: title.trim(),
        artistId: currentUser.id,
        artistName: currentUser.name,
        price: parseFloat(price),
        coverImageUrl: selectedImageUrl,
        tracks: tracks.map(track => ({
          ...track,
          albumId,
          coverImageUrl: selectedImageUrl,
        })),
        createdAt: new Date(),
        genre,
        description: description.trim(),
        isDownloaded: false,
      };

      await StorageService.saveAlbum(album);

      alert(`Album "${album.title}" uploaded successfully!`);
      
      // Clear form
      setTitle('');
      setDescription('');
      setPrice('');
      setGenre('Pop');
      setSelectedImageUrl(sampleImages[0]);
      setTracks([]);
    } catch (error) {
      alert('Failed to upload album. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Album 🎤</h1>
              <p className="text-gray-600">Share your creativity with the world</p>
            </div>
            <button
              onClick={uploadAlbum}
              disabled={isUploading}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-6 py-2 rounded-full font-semibold transition-colors"
            >
              {isUploading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Info Card */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
          <Info size={20} className="text-primary-500 mt-0.5" />
          <p className="text-primary-700 text-sm">
            Fill in the details below to create your album. All fields marked with * are required.
          </p>
        </div>

        <div className="space-y-6">
          {/* Album Cover */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Album Cover *
            </label>
            <div className="flex items-start space-x-4">
              <div 
                className="w-32 h-32 border-2 border-primary-500 rounded-xl overflow-hidden cursor-pointer hover:border-primary-600 transition-colors"
                onClick={() => {
                  const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
                  setSelectedImageUrl(randomImage);
                }}
              >
                {selectedImageUrl ? (
                  <img src={selectedImageUrl} alt="Album cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Image size={32} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">Choose a cover image</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Select an eye-catching image that represents your album. This will be the first thing listeners see.
                </p>
                <button
                  onClick={() => {
                    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
                    setSelectedImageUrl(randomImage);
                  }}
                  className="flex items-center space-x-2 text-primary-500 border border-primary-500 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <Image size={18} />
                  <span>{selectedImageUrl ? 'Change Image' : 'Select Image'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Album Title */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Album Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter album title"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Genre *
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Price (USD) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="9.99"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your album..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Tracks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-lg font-semibold text-gray-900">
                Tracks ({tracks.length}) *
              </label>
              <button
                onClick={addTrack}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2 transition-colors"
              >
                <Plus size={16} />
                <span>Add Track</span>
              </button>
            </div>

            {tracks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Music size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tracks added yet</h3>
                <p className="text-gray-600">Add at least one track to create your album</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tracks.map((track, index) => (
                  <div key={track.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{track.trackNumber}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{track.title}</h4>
                      <p className="text-gray-600 text-sm">Duration: {track.duration}</p>
                    </div>
                    <button
                      onClick={() => removeTrack(index)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={uploadAlbum}
            disabled={isUploading}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <CloudUpload size={20} />
            <span>{isUploading ? 'Publishing Album...' : 'Publish Album'}</span>
          </button>

          {/* Guidelines */}
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Info size={16} className="text-gray-600" />
              <h4 className="font-semibold text-gray-800">Publishing Guidelines</h4>
            </div>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Ensure you own all rights to the music you upload</li>
              <li>• Albums will be reviewed before going live</li>
              <li>• You can edit pricing and details after publishing</li>
              <li>• Earnings are available for withdrawal after 24 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;