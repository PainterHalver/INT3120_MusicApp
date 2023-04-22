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
- https://github.com/software-mansion/react-native-gesture-handler/issues/420#issuecomment-592686502

## Todos:

- [x] Ngăn Trackplayer stop khi hết queue
- [x] Default src cho img khi không có src
- [x] Tìm kiếm, thêm nhạc vào queue hoặc sửa queue khi đang phát
- [x] Thêm option vào ellipsis trong player (Download nhạc, Favorite, Share), sửa menu cho nhạc tải về đang phát trong player
- [x] Hiện nhạc và artwork đang phát và điều khiển nhạc từ notification
- [x] Tìm kiếm nhạc, play nhạc từ server Zing
- [x] Lịch sử tìm kiếm
- [x] Quay đĩa khi nhạc phát, đồng bộ rotation giữa player và miniplayer
- [x] Tải nhạc về máy, quét nhạc có sẵn trong máy, extract artwork và metadata từ file nhạc offline
- [x] Yêu thích nhạc playlist firestore, cache bằng AsyncStorage
- [ ] Shuffle
- [ ] Chia sẻ link track
- [ ] Screen tìm kiếm theo bài hát, playlist, nghệ sĩ
- [ ] Screen user chứa nút đăng xuất và vài cài đặt
- [ ] Title của player thay đổi theo từng page
- [x] Lyrics Karaoke
