/**
 * @format
 */

//import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { name as appName } from './app.json';
import ChartMainPage from './src/screens/ChartDetail/ChartMainPage';
import DiscoverPage from './src/screens/NewApp/DiscoverPage';

AppRegistry.registerComponent(appName, () => App);

// Register playback services
TrackPlayer.registerPlaybackService(() => require('./service.js'));
