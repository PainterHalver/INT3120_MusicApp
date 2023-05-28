import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {BottomTabParamList, RootStackParamList} from '../../../App';
import ChartMainPage from './ChartMainPage';
import WeekChartDetail from './WeekChartDetail';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'ChartDetail'>,
  StackScreenProps<RootStackParamList>
>;

export type ChartDetailParamList = {
  ChartMainPage: undefined;
  WeekChartDetail: {weekchart: any};
};

const ChartDetailStack = createNativeStackNavigator<ChartDetailParamList>();

const ChartDetail: React.FC<Props> = ({navigation}) => {
  return (
    <ChartDetailStack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      <ChartDetailStack.Screen name="ChartMainPage" component={ChartMainPage} />
      <ChartDetailStack.Screen name="WeekChartDetail" component={WeekChartDetail} />
    </ChartDetailStack.Navigator>
  );
};

export default ChartDetail;
