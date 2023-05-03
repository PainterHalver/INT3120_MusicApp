import React, { createContext, useContext, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { MyPlaylist, Playlist, SharedPlaylist } from '../types';
import { useAuth } from './AuthContext';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZingMp3 } from '../ZingMp3';

type PlaylistContextType = {
  loadingPlaylists: boolean;
  playlists: MyPlaylist[];
  setLoadingPlaylists: React.Dispatch<React.SetStateAction<boolean>>;
  setPlaylists: React.Dispatch<React.SetStateAction<MyPlaylist[]>>;
  playlist: Playlist | null;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
  sharedPlaylists: SharedPlaylist[];
};

const PlaylistContext = createContext<PlaylistContextType>({} as PlaylistContextType);

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [loadingPlaylists, setLoadingPlaylists] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<MyPlaylist[]>([]);
  const [sharedPlaylists, setSharedPlaylists] = useState<SharedPlaylist[]>([]);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

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
          await AsyncStorage.setItem('favoritePlaylistId', newFavPlaylist.id);
        } else {
          await AsyncStorage.setItem('favoritePlaylistId', favPlaylist.docs[0].id);
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

        const sharedToMe = await firestore()
          .collection('playlists')
          .where('sharedTo', 'array-contains', user.uid)
          .get();
        const mySharedPlaylist = sharedToMe.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          } as SharedPlaylist;
        });

        setSharedPlaylists(mySharedPlaylist);
        setPlaylists(myPlaylists);
        setLoadingPlaylists(false);

        // Cache lại favorite songs id trong AsyncStorage
        const favSongEncodeIds = await firestore()
          .collection('playlists')
          .doc(myPlaylists[0].id)
          .collection('songs')
          .get()
          .then(querySnapshot => {
            return querySnapshot.docs.map(doc => doc.data().encodeId);
          });

        await AsyncStorage.setItem('favoriteSongEncodeIds', JSON.stringify(favSongEncodeIds));
      } catch (error) {
        console.log(error);
        ToastAndroid.show('Có lỗi khi tải danh sách playlist', ToastAndroid.SHORT);
      } finally {
        setLoadingPlaylists(false);
      }
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingPlaylists(true);
        const res = await ZingMp3.getDetailPlaylist('69IAZIWU');
        setPlaylist(res);
        setLoadingPlaylists(false);
      } catch (error) {
        setLoadingPlaylists(false);
      }
    })();
  }, []);

  return (
    <PlaylistContext.Provider
      value={{
        loadingPlaylists,
        playlists,
        sharedPlaylists,
        setLoadingPlaylists,
        setPlaylists,
        playlist,
        setPlaylist,
      }}>
      {children}
    </PlaylistContext.Provider>
  );
};
