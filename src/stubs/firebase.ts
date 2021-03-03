function ProviderStub(){}
ProviderStub.prototype.addProfile = (name: string) => {}
ProviderStub.prototype.addScope = (name: string) => {}
ProviderStub.prototype.setCustomParameters = (data: any) => {}


export class FirebaseStub {

    private isSigned = true;

    private authFns:any = [];
    private userMock:any = { email: 'ff.fremont.florent@gmail.com' };
    private idTokenMock = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc0Mzg3ZGUyMDUxMWNkNDgzYTIwZDIyOGQ5OTI4ZTU0YjNlZTBlMDgiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiRmxvcmVudCBGcmVtb250IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdoQW0zcGVieFZtSE5IM1RVc3hxYXFMcHo1bEx3UnAxMkppV3RpTFJnIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2ljaS1kcml2ZSIsImF1ZCI6ImljaS1kcml2ZSIsImF1dGhfdGltZSI6MTU5MTM0MTM5NCwidXNlcl9pZCI6ImVwWmpjZVRzaGZUWFZWQ1FJYjZ0N0ZmZzNxQzIiLCJzdWIiOiJlcFpqY2VUc2hmVFhWVkNRSWI2dDdGZmczcUMyIiwiaWF0IjoxNTkxNDE4NzE2LCJleHAiOjE1OTE0MjIzMTYsImVtYWlsIjoiZmYuZnJlbW9udC5mbG9yZW50QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTAxODU0NTI1NzExNjI3MzU1MTM4Il0sImVtYWlsIjpbImZmLmZyZW1vbnQuZmxvcmVudEBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.FWtSgsooCwRYEmCae_piaTgBinHSqiprcQr9LXw1cwa5ahpZhytpHYYzvoatxOz7udCtWkZDA8cH1RAj5PsP8Dx1ByB5B8PsEbFxoZTp7k_HWx5ZFgCAynZnwsHGGtYCssUd8Q460vM0C0VrH7xyvypJyLXLOfXemdrojcssLmvSKty1Rbu7qj1FlCoPe4RF1vtFgAN8jr-7RAGJT21CyDjGoj3e2zTTKYNTz7arN6nliKHJaGjk417shgt902ubFgU8-PyOmrdJncKiyINiyb3UeTFEV6cjCNkmOvbNl_76xysF0KdLyzpCJGqAJcXQ_dcAyqyNnvdMvaqBW8xR6A';
    private authDelayMock = 2000;

    getIdTokenPromise:any;
    getIdTokenPromiseResolve:any;


    constructor(){
        this.getIdTokenPromise = new Promise((resolve) => {
            this.getIdTokenPromiseResolve = resolve;
        });
    }

    public init(){
        const me:any = this;
        me.auth.FacebookAuthProvider = () => ProviderStub;
        me.auth.EmailAuthProvider = () => ProviderStub;
        me.auth.GoogleAuthProvider = () => ProviderStub;

        return this;
    }

    public messaging(){
        return {
            usePublicVapidKey: () => {},
            onMessage: () => {},
            onTokenRefresh: () => {}
        };
    }

    public auth() {
        return {
                signOut:() => {console.log('signOut')},
                onAuthStateChanged: (fn: any) => {
                this.authFns.push(fn);

                if(this.isSigned){
                    setTimeout( () => {
                        this.authFns.forEach((authFn:any) => authFn(this.userMock))
                        this.getIdTokenPromiseResolve(this.idTokenMock);
                    }, this.authDelayMock);                
                }else{
                    this.authFns.forEach((authFn:any) => authFn(null))
                }

                return () => { this.authFns.splice( this.authFns.findIndex((af:any) => af === fn), 1) };
            },
            signInWithRedirect: (provider:any) => {
                setTimeout(() =>{ // simulate auth process
                    this.authFns.forEach((authFn:any) => authFn(this.userMock));
                    this.getIdTokenPromiseResolve(this.idTokenMock);
                },1000);
            },
            currentUser: {
                getIdToken: () => this.getIdTokenPromise
            }
        };
    }
}

