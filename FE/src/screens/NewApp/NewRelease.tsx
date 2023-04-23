import { release } from 'os';
import { memo, useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, Button, ScrollView, Dimensions } from 'react-native';
import ItemSong from '../../components/ItemSong';
import { Release } from './index';

type Props = {
    releases: Release[];
};
export const NewRelease = memo(({ releases }: Props) => {
    // const [props, setProps] = useState(releases)
    const [type, setType] = useState(1);
    const [data, setData] = useState<Release[][]>([]);
    const screenWidth = Dimensions.get('window').width;

    const buildData = () => {
        if (releases) {
            console.log(releases.length)
        }
        if (releases && releases.length > 0) {
            let filterData = releases;
            filterData = type === 1 ? filterData : type === 2 ? filterData.filter((item => item.isWorldWide = false)) : filterData.filter(item => item.isWorldWide = true);
            console.log(filterData.length)
            const lengthMax =
                filterData.length % 4 === 0 ? filterData.length / 4 : Math.floor(filterData.length / 4) + 1;
            const dataBuild = Array.from({ length: lengthMax }, () => filterData.splice(0, 4));
            setData(dataBuild);
        }
    };

    useEffect(() => {
        console.log(type)
        buildData();

    }, [releases, type]);

    const ColumnNewRelease = ({ items }: { items: Release[] }) => {
        return useMemo(() => {
            return (
                <View
                    style={{ flexDirection: 'column', gap: 10, paddingTop: 10, width: screenWidth - 20 }}
                    
                >
                    {items &&
                        items.length > 0 &&
                        items.map((item: Release, index: number) => {
                            return (
                                <ItemSong
                                    nameSong={item?.title}
                                    artistName={item?.artistsNames}
                                    image={item?.thumbnail}
                                    size={60}
                                    date="Hom nay"
                                    key={index}
                                />
                            );
                        })}
                </View>
            );
        }, [data, type])

    };

    return (
        <View style={{ flexDirection: 'column' }}>
            <View>
                <Text style={{ fontSize: 25, color: 'black' }}>Mới phát hành</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <Text
                    style={[styles.chipButton, type === 1 ? styles.chipSelected : {}]}
                    onPress={() => setType(1)}>
                    Tất cả
                </Text>
                <Text
                    style={[styles.chipButton, type === 2 ? styles.chipSelected : {}]}
                    onPress={() => setType(2)}>
                    Việt Nam
                </Text>
                <Text
                    style={[styles.chipButton, type === 3 ? styles.chipSelected : {}]}
                    onPress={() => setType(3)}>
                    Quốc tế
                </Text>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    {data &&
                        data.map((item: Release[], index) => {
                            return <ColumnNewRelease items={item} key={index} />;
                        })}
                </View>
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    chipButton: {
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 3,
        color: 'black',
        borderColor: '#cccccc'
    },
    chipSelected: {
        backgroundColor: '#9b4de0',
        color: 'white',
        borderWidth: 0,
    }
});
