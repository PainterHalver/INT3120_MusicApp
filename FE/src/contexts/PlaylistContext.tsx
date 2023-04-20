import {createContext, useContext, useEffect, useState} from 'react';
import {ToastAndroid} from 'react-native';
import {MyPlaylist} from '../types';
import {useAuth} from './AuthContext';
import firestore from '@react-native-firebase/firestore';

type PlaylistContextType = {
  loadingPlaylists: boolean;
  playlists: MyPlaylist[];
  setLoadingPlaylists: React.Dispatch<React.SetStateAction<boolean>>;
  setPlaylists: React.Dispatch<React.SetStateAction<MyPlaylist[]>>;
};

const PlaylistContext = createContext<PlaylistContextType>({} as PlaylistContextType);

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider = ({children}: {children: React.ReactNode}) => {
  const {user} = useAuth();
  const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<MyPlaylist[]>([]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setLoadingPlaylists(true);

        const favPlaylist = await firestore()
          .collection('playlists')
          .where('uid', '==', user.uid)
          .where('isFavorite', '==', true)
          .get();

        // Nếu chưa có playlist yêu thích thì tạo mới
        if (favPlaylist.empty) {
          const newFavPlaylist = await firestore().collection('playlists').add({
            uid: user.uid,
            name: 'Yêu thích',
            isFavorite: true,
          });
        }

        // Lấy tất cả playlist, cho favorite lên đầu
        const playlists = await firestore().collection('playlists').where('uid', '==', user.uid).get();
        const myPlaylists = playlists.docs
          .map(doc => {
            return {
              id: doc.id,
              ...doc.data(),
            } as MyPlaylist;
          })
          .sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return 0;
          });

        setPlaylists(myPlaylists);
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Có lỗi khi tải danh sách playlist', ToastAndroid.SHORT);
      } finally {
        setLoadingPlaylists(false);
      }
    })();
  }, [user]);

  return (
    <PlaylistContext.Provider
      value={{
        loadingPlaylists,
        playlists,
        setLoadingPlaylists,
        setPlaylists,
      }}>
      {children}
    </PlaylistContext.Provider>
  );
};
