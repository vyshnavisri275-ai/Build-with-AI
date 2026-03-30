import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-blue)"
  },
  {
    id: 2,
    title: "Cyber Rush",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-pink)"
  },
  {
    id: 3,
    title: "Midnight Grid",
    artist: "Digital Pulse",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "var(--color-neon-green)"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex(prev => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBack = () => {
    setCurrentTrackIndex(prev => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md p-6 bg-gray-900/80 rounded-2xl neon-border-pink backdrop-blur-lg">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center neon-border-pink animate-pulse">
          <Music2 className="w-8 h-8 text-neon-pink" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold truncate neon-text-pink">{currentTrack.title}</h3>
          <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-neon-pink shadow-[0_0_10px_#ff00ff] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={skipBack} className="p-2 text-gray-400 hover:text-neon-pink transition-colors">
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 bg-neon-pink rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_20px_#ff00ff]"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>

        <button onClick={skipForward} className="p-2 text-gray-400 hover:text-neon-pink transition-colors">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest justify-center">
        <Volume2 className="w-3 h-3" />
        <span>Audio Visualizer Active</span>
      </div>
    </div>
  );
};
