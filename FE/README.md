# MusicApp

1. `npm install`
2. `npx react-native start`
3. Pair điện thoại: Developer options -> Wireless Debugging ON > Pair device with pairing code
4. `adb pair ip:pair_port`
5. Connect: `adb connect ip:port`
6. `npx react-native run-android`

# Tools

- [react-native-track-player nightly build](https://github.com/doublesymmetry/react-native-track-player)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
- [slider](https://www.npmjs.com/package/@react-native-community/slider)
- [Async Storage](https://react-native-async-storage.github.io/async-storage/docs/install/) (thay cho localStorage)

# Apk

- Key alias: my-key-alias
- Password: 123456

## Note

- react-native-track-player bản nightly mới chạy được RemoteSeek

## Todos:

- [ ] Default src cho img khi không có src
- [ ] Tìm kiếm, thêm nhạc vào queue hoặc sửa queue khi đang phát
- [ ] Thêm option vào ellipsis trong player (Download nhạc, Favorite, Share)
- [ ] Shuffle
- [ ] Lyrics và Recommend screen trong player
