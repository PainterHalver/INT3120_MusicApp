import React, {createContext, useContext, useEffect} from 'react';
import {Animated, AppState} from 'react-native';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  Progress,
  State,
  Track,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {addEventListener} from 'react-native-track-player/lib/trackPlayer';

import {tracks} from '../../App';

export type PlayerContextType = {
  currentTrack: Track;
  isReady: boolean;
  isPlaying: boolean;
  progress: Progress;
  rotation: Animated.Value;
  pausedRotationValue: number;
  isRotating: boolean;
  lastArtwork: string;

  setIsPlaying: (isPlaying: boolean) => void;
  setPausedRotationValue: (pausedRotationValue: number) => void;
  setIsRotating: (isRotating: boolean) => void;
  setLastArtwork: (currentArtwork: string) => void;
};

const defaultTrack: Track = {
  id: '1',
  title: 'Default Track Title',
  artist: 'Default Track Artist',
  url: '',
  duration: 0,
  artwork: require('./../../assets/default.png'),
};

const PlayerContext = createContext<PlayerContextType>({
  currentTrack: defaultTrack,
  isReady: false,
  isPlaying: false,
  progress: {buffered: 0, position: 0, duration: 0},
  rotation: new Animated.Value(0),
  pausedRotationValue: 0,
  isRotating: false,
  lastArtwork: require('./../../assets/default.png'),
  setIsPlaying: () => {},
  setPausedRotationValue: () => {},
  setIsRotating: () => {},
  setLastArtwork: () => {},
});

export const PlayerProvider = ({children}: any) => {
  const [track, setTrack] = React.useState<Track>(defaultTrack);
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const progress = useProgress(250);
  const rotation = React.useRef(new Animated.Value(0)).current;
  const [pausedRotationValue, setPausedRotationValue] = React.useState(0);
  const [isRotating, setIsRotating] = React.useState(false);
  const [lastArtwork, setLastArtwork] = React.useState<string>(
    track.artwork || require('./../../assets/default.png'),
  );

  useTrackPlayerEvents([Event.PlaybackState], (event: any) => {
    if (event.type === Event.PlaybackState) {
      if (event.state === State.Playing) {
        setIsPlaying(true);
      } else if (event.state === State.Paused) {
        setIsPlaying(false);
      }
    }
  });

  useEffect(() => {
    const setUpTrackPlayer = async () => {
      try {
        // If TrackPlayer is already initialized, skip
        if (!(await TrackPlayer.isServiceRunning())) {
          await TrackPlayer.setupPlayer({});
          await TrackPlayer.updateOptions({
            android: {
              appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            },
            capabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SkipToNext,
              Capability.SkipToPrevious,
              // Capability.Stop,
              Capability.SeekTo,
            ],
            compactCapabilities: [
              Capability.Play,
              Capability.Pause,
              Capability.SkipToNext,
              Capability.SkipToPrevious,
              Capability.SeekTo,
            ],
            progressUpdateEventInterval: 1,
          });
          console.log('TrackPlayer is initialized');
          setIsReady(true);
        }

        // TODO: Delete these
        await TrackPlayer.reset();
        await TrackPlayer.add(tracks);
        console.log(`Added ${tracks.length} tracks`);
      } catch (e) {
        console.log(e);
      }
    };
    setUpTrackPlayer();
  }, []);

  useEffect(() => {
    addEventListener(Event.PlaybackActiveTrackChanged, async () => {
      let track = await TrackPlayer.getActiveTrack();
      if (track) {
        setTrack(track);
      }
    });

    AppState.addEventListener('change', async appState => {
      if (appState === 'active') {
        const state = await TrackPlayer.getState();
        setIsPlaying(state === State.Playing);
      }
    });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack: track,
        isReady,
        isPlaying,
        progress,
        rotation,
        pausedRotationValue,
        isRotating,
        lastArtwork,
        setIsPlaying,
        setPausedRotationValue,
        setIsRotating,
        setLastArtwork,
      }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
