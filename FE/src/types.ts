export type Album = {
  encodedId: string;
  title: string;
  artistsNames: string;
  thumbnail: string;
};

export type Song = {
  encodeId: string;
  title: string;
  artistsNames: string;
  thumbnail: string;
  thumbnailM: string;
  album?: Album;
};

export type ZingMp3LyricResponse = {
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
