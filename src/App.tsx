import React, { useState, useEffect } from 'react';
import { User } from './types';
import BottomNavBar from './components/BottomNavBar';
import DiscoverScreen from './screens/DiscoverScreen';
import LibraryScreen from './screens/LibraryScreen';
import UploadScreen from './screens/UploadScreen';
import ProfileScreen from './screens/ProfileScreen';
import StorageService from './services/StorageService';

function App() {
  const [currentTab, setCurrentTab] = useState('discover');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await StorageService.init();
      const user = await StorageService.getCurrentUser();
      
      if (!user) {
        await StorageService.setCurrentUser('Music Lover', 'user@melodymarket.com');
        const newUser = await StorageService.getCurrentUser();
        setCurrentUser(newUser);
      } else {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'discover':
        return <DiscoverScreen />;
      case 'library':
        return <LibraryScreen />;
      case 'upload':
        return <UploadScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <DiscoverScreen />;
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-pink-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-wide">MelodyMarket</h1>
          <p className="text-xl text-white/90 mb-8">Where Music Meets Opportunity</p>
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentScreen()}
      <BottomNavBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

export default App;