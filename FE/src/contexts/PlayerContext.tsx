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
import {Song} from '../types';
import {ZingMp3} from '../zingmp3';

export type PlayerContextType = {
  currentTrack: Track;
  isReady: boolean;
  isPlaying: boolean;
  progress: Progress;
  rotation: Animated.Value;
  pausedRotationValue: number;
  isRotating: boolean;
  lastArtwork: string;
  selectedSong: Song;
  lyrics: string[];

  setIsPlaying: (isPlaying: boolean) => void;
  setPausedRotationValue: (pausedRotationValue: number) => void;
  setIsRotating: (isRotating: boolean) => void;
  setLastArtwork: (currentArtwork: string) => void;
  setSelectedSong: (selectedSong: Song) => void;
  setLyrics: (lyrics: string[]) => void;
};

const defaultTrack: Track = {
  id: '1',
  title: 'Default Track Title',
  artist: 'Default Track Artist',
  url: '',
  duration: 0,
  artwork: require('./../../assets/default.png'),
};

const defaultSong: Song = {
  encodeId: '',
  title: 'Default Song Title',
  artistsNames: 'Default Song Artist',
  thumbnailM: require('./../../assets/default_song_thumbnail.png'),
  thumbnail: require('./../../assets/default_song_thumbnail.png'),
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
  selectedSong: {} as Song,
  lyrics: [],
  setIsPlaying: () => {},
  setPausedRotationValue: () => {},
  setIsRotating: () => {},
  setLastArtwork: () => {},
  setSelectedSong: () => {},
  setLyrics: () => {},
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
  const [selectedSong, setSelectedSong] = React.useState<Song>(defaultSong);
  const [lyrics, setLyrics] = React.useState<string[]>([]);

  const getLyricSentences = async (track: Track | undefined): Promise<string[]> => {
    try {
      if (!track) return ['Không tìm thấy lời bài hát'];

      const data = await ZingMp3.getLyric(track.id);
      const lyricSentences = data.sentences.map(sentence => {
        return sentence.words.map(word => word.data).join(' ');
      });
      return lyricSentences;
    } catch (error) {
      console.log(error);
      return ['Không tìm thấy lời bài hát'];
    }
  };

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

      // Clear lyrics
      setLyrics(await getLyricSentences(track));
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
        selectedSong,
        lyrics,
        setIsPlaying,
        setPausedRotationValue,
        setIsRotating,
        setLastArtwork,
        setSelectedSong,
        setLyrics,
      }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
