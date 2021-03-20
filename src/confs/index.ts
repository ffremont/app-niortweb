
import { Configuration } from "./configuration";


//const DEV_API_BASEURL = 'http://localhost:5001/mykraken-f63e7/us-central1/api/api';
const DEV_API_BASEURL = '/api-mock';
const other: Configuration = {
    support: '',
    baseURL: 'https://home-trading.fabapp.fr',
    soutenir: 'https://www.paypal.me/ffremont',
    email:"ff.fremont.florent@gmail.com",
    fcmPublicVapidKey: 'BMdTaD5RfuNIq4RBKfXD7tIrx8Go4wyxRHt634GRUdgVy-UKm30oNyytDraUohe186pbnm7ngcs7BBY7it7CMwk',
    API: {
        events: (id:any = '') => `${DEV_API_BASEURL}/events${id ? '/'+id: ''}.json`,
        myProfil: () => `${DEV_API_BASEURL}/my-profil.json`
    },
    slack:''
} ;

const API_BASEURL = '/api';
const prod: Configuration = {
    support: '',
    baseURL: 'https://app.niortweb.fr',
    email:"ff.fremont.florent@gmail.com",
    soutenir: 'https://www.paypal.me/ffremont',
    fcmPublicVapidKey: 'BMdTaD5RfuNIq4RBKfXD7tIrx8Go4wyxRHt634GRUdgVy-UKm30oNyytDraUohe186pbnm7ngcs7BBY7it7CMwk',
    API: {
        events: (id:any = '') => `${API_BASEURL}/events${id ? '/'+id: ''}`,
        myProfil: () => `${API_BASEURL}/my-profil`
    },
    slack:''
} ;

const config = process.env.REACT_APP_STAGE === 'prod'  ? prod : other;

  export default { ...config};