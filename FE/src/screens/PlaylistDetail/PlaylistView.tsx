import { Text, View, Image, ImageBackground, Platform, StatusBar, TouchableNativeFeedback, SafeAreaView, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ItemArtist from '../../components/ItemArtist';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../constants';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { DownloadIcon } from '../../icons/DownloadIcon';
import { HeartIcon } from '../../icons/HeartIcon';
import ListSong from '../../components/ListSong';
import { Playlist } from '../../types';

type Props = {
    playlist: Playlist
}

const PlaylistView = ({ playlist }: Props) => {
    return <SafeAreaView>
        <ScrollView style={{}}>
            <View style={styles.wrapper}>
                <ImageBackground
                    source={{ uri: playlist.thumbnailM }}
                    resizeMode="cover"
                    onLoad={() => {
                        // console.log('loaded player background image');
                    }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
                    blurRadius={60}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 0.6 }}
                        colors={['#FFFFFF00', '#FFFFFF']}
                        style={{
                            paddingHorizontal: 10,
                            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
                        }}>
                        <StatusBar
                            barStyle={'light-content'}
                            translucent
                            backgroundColor={'transparent'}
                            animated={true}
                        />
                        <View>
                            <Text style={{ color: 'white', paddingVertical: 10 }}>
                                <AntIcon size={20} name="arrowleft" color={COLORS.TEXT_WHITE_PRIMARY} />
                            </Text>
                        </View>
                        <View
                            style={[styles.flexCenter, styles.flexColumnCenter, { width: '100%' }]}>
                            <Image
                                source={{
                                    uri: playlist.thumbnail,
                                }}
                                style={styles.image}
                            />
                            <Text style={styles.title}>{playlist?.title}</Text>
                            <Text style={styles.normText}>{playlist?.artistsNames}</Text>
                            <Text>{playlist?.song?.total + ' bài hát • ' + playlist?.song?.totalDuration}</Text>
                            <View
                                style={[styles.flexCenter, styles.flexRowCenter, {
                                    gap: 20,
                                    marginVertical: 20,
                                }]} >
                                <TouchableNativeFeedback
                                    onPress={() => {
                                        // downloadSong(selectedSong);
                                        // ((ref as any).current as any).close();
                                    }}>
                                    <View style={[styles.flexCenter, styles.flexColumnCenter]}>
                                        <DownloadIcon size={25} color={COLORS.TEXT_PRIMARY} />
                                        <Text style={styles.optionText}>Tải xuống</Text>
                                    </View>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback
                                    style={{ borderRadius: 30 }}
                                    onPress={() => {
                                        // downloadSong(selectedSong);
                                        // ((ref as any).current as any).close();
                                    }}>
                                    <View
                                        style={[styles.flexCenter, styles.buttonShuffle]}>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                color: 'white',
                                                fontWeight: 'bold',
                                            }}>
                                            Phát ngẫu nhiên
                                        </Text>
                                    </View>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback
                                    onPress={() => {
                                        // downloadSong(selectedSong);
                                        // ((ref as any).current as any).close();
                                    }}>
                                    <View style={[styles.flexCenter]}>
                                        <HeartIcon size={25} color={COLORS.TEXT_PRIMARY} />
                                        <Text style={styles.optionText}>Thích</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                            <Text style={{ color: COLORS.TEXT_PRIMARY, fontSize: 13, paddingBottom: 20 }}>
                                {playlist?.sortDescription}
                            </Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>
                {
                    playlist?.song?.items.length > 0 && <ListSong songs={playlist.song.items} paddingVertical={7} />
                }
                {
                    playlist && (
                        <View
                            style={{
                                marginTop: '8%',
                            }}>
                            <Text style={styles.partText}>Artists</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {playlist.artists.map((element, index) => {
                                    return (
                                        <ItemArtist
                                            key={index}
                                            description={element.name}
                                            image={element.thumbnail}
                                            size={130}
                                        />
                                    );
                                })}
                            </ScrollView>
                        </View>
                    )
                }
                {/* {recommends && (
            <View
              style={{
                marginTop: '8%',
              }}>
              <Text style={styles.partText}>Relating</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommends.map((element, index) => {
                  return (
                    <ItemAlbum
                      key={index}
                      description={element.title}
                      image={element.thumbnail}
                      size={130}
                    />
                  );
                })}
              </ScrollView>
            </View>
          )} */}
            </View >
        </ScrollView >
    </SafeAreaView >
}
export default PlaylistView;

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    title: {
        paddingTop: 20,
        paddingBottom: 10,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.TEXT_PRIMARY,
    },
    normText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '400',
        color: COLORS.TEXT_GRAY,
    },
    partText: {
        fontSize: 16,
        fontWeight: '400',
    },
    songContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: '2%',
        justifyContent: 'space-evenly',
        paddingVertical: '2%',
        height: 80,
    },
    optionText: {
        fontSize: 14.5,
        color: COLORS.TEXT_PRIMARY,
    },
    flexCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexColumnCenter: {
        flexDirection: 'column',
    },
    flexRowCenter: {
        flexDirection: 'row',
    },
    image: {
        height: 235,
        width: 235,
        aspectRatio: 1,
        borderRadius: 10,
    },
    buttonShuffle: {
        borderRadius: 30,
        backgroundColor: COLORS.PURPLE_ZING,
        width: '60%',
        paddingVertical: 10,
    }
});