import {Image, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {COLORS, SIZES} from '../../../constants';
import {usePlayer} from '../../../contexts/PlayerContext';

export const LyricsPage = () => {
  const {currentTrack, lyrics} = usePlayer();

  return (
    <View style={styles.lyricsPage}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 7,
          paddingBottom: 15,
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
        }}>
        <View style={{position: 'relative', width: 45, height: 45}}>
          <Image
            source={
              (typeof currentTrack.artwork === 'string'
                ? {uri: currentTrack.artwork}
                : currentTrack.artwork) || require('./../../../../assets/default.png')
            }
            style={{width: 45, height: 45, borderRadius: 7}}
          />
        </View>
        <View style={{marginRight: 'auto'}}>
          <Text style={{fontSize: 15, fontWeight: '500', color: COLORS.TEXT_WHITE_PRIMARY}}>
            {currentTrack.title && currentTrack.title.length > 33
              ? currentTrack.title.substring(0, 33) + '...'
              : currentTrack.title}
          </Text>
          <Text style={{fontSize: 14, color: COLORS.TEXT_WHITE_SECONDARY}}>
            {currentTrack.artist && currentTrack.artist.length > 40
              ? currentTrack.artist.substring(0, 40) + '...'
              : currentTrack.artist}
          </Text>
        </View>
      </View>
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingVertical: 15,
          paddingHorizontal: 20,
        }}>
        {lyrics.map((sentence, index) => {
          return (
            <Text
              key={index}
              style={{
                color: COLORS.TEXT_WHITE_SECONDARY,
                fontSize: 20,
                paddingVertical: 10,
                fontWeight: '600',
              }}>
              {sentence}
            </Text>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  lyricsPage: {
    // backgroundColor: 'cyan',
    width: SIZES.SCREEN_WIDTH,
    paddingVertical: 15,
  },
});
