/**
 * @format
 */

//import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import {name as appName} from './app.json';
import ListSongsItem from './src/Components/ListSongsItem';

AppRegistry.registerComponent(appName, () => ListSongsItem);

// Register playback services
TrackPlayer.registerPlaybackService(() => require('./service.js'));
