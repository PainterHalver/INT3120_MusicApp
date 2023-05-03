import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Song} from '../types';
import React, {createContext, useEffect} from 'react';
import SongBottomSheet from '../components/SongBottomSheet';
import ChoosePlaylistBottomSheet from '../components/ChoosePlaylistBottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {usePlayer} from './PlayerContext';

export type BottomSheetContextType = {
  selectedSong: Song;
  ownerId: string;
  songBottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  playlistBottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  selectedSongIsFavorite: boolean;
  setOwnerId: (id: string) => void;
  setSelectedSong: (selectedSong: Song) => void;
  setSelectedSongIsFavorite: (isFavorite: boolean) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType>({
  selectedSong: {} as Song,
  songBottomSheetRef: {} as React.RefObject<BottomSheetModalMethods>,
  playlistBottomSheetRef: {} as React.RefObject<BottomSheetModalMethods>,
  selectedSongIsFavorite: false,
  setSelectedSong: () => {},
  setSelectedSongIsFavorite: () => {},
  ownerId: {} as string,
  setOwnerId: () => {},
});

export const BottomSheetProvider = ({children}: any) => {
  const [selectedSong, setSelectedSong] = React.useState<Song>({} as Song);
  const {currentTrackIsFavorite} = usePlayer();
  const [selectedSongIsFavorite, setSelectedSongIsFavorite] = React.useState<boolean>(false);
  const [ownerId, setOwnerId] = React.useState<string>();
  const songBottomSheetRef = React.useRef<BottomSheetModalMethods>(null);
  const playlistBottomSheetRef = React.useRef<BottomSheetModalMethods>(null);

  useEffect(() => {
    (async () => {
      // Check selectedSong có favorite hay không
      const favoriteSongIds = JSON.parse((await AsyncStorage.getItem('favoriteSongEncodeIds')) || '[]');
      if (favoriteSongIds.includes(selectedSong.encodeId)) {
        setSelectedSongIsFavorite(true);
      } else {
        setSelectedSongIsFavorite(false);
      }
    })();
  }, [selectedSong, currentTrackIsFavorite]);

  return (
    <BottomSheetContext.Provider
      value={{
        selectedSong,
        songBottomSheetRef,
        playlistBottomSheetRef,
        selectedSongIsFavorite,
        setSelectedSong,
        setSelectedSongIsFavorite,
        ownerId,
        setOwnerId,
      }}>
      <SongBottomSheet ref={songBottomSheetRef} />
      <ChoosePlaylistBottomSheet ref={playlistBottomSheetRef} />
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => React.useContext(BottomSheetContext);
