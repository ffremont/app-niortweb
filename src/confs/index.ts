
import { Configuration } from "./configuration";


//const DEV_API_BASEURL = 'http://localhost:5001/mykraken-f63e7/us-central1/api/api';
//const DEV_API_BASEURL = '/api-mock';
const DEV_API_BASEURL = 'http://localhost:5001/niortweb/us-central1/api/api';
const other: Configuration = {
    support: '',
    baseURL: 'http://localhost:4000',
    soutenir: 'https://www.paypal.me/ffremont',
    email:"ff.fremont.florent@gmail.com",
    fcmPublicVapidKey: 'BDorbRGlAAfrBhhye1o3dWSUCiIYOMpNoBtibMkd1gRFKRE7O5nW7K1AWIO3okeyZXO7vQfkeUslRITFY3rxZvs',
    API: {
        events: (id:any = '') => `${DEV_API_BASEURL}/events${id ? '/'+id: ''}`,
        myProfil: () => `${DEV_API_BASEURL}/my-profil`
    },
    slack:''
} ;

const API_BASEURL = '/api';
const prod: Configuration = {
    support: '',
    baseURL: 'https://app.niortweb.fr',
    email:"ff.fremont.florent@gmail.com",
    soutenir: 'https://www.paypal.me/ffremont',
    fcmPublicVapidKey: 'BDorbRGlAAfrBhhye1o3dWSUCiIYOMpNoBtibMkd1gRFKRE7O5nW7K1AWIO3okeyZXO7vQfkeUslRITFY3rxZvs',
    API: {
        events: (id:any = '') => `${API_BASEURL}/events${id ? '/'+id: ''}`,
        myProfil: () => `${API_BASEURL}/my-profil`
    },
    slack:''
} ;

const config = process.env.REACT_APP_STAGE === 'prod'  ? prod : other;

  export default { ...config};