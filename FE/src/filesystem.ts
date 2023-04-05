import RNFS from 'react-native-fs';
import notifee, {AndroidImportance} from '@notifee/react-native';

class FileSystem {
  private BASE_PATH = RNFS.ExternalDirectoryPath + '/';

  constructor() {}

  public downloadFileToExternalStorage = async (url: string, fileName: string) => {
    try {
      const path = this.BASE_PATH + fileName;
      const channelId = await notifee.createChannel({
        id: 'download',
        name: 'Download Channel',
        vibration: false,
        importance: AndroidImportance.HIGH,
      });
      let shouldDisplayNotification = true;
      const download = await RNFS.downloadFile({
        fromUrl: url,
        toFile: path,
        progressInterval: 500,
        progress: async res => {
          console.log(res.bytesWritten, res.contentLength);

          if (shouldDisplayNotification) {
            shouldDisplayNotification = false;
            await notifee.displayNotification({
              id: String(res.jobId),
              title: 'Downloading ' + fileName + '...',
              body: `${Math.round((res.bytesWritten / res.contentLength) * 100)}% ${
                Math.round((res.bytesWritten / 1024 / 1024) * 100) / 100
              }/${Math.round((res.contentLength / 1024 / 1024) * 100) / 100} MB`,
              android: {
                channelId,
                progress: {
                  max: res.contentLength,
                  current: res.bytesWritten,
                },
                importance: AndroidImportance.HIGH,
              },
            });
            shouldDisplayNotification = true;
          }
        },
        background: true,
      }).promise;
      console.log('Downloaded:', download);
      shouldDisplayNotification = false;
      await notifee.cancelNotification(String(download.jobId));
    } catch (error) {
      console.log('Downloader/downloadFileToExternalStorage:', error);
    }
  };

  public getMusicFiles = async () => {
    try {
      const files = await RNFS.readDir(this.BASE_PATH);
      console.log(files);
      return files;
    } catch (error) {
      console.log('Downloader/getMusicFiles:', error);
    }
  };
}

export default new FileSystem();
