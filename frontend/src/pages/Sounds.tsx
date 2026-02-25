import React, { useRef } from 'react';
import { SoundTile } from '../components/SoundTile';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { Upload, Play, Pause, Music } from 'lucide-react';

const NATURE_SOUNDS = [
  { id: 'rain', title: 'Rain', emoji: '🌧️' },
  { id: 'ocean', title: 'Ocean Waves', emoji: '🌊' },
  { id: 'forest', title: 'Forest', emoji: '🌲' },
  { id: 'white-noise', title: 'White Noise', emoji: '🌫️' },
  { id: 'fireplace', title: 'Fireplace', emoji: '🔥' },
  { id: 'wind-chimes', title: 'Wind Chimes', emoji: '🎐' },
];

export function Sounds() {
  const { state, toggleSound, loadLocalTrack, toggleLocalTrack } = useAudioPlayer();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadLocalTrack(file);
  };

  return (
    <div className="px-4 py-5 space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Calm Sounds 🎵</h1>
        <p className="text-sm text-muted-foreground mt-1">Immerse yourself in soothing audio</p>
      </div>

      {/* Nature Sounds */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Nature & Ambient</h2>
        <div className="grid grid-cols-3 gap-3">
          {NATURE_SOUNDS.map(sound => (
            <SoundTile
              key={sound.id}
              id={sound.id}
              title={sound.title}
              emoji={sound.emoji}
              isPlaying={state.playingId === sound.id}
              onToggle={toggleSound}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          * Visual simulation — connect headphones for actual audio
        </p>
      </div>

      {/* My Music */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">My Music</h2>

        <div
          className="p-5 rounded-2xl border-2 border-dashed border-border bg-card/50
            flex flex-col items-center gap-3 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Upload size={22} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Upload from Device</p>
            <p className="text-xs text-muted-foreground mt-0.5">MP3, WAV, OGG, FLAC supported</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {state.localTrackName && (
          <div className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Music size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{state.localTrackName}</p>
              <p className="text-xs text-muted-foreground">Local track</p>
            </div>
            <button
              onClick={toggleLocalTrack}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                state.isLocalPlaying
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10'
              }`}
            >
              {state.isLocalPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            </button>
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15">
        <p className="text-xs text-muted-foreground leading-relaxed">
          💡 <strong>Tip:</strong> Combine nature sounds with breathing exercises for maximum relaxation effect.
        </p>
      </div>
    </div>
  );
}
