importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

const hashCode = (s) => {
  var h = 0, l = s.length, i = 0;
  if ( l > 0 )
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return `${h}`;
};

if (firebase) {
    firebase.initializeApp({
      apiKey: "AIzaSyBhKGZb-0hVnWkRhImIaywwJ9eZIXRDzpI",
      authDomain: "app.ici-drive.fr",
      databaseURL: "https://ici-drive.firebaseio.com",
      projectId: "ici-drive",
      storageBucket: "ici-drive.appspot.com",
      messagingSenderId: "197845039865",
      appId: "1:197845039865:web:8c0b37d09dbff116248028",
      measurementId: "G-DWMZEW5DNP"
    });
    
    const messaging = firebase.messaging(); 
    messaging.setBackgroundMessageHandler(function (payload) {  
      const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon || '/icons/icon-192x192.png',
        data: {
          url: payload.data.url 
        },
        tag:hashCode(`${payload.data.title}:${payload.data.body}`)
      };
  
      return self.registration.showNotification(payload.data.title,
        notificationOptions);
    });    

    self.addEventListener('notificationclick', event => {
      const url = event.notification.data.url;
      event.notification.close();
      if (url) {
        event.waitUntil(clients.openWindow(url));
      }
    });
  }