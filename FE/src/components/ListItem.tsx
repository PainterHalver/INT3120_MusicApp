import ItemAlbum from './ItemAlbum';
import {View, Text, ScrollView, TouchableNativeFeedback} from 'react-native';
import {memo} from 'react';
import {COLORS} from '../constants';
import {Playlist} from '../types';
import TrackPlayer from 'react-native-track-player';
import {useLoadingModal} from '../contexts/LoadingModalContext';
import {useNavigation} from '@react-navigation/native';
import {usePlaylist} from '../contexts/PlaylistContext';
import {ZingMp3} from '../ZingMp3';
type Props = {
  name: string;
  data: Array<Playlist>;
};
const ListItem = ({data, name}: Props) => {
  const {setPlaylist} = usePlaylist();
  const {setLoading} = useLoadingModal();
  const navigation = useNavigation();

  const setPlaylistDetail = async (playlist: Playlist) => {
    try {
      setLoading(true);
      const res = await ZingMp3.getDetailPlaylist(playlist.encodeId);
      setPlaylist(res);
      setLoading(false);
      navigation.navigate('PlaylistDetail');
    } catch (error) {
      console.log('playSongInPlaylist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flexDirection: 'column', paddingTop: 25}}>
      <View style={{paddingLeft: 17}}>
        <Text style={{fontSize: 22, color: 'black', fontWeight: '700'}}>{name}</Text>
      </View>
      <ScrollView
        style={{paddingTop: 20}}
        horizontal={true}
        disableScrollViewPanResponder={true}
        showsHorizontalScrollIndicator={false}>
        <View style={{marginLeft: 10}} />
        {data && data.length > 0 ? (
          data.map((item, index) => {
            return (
              <TouchableNativeFeedback
                key={index}
                background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                onPress={() => setPlaylistDetail(item)}>
                <View>
                  <ItemAlbum
                    description={item.title}
                    image={item?.thumbnail ? item.thumbnail : 'cccc'}
                    size={135}
                    key={index}
                  />
                </View>
              </TouchableNativeFeedback>
            );
          })
        ) : (
          <View style={{height: 120}}>
            <Text style={{paddingLeft: 10}}>Chưa có mục nào</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default memo(ListItem);
