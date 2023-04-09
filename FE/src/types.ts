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
