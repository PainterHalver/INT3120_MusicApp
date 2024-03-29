import React, {createContext, useContext, useEffect} from 'react';
import {Animated, AppState} from 'react-native';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  Progress,
  RepeatMode,
  State,
  Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {addEventListener, clearNowPlayingMetadata} from 'react-native-track-player/lib/trackPlayer';
import firestore from '@react-native-firebase/firestore';

import {ZingMp3} from '../ZingMp3';
import {Song} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BottomSheetModal} from '@gorhom/bottom-sheet';
import SongBottomSheet from '../components/SongBottomSheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useAuth} from './AuthContext';

export type Word = {
  data: string;
  endTime: number;
  startTime: number;
};

export type LineLyric = {
  words: Word[];
};

export type progress = {
  buffered: number;
  duration: number;
  position: number;
};

export type PlayerContextType = {
  currentTrack: Track;
  isReady: boolean;
  isPlaying: boolean;
  lastArtwork: string;
  isLoadingFavorite: boolean;
  currentTrackIsFavorite: boolean;
  lyrics: LineLyric[];
  setIsPlaying: (isPlaying: boolean) => void;
  setLastArtwork: (currentArtwork: string) => void;
  setIsLoadingFavorite: (isLoadingFavorite: boolean) => void;
  setCurrentTrackIsFavorite: (currentTrackIsFavorite: boolean) => void;
  setLyrics: (lyrics: LineLyric[]) => void;
};

// TODO: Do something with this
export const defaultTrack: Track = {
  id: 'ZUIIIBWU',
  title: 'Default Track Title',
  artist: 'Default Track Artist',
  url: '',
  duration: 0,
  artwork: require('./../../assets/default.png'),
};

export const defaultSong: Song = {
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
  lastArtwork: require('./../../assets/default.png'),
  lyrics: [],
  isLoadingFavorite: false,
  currentTrackIsFavorite: false,
  setIsPlaying: () => {},
  setLastArtwork: () => {},
  setLyrics: () => {},
  setIsLoadingFavorite: () => {},
  setCurrentTrackIsFavorite: () => {},
});

export const PlayerProvider = ({children}: any) => {
  const [track, setTrack] = React.useState<Track>(defaultTrack);
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [lastArtwork, setLastArtwork] = React.useState<string>(
    track.artwork || require('./../../assets/default.png'),
  );
  const [isLoadingFavorite, setIsLoadingFavorite] = React.useState(false);
  const [currentTrackIsFavorite, setCurrentTrackIsFavorite] = React.useState(false);
  const [lyrics, setLyrics] = React.useState<LineLyric[]>([]);
  const {user} = useAuth();

  const state = usePlaybackState();

  useEffect(() => {
    console.log('STATE:', state);
  }, [state]);

  const getLyricSentences = async (track: Track | undefined): Promise<LineLyric[]> => {
    try {
      if (!track) return [];

      const data = await ZingMp3.getLyric(track.id);

      if (!data || !data.sentences || data.sentences.length === 0) {
        return [{words: [{data: 'Không tìm thấy lời bài hát', endTime: -1, startTime: -1}]}];
      }

      return data.sentences;
    } catch (error) {
      console.log('PlayerContext/getLyricSentences:', error);
      return [];
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

        await TrackPlayer.reset();
      } catch (e) {
        console.log(e);
      }
    };
    setUpTrackPlayer();
  }, []);

  useEffect(() => {
    const playerListener = addEventListener(Event.PlaybackActiveTrackChanged, async () => {
      let track = await TrackPlayer.getActiveTrack();
      const index = await TrackPlayer.getActiveTrackIndex();
      console.log('TRACK CHANGED', index);

      // Một lần chuyển track có metadata, một lần nữa sau khi fetch được url
      if (track) {
        setTrack(track);
      } else {
        return;
      }

      // Load URL nếu chưa có
      if (!track.url) {
        console.log(track.title + ': Chưa có url, đang lấy url...');
        const data = await ZingMp3.getSong(track.id);
        const url = data.data['128'];

        const lastRepeatMode = await TrackPlayer.getRepeatMode();
        await TrackPlayer.setRepeatMode(RepeatMode.Off);
        await TrackPlayer.load({
          ...track,
          url,
        });
        await TrackPlayer.setRepeatMode(lastRepeatMode);

        return;
      }

      // Load favorite
      if (user) {
        setIsLoadingFavorite(true);
        try {
          const favPlaylistid = await AsyncStorage.getItem('favoritePlaylistId');
          if (!favPlaylistid) return;
          const isFavorite = await firestore()
            .collection('playlists')
            .doc(favPlaylistid)
            .collection('songs')
            .where('encodeId', '==', track.id)
            .get();
          setCurrentTrackIsFavorite(!isFavorite.empty);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingFavorite(false);
        }
      }

      // Clear lyrics
      setLyrics([]);
      setLyrics(await getLyricSentences(track));
    });

    const errorListener = addEventListener(Event.PlaybackError, async e => {
      console.log('PLAYBACK ERROR:', e);
    });

    const nativeEventListener = AppState.addEventListener('change', async appState => {
      if (appState === 'active') {
        const state = await TrackPlayer.getState();
        setIsPlaying(state === State.Playing);
      }
    });

    return () => {
      playerListener.remove();
      errorListener.remove();
      nativeEventListener.remove();
    };
  }, [user]);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack: track,
        isReady,
        isPlaying,
        lastArtwork,
        lyrics,
        isLoadingFavorite,
        currentTrackIsFavorite,
        setIsPlaying,
        setLastArtwork,
        setLyrics,
        setIsLoadingFavorite,
        setCurrentTrackIsFavorite,
      }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
