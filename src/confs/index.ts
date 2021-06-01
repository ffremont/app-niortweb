
import { Configuration } from "./configuration";


//const DEV_API_BASEURL = 'http://localhost:5001/mykraken-f63e7/us-central1/api/api';
//const DEV_API_BASEURL = '/api-mock';
const DEV_API_BASEURL = 'http://localhost:5001/niortweb/us-central1/api/api';
const other: Configuration = {
    support: '',
    baseURL: 'http://localhost:4000',
    soutenir: 'https://www.paypal.me/ffremont',
    tags:['IA', 'Métier', 'Bot', 'Web', 'Framework','Bonnes pratiques', 'Qualité', 'Sécurité', 'Coding', 'Expérience'],
    email:"ff.fremont.florent@gmail.com",
    fcmPublicVapidKey: 'BDorbRGlAAfrBhhye1o3dWSUCiIYOMpNoBtibMkd1gRFKRE7O5nW7K1AWIO3okeyZXO7vQfkeUslRITFY3rxZvs',
    API: {
        events: (id:any = '') => `${DEV_API_BASEURL}/events${id ? '/'+id: ''}`,
        myProfil: () => `${DEV_API_BASEURL}/my-profil`,
        registerEmail: (id:any = '') => `${DEV_API_BASEURL}/events${id ? '/'+id: ''}/register-email`,
        emails: (id:any = '') => `${DEV_API_BASEURL}/events${id ? '/'+id: ''}/emails`,
    },
    slack:'https://join.slack.com/t/niortweb/shared_invite/zt-j5dsxq3b-iQK~NE09Sxp4POn2CgDWqA'
} ;

const API_BASEURL = '/api';
const prod: Configuration = {
    support: '',
    baseURL: 'https://app.niortweb.fr',
    email:"ff.fremont.florent@gmail.com",
    tags:['IA', 'Métier', 'Bot', 'Web', 'Framework','Bonnes pratiques', 'Qualité', 'Sécurité', 'Coding', 'Expérience'],
    soutenir: 'https://www.paypal.me/ffremont',
    fcmPublicVapidKey: 'BDorbRGlAAfrBhhye1o3dWSUCiIYOMpNoBtibMkd1gRFKRE7O5nW7K1AWIO3okeyZXO7vQfkeUslRITFY3rxZvs',
    API: {
        events: (id:any = '') => `${API_BASEURL}/events${id ? '/'+id: ''}`,
        myProfil: () => `${API_BASEURL}/my-profil`,
        registerEmail: (id:any = '') => `${API_BASEURL}/events${id ? '/'+id: ''}/register-email`,
        emails: (id:any = '') => `${API_BASEURL}/events${id ? '/'+id: ''}/emails`
    },
    slack:'https://join.slack.com/t/niortweb/shared_invite/zt-j5dsxq3b-iQK~NE09Sxp4POn2CgDWqA'
} ;

const config = process.env.REACT_APP_STAGE === 'prod'  ? prod : other;

  export default { ...config};