import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect, useIsFocused} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Shadow} from 'react-native-shadow-2';
import TrackPlayer, {Track} from 'react-native-track-player';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import {COLORS} from '../../constants';
import {useLoadingModal} from '../../contexts/LoadingModalContext';
import FileSystem from '../../FileSystem';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import DownloadedTrackBottomSheet from './DownloadedTrackBottomSheet';
import ItemDownloadedTrackResult from './ItemDownloadedTrackResult';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Downloaded'>,
  StackScreenProps<RootStackParamList>
>;

const Downloaded = ({navigation}: Props) => {
  const {setLoading} = useLoadingModal();
  const [permissionError, setPermissionError] = React.useState<string>('');
  const [noTracksError, setNoTracksError] = React.useState<string>('');
  const [downloadedTracks, setDownloadedTracks] = React.useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = React.useState<Track>({} as Track);

  const downloadedTrackBottomSheetRef = React.useRef<BottomSheetModal>(null);

  const init = async () => {
    try {
      setNoTracksError('');
      await FileSystem.checkMediaPermission();
      const tracks = await FileSystem.getMusicFiles();
      if (tracks === null) {
        setNoTracksError('Không có bài hát nào trong máy');
      } else {
        setDownloadedTracks(tracks);
      }
    } catch (error) {
      console.log('Downloaded', error);
      setPermissionError('Bạn đã từ chối quyền truy cập thư viện');
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const playDownloadedTrack = async (track: Track) => {
    try {
      await TrackPlayer.reset();

      // Thêm track cần play rồi thêm các track còn lại vào trước và sau track cần play
      await TrackPlayer.add(downloadedTracks[track.index]);
      await TrackPlayer.add(downloadedTracks.slice(0, track.index), 0);
      await TrackPlayer.add(downloadedTracks.slice(track.index + 1, downloadedTracks.length));

      navigation.navigate('Player');
      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.containerWrapper}>
      <FocusAwareStatusBar translucent barStyle={'dark-content'} backgroundColor={'transparent'} />
      <View style={styles.container}>
        <Shadow
          sides={{bottom: true, top: false, end: false, start: false}}
          style={styles.headerContainer}
          stretch
          distance={2.5}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              padding: 5,
              justifyContent: 'space-between',
            }}>
            <Text style={{color: COLORS.TEXT_PRIMARY, fontSize: 25, fontWeight: '600'}}>Đã tải về</Text>
            <TouchableNativeFeedback
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE, true, 23)}
              onPress={async () => {
                try {
                  setDownloadedTracks([]);
                  await init();
                } catch (error) {
                  console.log(error);
                } finally {
                  setLoading(false);
                }
              }}>
              <View>
                <MaterialCommunityIcon name="reload" size={25} color={COLORS.TEXT_PRIMARY} />
              </View>
            </TouchableNativeFeedback>
          </View>
        </Shadow>
        <View style={{flex: 1}}>
          {permissionError ? (
            <Text>{permissionError}</Text>
          ) : (
            <View style={{paddingVertical: 15}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.TEXT_PRIMARY,
                  paddingBottom: 7,
                  paddingHorizontal: 15,
                }}>
                Nhạc trong máy
              </Text>
              <ScrollView contentContainerStyle={{paddingBottom: 20}}>
                {noTracksError ? (
                  <Text style={{paddingHorizontal: 15, color: COLORS.TEXT_PRIMARY}}>
                    {noTracksError}
                  </Text>
                ) : downloadedTracks.length < 1 ? (
                  <ActivityIndicator size="large" color={COLORS.RED_PRIMARY} />
                ) : (
                  downloadedTracks.map((track, index) => {
                    return (
                      <TouchableNativeFeedback
                        key={index}
                        background={TouchableNativeFeedback.Ripple(COLORS.RIPPLE_LIGHT, false)}
                        onPress={() => playDownloadedTrack(track)}>
                        <View>
                          <ItemDownloadedTrackResult
                            track={track}
                            downloadedTrackBottomSheetRef={downloadedTrackBottomSheetRef}
                            setSelectedTrack={setSelectedTrack}
                          />
                        </View>
                      </TouchableNativeFeedback>
                    );
                  })
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      <DownloadedTrackBottomSheet
        ref={downloadedTrackBottomSheetRef}
        selectedTrack={selectedTrack}
        setDownloadedTracks={setDownloadedTracks}
      />
    </View>
  );
};

export default Downloaded;

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 13,
  },
});
