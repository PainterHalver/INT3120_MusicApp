import {Track} from 'react-native-track-player';

export type Album = {
  encodedId: string;
  title: string;
  artistsNames: string;
  thumbnail: string;
};

export type Artist = {
  id: string;
  name: string;
  spotlight: boolean;
  alias: string;
  thumbnail: string;
  thumbnailM: string;
  playlistId: string;
  totalFollow: number;
};

export type Song = {
  encodeId: string;
  title: string;
  artistsNames: string;
  thumbnail: string;
  thumbnailM: string;
  album?: Album;
  firebasePlaylistId?: string;
};

export type Playlist = {
  encodeId: string;
  title: string;
  thumbnail: string;
  thumbnailM: string;
  sortDescription: string;
  artistsNames: string;
  description: string;
  aliasTitle: string;
  artists: Artist[];
  song: {
    total: number;
    totalDuration: number;
    items: Song[];
  };
};

export type WeekChart = {
  banner: string;
  playlistId: string;
  chartId: number;
  cover: string;
  country: string;
  type: string;
  link: string;
  aliasTitle: string;
  items: Song[];
};

export type MyPlaylist = {
  id: string;
  name: string;
  uid: string;
  isFavorite?: boolean;
};

export type Lyrics = {
  file: string;
  sentences: {
    words: {
      data: string;
      startTime: number;
      endTime: number;
    }[];
  }[];
  streamingUrl: string; // video
};

export const songsToTracks = (songs: Song[]): Track[] => {
  return songs.map(song => ({
    id: song.encodeId,
    url: '', // sẽ được thêm nhờ playback error event
    title: song.title,
    artist: song.artistsNames,
    artwork: song.thumbnailM,
  }));
};

export const tracksToSongs = (tracks: Track[]): Song[] => {
  return tracks.map(track => ({
    encodeId: track.id,
    title: track.title as string,
    artistsNames: track.artist as string,
    thumbnail: track.artwork as string,
    thumbnailM: track.artwork as string,
  }));
};
