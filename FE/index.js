/**
 * @format
 */

//import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import {name as appName} from './app.json';
import PlaylistDetail from './screens/PlaylistDetail';

AppRegistry.registerComponent(appName, () => App);

// Register playback services
TrackPlayer.registerPlaybackService(() => require('./service.js'));
