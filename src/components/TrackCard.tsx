import React, { useState, useEffect } from 'react';
import { Track } from '../types';
import { Play, Pause, Music, Clock, TrendingUp } from 'lucide-react';
import AudioService from '../services/AudioService';

interface TrackCardProps {
  track: Track;
  onTap?: () => void;
  showPlayButton?: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onTap,
  showPlayButton = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioService = AudioService.getInstance();

  useEffect(() => {
    const handlePlayStateChange = (playing: boolean) => {
      if (audioService.getCurrentTrackId() === track.id) {
        setIsPlaying(playing);
        setIsLoading(false);
      } else {
        setIsPlaying(false);
        setIsLoading(false);
      }
    };

    audioService.addPlayStateListener(handlePlayStateChange);
    return () => audioService.removePlayStateListener(handlePlayStateChange);
  }, [track.id]);

  const togglePreview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!track.previewUrl) return;
    
    try {
      if (isPlaying) {
        await audioService.pause();
      } else {
        setIsLoading(true);
        await audioService.playPreview(track.id, track.previewUrl);
      }
    } catch (error) {
      console.error('Error playing preview:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={onTap}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={track.coverImageUrl || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2MS4zNDMgMTAwIDEzMCAxMzEuMzQzIDEzMCAxNzBWMjMwQzEzMCAyNjguNjU3IDE2MS4zNDMgMzAwIDIwMCAzMDBDMjM4LjY1NyAzMDAgMjcwIDI2OC42NTcgMjcwIDIzMFYxNzBDMjcwIDEzMS4zNDMgMjM4LjY1NyAxMDAgMjAwIDEwMFoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Track Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
            {track.title}
          </h3>
          <p className="text-white/90 text-xs mb-2 line-clamp-1">
            {track.artist}
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              track.isFree ? 'bg-accent-500 text-white' : 'bg-white text-primary-500'
            }`}>
              {track.isFree ? 'FREE' : `$${track.price.toFixed(2)}`}
            </span>
            <div className="flex items-center text-white/80 text-xs">
              <TrendingUp size={10} className="mr-1" />
              {formatNumber(track.streamCount)}
            </div>
          </div>
        </div>
        
        {/* Play Button */}
        {showPlayButton && track.previewUrl && (
          <button
            onClick={togglePreview}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-primary-500 p-2 rounded-full transition-all duration-200 hover:scale-110"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackCard;