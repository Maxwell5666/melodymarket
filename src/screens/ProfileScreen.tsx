import React, { useState, useEffect } from 'react';
import { User, Album } from '../types';
import { User as UserIcon, Music, Download, Upload, Settings, TrendingUp, Wallet, BarChart3 } from 'lucide-react';

const ProfileScreen: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userAlbums, setUserAlbums] = useState<Album[]>([]);
  const [purchasedAlbums, setPurchasedAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await StorageService.getCurrentUser();
      const allAlbums = await StorageService.getAlbums();
      const purchased = await StorageService.getUserPurchasedAlbums();

      setCurrentUser(user);
      setUserAlbums(allAlbums.filter(album => album.artistId === user?.id));
      setPurchasedAlbums(purchased);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArtistMode = async () => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      isArtist: !currentUser.isArtist,
    };

    await StorageService.saveUser(updatedUser);
    setCurrentUser(updatedUser);

    alert(
      updatedUser.isArtist
        ? 'Artist mode enabled! You can now upload music.'
        : 'Artist mode disabled.'
    );
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-gray-600">{title}</p>
      </div>
    </div>
  );

  const SettingItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onClick?: () => void;
    rightElement?: React.ReactNode;
  }> = ({ icon, title, subtitle, onClick, rightElement }) => (
    <div 
      className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="text-primary-500">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
      {rightElement}
    </div>
  );

  const QuickActionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }> = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center space-y-2 hover:border-primary-300 hover:bg-primary-50 transition-all"
    >
      <div className="text-primary-500">
        {icon}
      </div>
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </button>
  );

  if (isLoading) {
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
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentUser?.name || 'User'}</h1>
              <div className="bg-white/20 px-3 py-1 rounded-full inline-block mt-2">
                <span className="text-sm font-semibold">
                  {currentUser?.isArtist ? '🎤 Artist' : '🎵 Music Lover'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard
            title="Purchased"
            value={purchasedAlbums.length.toString()}
            icon={<Music size={24} className="text-white" />}
            color="bg-primary-500"
          />
          <StatCard
            title={currentUser?.isArtist ? 'Uploaded' : 'Downloaded'}
            value={
              currentUser?.isArtist
                ? userAlbums.length.toString()
                : (currentUser?.downloadedAlbums.length || 0).toString()
            }
            icon={currentUser?.isArtist ? 
              <Upload size={24} className="text-white" /> : 
              <Download size={24} className="text-white" />
            }
            color="bg-secondary-500"
          />
        </div>

        {/* Artist Dashboard */}
        {currentUser?.isArtist && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp size={24} className="text-primary-500" />
              <h3 className="text-xl font-bold text-primary-700">Artist Dashboard</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <QuickActionButton
                icon={<Upload size={24} />}
                label="Upload"
                onClick={() => alert('Navigate to upload screen from bottom nav!')}
              />
              <QuickActionButton
                icon={<BarChart3 size={24} />}
                label="Analytics"
                onClick={() => alert('Analytics feature coming soon!')}
              />
              <QuickActionButton
                icon={<Wallet size={24} />}
                label="Earnings"
                onClick={() => alert('Earnings dashboard coming soon!')}
              />
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">Settings</h3>
          </div>
          
          <SettingItem
            icon={currentUser?.isArtist ? <Music size={24} /> : <UserIcon size={24} />}
            title={currentUser?.isArtist ? 'Disable Artist Mode' : 'Enable Artist Mode'}
            subtitle={
              currentUser?.isArtist
                ? 'Switch back to music listener mode'
                : 'Start uploading and selling your music'
            }
            onClick={toggleArtistMode}
            rightElement={
              <div className={`w-12 h-6 rounded-full transition-colors ${
                currentUser?.isArtist ? 'bg-primary-500' : 'bg-gray-300'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  currentUser?.isArtist ? 'translate-x-6' : 'translate-x-0.5'
                } mt-0.5`} />
              </div>
            }
          />
          
          <div className="border-t border-gray-100">
            <SettingItem
              icon={<Music size={24} />}
              title="Audio Quality"
              subtitle="High (320 kbps)"
              onClick={() => alert('Audio quality settings coming soon!')}
            />
          </div>
          
          <div className="border-t border-gray-100">
            <SettingItem
              icon={<Download size={24} />}
              title="Auto Download"
              subtitle="Download purchased music automatically"
              onClick={() => alert('Auto download settings coming soon!')}
            />
          </div>
          
          <div className="border-t border-gray-100">
            <SettingItem
              icon={<Settings size={24} />}
              title="Theme"
              subtitle="System default"
              onClick={() => alert('Theme settings coming soon!')}
            />
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">About MelodyMarket</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            A revolutionary music marketplace where artists can share their music and fans can
            discover and support their favorite musicians. Built with love for the music community.
          </p>
          <p className="text-gray-500 text-sm">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;