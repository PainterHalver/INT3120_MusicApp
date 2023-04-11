import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {Song} from '../types';
import React, {createContext} from 'react';
import SongBottomSheet from '../components/SongBottomSheet';

export type SongBottomSheetModalContextType = {
  selectedSong: Song;
  songBottomSheetRef: React.RefObject<BottomSheetModalMethods>;

  setSelectedSong: (selectedSong: Song) => void;
};

const SongBottomSheetModalContext = createContext<SongBottomSheetModalContextType>({
  selectedSong: {} as Song,
  songBottomSheetRef: {} as React.RefObject<BottomSheetModalMethods>,
  setSelectedSong: () => {},
});

export const SongBottomSheetModalProvider = ({children}: any) => {
  const [selectedSong, setSelectedSong] = React.useState<Song>({} as Song);
  const songBottomSheetRef = React.useRef<BottomSheetModalMethods>(null);

  return (
    <SongBottomSheetModalContext.Provider
      value={{
        selectedSong,
        songBottomSheetRef,
        setSelectedSong,
      }}>
      <SongBottomSheet ref={songBottomSheetRef} />
      {children}
    </SongBottomSheetModalContext.Provider>
  );
};

export const useSongBottomSheetModalContext = () => React.useContext(SongBottomSheetModalContext);
