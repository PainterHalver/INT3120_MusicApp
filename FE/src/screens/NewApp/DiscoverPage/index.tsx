import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import React, {memo, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, View} from 'react-native';
import Banner from '../../../components/Banner';
import BoxSearch from '../../../components/BoxSearch';
import ListItem from '../../../components/ListItem';
import LineChartBox from './LineChartBox';
import {ZingMp3} from '../../../ZingMp3';
import {banner} from '../../../components/Banner';
import {NewRelease, ItemReleases} from './NewRelease';
import {Artist, ItemHome, Playlist} from '../../../types';

const FocusAwareStatusBar = (props: any) => {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
};

const DiscoverPage = memo(() => {
  const [banners, setBanners] = useState<banner[]>([]);
  const [playlist, setPlaylist] = useState<Playlist[]>([]);
  const [top100, setTop100] = useState<Playlist[]>([]);
  const [hAlbum, setHAlbum] = useState<Playlist[]>([]);
  const [weekends, setWeekends] = useState<Playlist[]>([]);
  const [releases, setReleases] = useState<ItemReleases>({
    all: [],
    vPop: [],
    others: [],
  });

  const getItem = (data: Array<ItemHome>, sectionId: string): ItemHome[] => {
    return data.filter(item => item.sectionId === sectionId);
  };

  const getData = async () => {
    const res = await ZingMp3.getHome();
    const data = res.data.items;
    const banner: ItemHome[] = getItem(data, 'hSlider');
    const artistTrend: ItemHome[] = getItem(data, 'hArtistTheme');
    const top100: ItemHome[] = getItem(data, 'h100');
    const hAlbum: ItemHome[] = getItem(data, 'hAlbum');
    const weekends: ItemHome[] = getItem(data, 'hEditorTheme2');
    const newRelease = data.find((item: ItemHome) => item.sectionType === 'new-release');

    setBanners(banner && banner.length > 0 && banner[0]?.items ? banner[0].items : []);
    setPlaylist(
      artistTrend && artistTrend.length > 0 && artistTrend[0]?.items ? artistTrend[0].items : [],
    );
    setTop100(top100 && top100.length > 0 && top100[0]?.items ? top100[0].items : []);
    setHAlbum(hAlbum && hAlbum.length > 0 && hAlbum[0]?.items ? hAlbum[0].items : []);
    setWeekends(weekends && weekends.length > 0 && weekends[0]?.items ? weekends[0].items : []);
    setReleases(
      newRelease?.items
        ? newRelease.items
        : {
            all: [],
            vPop: [],
            other: [],
          },
    );
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View>
      <FocusAwareStatusBar translucent barStyle={'light-content'} backgroundColor={'transparent'} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{paddingBottom: 20}}>
        <View style={{backgroundColor: 'transparent'}}>
          <Banner data={banners}>
            <View>
              <BoxSearch />
            </View>
          </Banner>
          <View>
            <ListItem data={playlist} name={'Nghệ sĩ thịnh hành'} />
            <ListItem data={weekends} name={'Happy Weekend'} />
            <NewRelease items={releases} />
            <LineChartBox />
            <ListItem data={top100} name={'Top 100'} />
            <ListItem data={hAlbum} name={'Album hot'} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

export default DiscoverPage;
