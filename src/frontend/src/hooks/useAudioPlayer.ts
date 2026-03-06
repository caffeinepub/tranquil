import { useCallback, useEffect, useRef, useState } from "react";

interface AudioPlayerState {
  playingId: string | null;
  localTrackName: string | null;
  localTrackUrl: string | null;
  isLocalPlaying: boolean;
}

export function useAudioPlayer() {
  const [state, setState] = useState<AudioPlayerState>({
    playingId: null,
    localTrackName: null,
    localTrackUrl: null,
    isLocalPlaying: false,
  });

  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSound = useCallback((id: string) => {
    setState((prev) => {
      if (prev.playingId === id) {
        return { ...prev, playingId: null };
      }
      return { ...prev, playingId: id };
    });
  }, []);

  const loadLocalTrack = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setState((prev) => {
      if (prev.localTrackUrl) URL.revokeObjectURL(prev.localTrackUrl);
      return {
        ...prev,
        localTrackName: file.name.replace(/\.[^/.]+$/, ""),
        localTrackUrl: url,
        isLocalPlaying: false,
      };
    });
  }, []);

  const toggleLocalTrack = useCallback(() => {
    setState((prev) => {
      if (!prev.localTrackUrl) return prev;
      return { ...prev, isLocalPlaying: !prev.isLocalPlaying };
    });
  }, []);

  useEffect(() => {
    if (state.isLocalPlaying && state.localTrackUrl) {
      if (!localAudioRef.current) {
        localAudioRef.current = new Audio(state.localTrackUrl);
      }
      localAudioRef.current.play().catch(() => {});
    } else if (localAudioRef.current) {
      localAudioRef.current.pause();
    }
  }, [state.isLocalPlaying, state.localTrackUrl]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: cleanup runs once on unmount intentionally
  useEffect(() => {
    return () => {
      if (localAudioRef.current) {
        localAudioRef.current.pause();
        localAudioRef.current = null;
      }
      if (state.localTrackUrl) URL.revokeObjectURL(state.localTrackUrl);
    };
  }, []);

  return { state, toggleSound, loadLocalTrack, toggleLocalTrack };
}
