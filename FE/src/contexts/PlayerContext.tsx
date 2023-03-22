import React, {createContext, useContext, useEffect} from 'react';
import {AppState} from 'react-native';
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

  setIsPlaying: (isPlaying: boolean) => void;
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
  setIsPlaying: () => {},
});

export const PlayerProvider = ({children}: any) => {
  const [track, setTrack] = React.useState<Track>(defaultTrack);
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const progress = useProgress(250);

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
        setIsPlaying,
      }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
