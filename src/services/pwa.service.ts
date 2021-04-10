import { BehaviorSubject } from "rxjs";

export class PwaService {

    public installed:BehaviorSubject<boolean>;
    public cancelled:BehaviorSubject<boolean>;
    public beforeinstallprompt:BehaviorSubject<boolean>;

    private deferredPrompt:any;

    constructor() {
        this.deferredPrompt = null;
        this.installed = new BehaviorSubject<boolean>(false);
        this.cancelled = new BehaviorSubject<boolean>(false);
        this.beforeinstallprompt = new BehaviorSubject<boolean>(false);

        window.addEventListener('appinstalled', (evt) => {
            this.deferredPrompt = null;
            this.installed.next(true);
        });

        window.addEventListener('beforeinstallprompt', (e:any) =>{
            //console.log('Can install PWA and call prompt()');
            e.preventDefault();
            
            this.deferredPrompt = e;
            this.beforeinstallprompt.next(true);  

            // e.userChoice will return a Promise. For more details read: http://www.html5rocks.com/en/tutorials/es6/promises/
            e.userChoice.then((choiceResult:any) => {
                if (choiceResult.outcome === 'dismissed') {
                    //console.log('User cancelled homescreen install');
                    //EventBus.$emit('pwa.cancelled');
                    this.deferredPrompt = null;
                    this.cancelled.next(true);  
                } else {
                    //console.log('User added to homescreen');
                }
            });

        });
    }

    install(){
        if(this.deferredPrompt){
            this.deferredPrompt.prompt();
        }
    }

    /**
     * Notification 
     * @param title 
     * @param body 
     * @param url 
     */
    notify(title:string, body:string, url:string|null = null){
        const options = {
            body: body,
            title,
            icon: '/logo192.png',
            data: {
                url: url ? url : window.location.href
            }
        };

        navigator.serviceWorker.ready.then((registration:any) => {
            registration.active.postMessage({
                name:'push',
                ...options
            });
          });
    }

    close(){
        this.deferredPrompt = null;
        this.beforeinstallprompt.next(false); 
        this.installed.next(false); 
        this.cancelled.next(true); 
    }
}

export default new PwaService();