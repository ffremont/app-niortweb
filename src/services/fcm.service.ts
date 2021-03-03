import httpClientService from './http-client.service';
import conf from '../confs';
import { User } from '../models/User';
import myProfilStore from '../stores/my-profil'

export class FcmService {
    fcm: string = '';
    lastFcm: string = '';
    messaging: any;
    isInit = false;

    public init() {
        if (this.isInit) { return; }

        this.requestPermission().then(() => {
            if (this.isInit) { return; }

            if ((window as any).firebase) {
                this.messaging = (window as any).firebase.messaging();
                // Add the public key generated from the console here.
                this.messaging.usePublicVapidKey(conf.fcmPublicVapidKey);
                this.messaging.onMessage(this.onMessage.bind(this));
                this.messaging.onTokenRefresh(this.onTokenRefresh.bind(this));

                if (this.messaging.getToken)
                    this.messaging.getToken().then((t: string) => {
                        this.fcm = t;
                        console.log(t);
                    });

                
            }
        }).catch(e => console.error(e));

        setTimeout(() => {
            if (this.isInit) { return; }
            this.isInit = true;
            // à chaque rechargement de l'utilisateur, on met à jour le refresh s'il a changé
            myProfilStore.subscribe((myProfil: User) => {
                if (this.lastFcm !== this.fcm) {
                    this.lastFcm = this.fcm;
                    myProfil.fcm = this.fcm;

                    httpClientService.axios.put(conf.API.myProfil(), myProfil).catch((e: any) => console.error(e));
                }
            })
        }, 0);
    }

    async requestPermission() {
        const permission = await Notification.requestPermission();

        if (permission === 'granted') {
            return "ok";
        } else {
            throw new Error('no granted');
        }
    }

    onTokenRefresh() {
        console.log('on token reresh');
        this.messaging.getToken().then((refreshedToken: string) => {
            console.log('Token refreshed.');
            this.fcm = refreshedToken;
        }).catch((err: any) => {
            console.log('Unable to retrieve refreshed token ', err);
        });

    }

    hashCode(s: string) {
        var h = 0, l = s.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
        return `${h}`;
    };

    onMessage(payload: any) {
        console.log('Message received. ', payload);
        const title = payload.data.title, body = payload.data.body;

        if(navigator.serviceWorker && navigator.serviceWorker.controller )
            navigator.serviceWorker.controller.postMessage({
                    name: 'push',
                    title,
                    body,
                    url: payload.data.url,
                    icon: payload.data.icon || 'https://home-trading.fabapp.fr/icons/icon-192x192.png',
                    tag: this.hashCode(`${title}:${body}`)
                });
    }
}

export default new FcmService();