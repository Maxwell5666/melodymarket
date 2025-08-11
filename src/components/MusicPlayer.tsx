import React, { useState, useEffect, useRef } from 'react';
import { Track, Album } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat } from 'lucide-react';
import AudioService from '../services/AudioService';

interface MusicPlayerProps {
  album: Album;
  currentTrack: Track;
  onTrackChange?: (track: Track) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  album,
  currentTrack,
  onTrackChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioService = AudioService.getInstance();
  const progressInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handlePlayStateChange = (playing: boolean) => {
      setIsPlaying(playing);
      
      if (playing) {
        startProgressTracking();
      } else {
        stopProgressTracking();
      }
    };

    audioService.addPlayStateListener(handlePlayStateChange);
    return () => {
      audioService.removePlayStateListener(handlePlayStateChange);
      stopProgressTracking();
    };
  }, []);

  const startProgressTracking = () => {
    stopProgressTracking();
    progressInterval.current = setInterval(() => {
      const current = audioService.getCurrentTime();
      const total = audioService.getDuration();
      
      setCurrentTime(current);
      setDuration(total);
      setProgress(total > 0 ? (current / total) * 100 : 0);
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await audioService.pause();
      } else {
        if (currentTrack.previewUrl) {
          await audioService.playPreview(currentTrack.id, currentTrack.previewUrl);
        }
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const previousTrack = () => {
    const currentIndex = album.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      onTrackChange?.(album.tracks[currentIndex - 1]);
    }
  };

  const nextTrack = () => {
    const currentIndex = album.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < album.tracks.length - 1) {
      onTrackChange?.(album.tracks[currentIndex + 1]);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * duration;
    audioService.seek(newTime);
    setProgress(newProgress);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-4 flex-1">
            <img
              src={currentTrack.coverImageUrl || album.coverImageUrl}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">
                {currentTrack.title}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={previousTrack}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              disabled={album.tracks.findIndex(t => t.id === currentTrack.id) === 0}
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full transition-all duration-200 hover:scale-105"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button
              onClick={nextTrack}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              disabled={album.tracks.findIndex(t => t.id === currentTrack.id) === album.tracks.length - 1}
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <Heart size={18} />
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <Shuffle size={18} />
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <Repeat size={18} />
            </button>
            
            <div className="flex items-center space-x-2">
              <Volume2 size={18} className="text-gray-600" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;