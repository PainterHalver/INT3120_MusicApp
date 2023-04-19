import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Song} from '../types';
import React, {createContext} from 'react';
import SongBottomSheet from '../components/SongBottomSheet';
import ChoosePlaylistBottomSheet from '../components/ChoosePlaylistBottomSheet';

export type BottomSheetContextType = {
  selectedSong: Song;
  songBottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  playlistBottomSheetRef: React.RefObject<BottomSheetModalMethods>;

  setSelectedSong: (selectedSong: Song) => void;
};

const BottomSheetContext = createContext<BottomSheetContextType>({
  selectedSong: {} as Song,
  songBottomSheetRef: {} as React.RefObject<BottomSheetModalMethods>,
  playlistBottomSheetRef: {} as React.RefObject<BottomSheetModalMethods>,
  setSelectedSong: () => {},
});

export const BottomSheetProvider = ({children}: any) => {
  const [selectedSong, setSelectedSong] = React.useState<Song>({} as Song);
  const songBottomSheetRef = React.useRef<BottomSheetModalMethods>(null);
  const playlistBottomSheetRef = React.useRef<BottomSheetModalMethods>(null);

  return (
    <BottomSheetContext.Provider
      value={{
        selectedSong,
        songBottomSheetRef,
        playlistBottomSheetRef,
        setSelectedSong,
      }}>
      <SongBottomSheet ref={songBottomSheetRef} />
      <ChoosePlaylistBottomSheet ref={playlistBottomSheetRef} />
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => React.useContext(BottomSheetContext);
