importScripts('/__/firebase/9.6.8/firebase-app-compat.js');
importScripts('/__/firebase/9.6.8/firebase-messaging-compat.js');

// @see https://github.com/firebase/quickstart-js/blob/master/messaging/firebase-messaging-sw.js
firebase.initializeApp({
  apiKey: "AIzaSyAp9VBbyvEqiqIUuXfymgQhSbxfS3iOxEI",
  authDomain: "app.niortweb.fr",
  databaseURL: "https://niortweb.firebaseio.com",
  projectId: "niortweb",
  storageBucket: "niortweb.appspot.com",
  messagingSenderId: "342355226765",
  appId: "1:342355226765:web:6254172342866b207272c4"
});

const hashCode = (s) => {
  var h = 0,
    l = s.length,
    i = 0;
  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return `${h}`;
};

const messaging = firebase.getMessaging();
messaging.onBackgroundMessage(function (payload) {
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon || "/icons/icon-192x192.png",
    data: {
      url: payload.data.url,
    },
    tag: hashCode(`${payload.data.title}:${payload.data.body}`),
  };

  self.registration.showNotification(
    payload.data.title,
    notificationOptions
  );
});


self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data.url;
  event.notification.close();
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
