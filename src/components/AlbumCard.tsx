import React from 'react';
import { Album } from '../types/index.js';
import { ShoppingCart, Music, Clock, CheckCircle, Download } from 'lucide-react';

interface AlbumCardProps {
  album: Album;
  onTap?: () => void;
  showPurchaseButton?: boolean;
  onPurchase?: () => void;
  isPurchased?: boolean;
  isDownloaded?: boolean;
  onDownload?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  onTap,
  showPurchaseButton = true,
  onPurchase,
  isPurchased = false,
  isDownloaded = false,
  onDownload,
}) => {
  const formatDate = (date: Date): string => {
    const now = new Date();
    const difference = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (difference === 0) return 'Today';
    if (difference === 1) return 'Yesterday';
    if (difference < 7) return `${difference}d ago`;
    if (difference < 30) return `${Math.floor(difference / 7)}w ago`;
    return `${Math.floor(difference / 30)}m ago`;
  };

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={onTap}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={album.coverImageUrl}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2MS4zNDMgMTAwIDEzMCAxMzEuMzQzIDEzMCAxNzBWMjMwQzEzMCAyNjguNjU3IDE2MS4zNDMgMzAwIDIwMCAzMDBDMjM4LjY1NyAzMDAgMjcwIDI2OC42NTcgMjcwIDIzMFYxNzBDMjcwIDEzMS4zNDMgMjM4LjY1NyAxMDAgMjAwIDEwMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+';
          }}
        />
        
        {isPurchased && (
          <div className="absolute top-3 right-3 bg-primary-500 text-white p-2 rounded-full">
            <CheckCircle size={16} />
          </div>
        )}
        
        <div className="absolute bottom-3 left-3 bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {album.genre}
        </div>
        
        {!isPurchased && (
          <div className="absolute bottom-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            ${album.price.toFixed(2)}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
          {album.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-1">
          {album.artistName}
        </p>
        
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <Music size={14} className="mr-1" />
          <span>{album.tracks.length} tracks</span>
        </div>
        
        <div className="flex items-center justify-between text-gray-400 text-xs mb-4">
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            <span>{formatDate(album.createdAt)}</span>
          </div>
        </div>
        
        {showPurchaseButton && !isPurchased && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPurchase?.();
            }}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart size={16} />
            Buy Now
          </button>
        )}
        
        {isPurchased && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-primary-500 font-semibold">
              <CheckCircle size={16} className="mr-2" />
              Owned
            </div>
            {onDownload && !isDownloaded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload();
                }}
                className="bg-accent-500 hover:bg-accent-600 text-white p-2 rounded-full transition-colors"
              >
                <Download size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumCard;