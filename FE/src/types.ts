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
