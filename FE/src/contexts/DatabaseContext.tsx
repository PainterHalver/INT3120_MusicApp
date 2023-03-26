import React, {createContext, useContext, useEffect, useState} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {Song} from '../types';

export type DatabaseContextType = {
  db: SQLite.SQLiteDatabase | null;

  saveSongSearchHistory: (song: Song) => Promise<void>;
  getTopSongSearchHistory: (limit?: number) => Promise<Song[]>;
};

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  saveSongSearchHistory: async () => {},
  getTopSongSearchHistory: async () => [],
});

export const DatabaseProvider = ({children}: any) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  const createTable = async (db: SQLite.SQLiteDatabase) => {
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

      // await db.executeSql('DROP TABLE IF EXISTS search_history');
      // console.log('DROPPED TABLE search_history');

      await db.executeSql(createTableQuery);
      console.log('CREATED TABLE search_history');
    } catch (error) {
      console.error('Error creating table', error);
    }
  };

  const saveSongSearchHistory = async ({
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

      if (!db) throw new Error('Database not initialized');

      await db.executeSql(insertQuery, [encodeId, title, artistsNames, thumbnail, thumbnailM]);
      console.log('Data inserted');
    } catch (error) {
      console.log('SAVE SONG SEARCH HISTORY ERROR: ', error);
    }
  };

  const getTopSongSearchHistory = async (limit: number = 10): Promise<Song[]> => {
    try {
      const selectQuery = `
      SELECT * FROM search_history 
      ORDER BY createdAt DESC
      LIMIT ?;`;

      if (!db) throw new Error('Database not initialized');

      const result = await db.executeSql(selectQuery, [limit]);
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

  useEffect(() => {
    const setup = async () => {
      try {
        SQLite.enablePromise(true);
        const dbInstance = await SQLite.openDatabase({
          name: 'data.db',
          location: 'default',
        });
        setDb(dbInstance);
        console.log('Database initialized', dbInstance);
        await createTable(dbInstance);
      } catch (error) {
        console.log('SETUP DATABASE ERROR: ', error);
      }
    };
    setup();

    return () => {
      if (db) {
        console.log('Closing database');
        db.close();
      }
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{db, saveSongSearchHistory, getTopSongSearchHistory}}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => useContext(DatabaseContext);
