/**
 * @format
 */

//import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import {name as appName} from './app.json';
import ChartDetail from './src/screens/ChartDetail';
import NewApp from './src/screens/NewApp';

AppRegistry.registerComponent(appName, () => ChartDetail);

// Register playback services
TrackPlayer.registerPlaybackService(() => require('./service.js'));
