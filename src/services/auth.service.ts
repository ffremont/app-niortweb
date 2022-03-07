import { BehaviorSubject } from "rxjs";
import { getAuth, signOut} from "firebase/auth";
import fcmService from "./fcm.service";
import myProfilStore from '../stores/my-profil';
import { User } from "../models/User";

export class AuthService{
    public behaviorSubjectToken = new BehaviorSubject<string|null>(null);
    public behaviorSubjectUser = new BehaviorSubject<User|null>(null);
    public isAuth = false;
    private currentIdToken : string | null = null;

    public async authenticate(user:User): Promise<any> {
        fcmService.init();
        
        this.isAuth = true;
        this.behaviorSubjectUser.next(user);

        // provoque la récupération du profil dès qu'on est connecté
        myProfilStore.set(user);
        //return;
       return await myProfilStore.load();
    }

    public setIdToken(idToken:string){
        this.currentIdToken = idToken;
        this.behaviorSubjectToken.next(idToken);
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
        const auth = getAuth();
        if(auth.currentUser){
            const token = await auth.currentUser.getIdToken();
            this.currentIdToken = token;
            this.setIdToken(token);
    
            return token;
        }else{
            return null;
        }
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
        this.behaviorSubjectUser.next(null);
        this.behaviorSubjectToken.next(null);
        
        if((window as any).firebase){
            signOut(getAuth());
        }
    }
}

export default new AuthService() ;