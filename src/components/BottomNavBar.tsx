import React from 'react';
import { Home, Library, Upload, User } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'discover', label: 'Discover', icon: Home },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
              currentTab === id
                ? 'text-primary-500 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={24} className={currentTab === id ? 'text-primary-500' : ''} />
            <span className={`text-xs mt-1 font-medium ${
              currentTab === id ? 'text-primary-500' : ''
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavBar;