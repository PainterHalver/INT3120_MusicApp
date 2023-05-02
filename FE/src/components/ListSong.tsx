import { memo } from 'react';
import { Song, songsToTracks } from '../types';
import { View, TouchableNativeFeedback } from 'react-native';
import ItemSongResult from './ItemSongResult';
import TrackPlayer from 'react-native-track-player';
import { useLoadingModal } from '../contexts/LoadingModalContext';
import { useNavigation } from '@react-navigation/native';

type Props = {
    songs: Song[],
    paddingVertical?: number,
}

const ListSong = ({ songs, paddingVertical = 0 }: Props) => {
    const navigation = useNavigation();
    const { setLoading } = useLoadingModal();

    const playSongInPlaylist = async (track: Song, index: number) => {
        try {
            setLoading(true);
            const tracks = songsToTracks(songs);

            await TrackPlayer.reset();

            // Thêm track cần play rồi thêm các track còn lại vào trước và sau track cần play
            await TrackPlayer.add(tracks[index]);
            await TrackPlayer.add(tracks.slice(0, index), 0);
            await TrackPlayer.add(tracks.slice(index + 1, tracks.length));

            navigation.navigate('Player');
            await TrackPlayer.play();
        } catch (error) {
            console.log('playSongInPlaylist:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {songs.map((song, index) => {
                return (
                    <TouchableNativeFeedback
                        key={index}
                        onPress={() => {
                            playSongInPlaylist(song, index);
                        }}>
                        <View style={{ width: '100%', paddingVertical: paddingVertical }}>
                            {/* <VerticalItemSong song={song} /> */}
                            <ItemSongResult song={song} />
                        </View>
                    </TouchableNativeFeedback>
                );
            })}
        </>
    )
}
export default ListSong