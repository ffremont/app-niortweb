module.exports = {
    globDirectory: './build/',
    globPatterns: [
      '\*\*/\*.{html,js,css,svg,mp3,wav,png}'
    ],
    swDest: './build/my-sw.js',
    clientsClaim: true,
    skipWaiting: true
  };