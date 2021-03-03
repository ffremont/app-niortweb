import { BehaviorSubject } from "rxjs";
import fcmService from "./fcm.service";
import myProfilStore from '../stores/my-profil';

export class AuthService{
    public subToken = new BehaviorSubject<string|null>(null);
    public subUser = new BehaviorSubject<string|null>(null);
    public isAuth = false;
    private currentIdToken : string | null = null;

    public async authenticate(user:any): Promise<any> {
        fcmService.init();
        
        this.isAuth = true;
        this.subUser.next(user);

        // provoque la récupération du profil dès qu'on est connecté
        //myProfilStore.set(user);
        //return;
       return await myProfilStore.load();
           
    }

    public setIdToken(idToken:string){
        this.currentIdToken = idToken;
        this.subToken.next(idToken);
    }

    /**
     * Retourne le token valide
     */
    public async getToken() : Promise< string | null>{
        const decoded = this.currentIdToken ? this.decodeToken(this.currentIdToken) : null;
        const now = Math.floor((new Date()).getTime()/1000);
        if(decoded && (decoded.exp <= now)){
            return await this.getNewIdToken();
        }else{
            return this.currentIdToken;
        }
    }

    /**
     * Redemande un token
     */
    public async getNewIdToken(){
        const token = await (window as any).firebase.auth().currentUser.getIdToken();
        this.currentIdToken = token;
        this.setIdToken(token);

        return token;
    }

    /**
     * Décode de token firebase auth.
     * @param jwt 
     */
    public decodeToken(jwt:string) {
        if(jwt === null || jwt === '')
            return null;

        var base64Url = jwt.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    signout() {
        this.isAuth = false;
        this.subUser.next(null);
        this.subToken.next(null);
        
        if((window as any).firebase){
            (window as any).firebase.auth().signOut();
        }
    }
}

export default new AuthService() ;