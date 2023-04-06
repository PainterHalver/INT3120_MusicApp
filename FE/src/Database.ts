import SQLite from 'react-native-sqlite-storage';
import {Song} from './types';

class Database {
  private db: SQLite.SQLiteDatabase | null;

  constructor() {
    this.db = null;
    SQLite.enablePromise(false);
    this.db = SQLite.openDatabase(
      {name: 'data.db', location: 'default'},
      () => {
        console.log('Database initialized');
        this.createTables();
      },
      error => {
        console.log('SETUP DATABASE ERROR:', error);
      },
    );
    SQLite.enablePromise(true);
  }

  private createTables = async (): Promise<void> => {
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS search_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          encodeId TEXT,
          title TEXT,
          artistsNames TEXT,
          thumbnail TEXT,
          thumbnailM TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `;

      if (!this.db) throw new Error('Database not initialized');

      await this.db.executeSql(createTableQuery);
      console.log('CREATED TABLE search_history');
    } catch (error) {
      console.error('Error creating table', error);
    }
  };

  public saveSongSearchHistory = async ({
    encodeId,
    title,
    artistsNames,
    thumbnail,
    thumbnailM,
  }: Song): Promise<void> => {
    try {
      const insertQuery = `
        INSERT INTO search_history (encodeId, title, artistsNames, thumbnail, thumbnailM) VALUES (?, ?, ?, ?, ?);
      `;

      if (!this.db) throw new Error('Database not initialized');

      await this.db.executeSql(insertQuery, [encodeId, title, artistsNames, thumbnail, thumbnailM]);
      console.log(title + ' added to history');
    } catch (error) {
      console.log('SAVE SONG SEARCH HISTORY ERROR: ', error);
    }
  };

  public getTopSongSearchHistory = async (limit: number = 10): Promise<Song[]> => {
    try {
      const selectQuery = `
      SELECT * FROM search_history 
      ORDER BY createdAt DESC
      LIMIT ?;`;

      if (!this.db) throw new Error('Database not initialized');

      const result = await this.db.executeSql(selectQuery, [limit]);
      const rows = result[0].rows;
      const songSearchHistory: Song[] = [];

      for (let i = 0; i < rows.length; i++) {
        const {encodeId, title, artistsNames, thumbnail, thumbnailM} = rows.item(i);
        songSearchHistory.push({encodeId, title, artistsNames, thumbnail, thumbnailM});
      }

      // Filter out duplicate encodeId
      const uniqueSongSearchHistory = songSearchHistory.filter(
        (song, index, self) => index === self.findIndex(t => t.encodeId === song.encodeId),
      );

      return uniqueSongSearchHistory;
    } catch (error) {
      console.error('Error querying data', error);
      return [];
    }
  };
}

export default new Database();
