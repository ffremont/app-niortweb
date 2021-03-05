
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
        tickets: (id:any = '') => `${DEV_API_BASEURL}/tickets${id ? '/'+id: ''}.json`,
        myProfil: () => `${DEV_API_BASEURL}/my-profil.json`,
        currencies: () => `${DEV_API_BASEURL}/currencies.json`
    },
    coinlib:{
        BTC: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=859&pref_coin_id=1506',
        ETH: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=145&pref_coin_id=1506',
        XRP: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=619&pref_coin_id=1506',
        USDT: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=637&pref_coin_id=1506',
        USDC: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=648685&pref_coin_id=1506',
        BNB: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=1209&pref_coin_id=1506',
        CRO: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=1510617&pref_coin_id=1506',
        LTC: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=359&pref_coin_id=1506',
        DAI: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=345508&pref_coin_id=1506',
        LINK: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=7618&pref_coin_id=1506',        
    },
    coinmarketcap:{
        DOT: 'https://coinmarketcap.com/currencies/polkadot-new/',
        ATOM : 'https://coinmarketcap.com/currencies/cosmos/'
    }
} ;

const API_BASEURL = '/api';
const prod: Configuration = {
    support: '',
    baseURL: 'https://home-trading.fabapp.fr',
    email:"ff.fremont.florent@gmail.com",
    soutenir: 'https://www.paypal.me/ffremont',
    fcmPublicVapidKey: 'BMdTaD5RfuNIq4RBKfXD7tIrx8Go4wyxRHt634GRUdgVy-UKm30oNyytDraUohe186pbnm7ngcs7BBY7it7CMwk',
    API: {
        tickets: (id:any = '') => `${API_BASEURL}/tickets${id ? '/'+id: ''}`,
        myProfil: () => `${API_BASEURL}/my-profil`,
        currencies: () => `${API_BASEURL}/currencies`
    },
    coinlib:{
        BTC: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=859&pref_coin_id=1506',
        ETH: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=145&pref_coin_id=1506',
        XRP: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=619&pref_coin_id=1506',
        USDT: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=637&pref_coin_id=1506',
        USDC: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=648685&pref_coin_id=1506',
        BNB: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=1209&pref_coin_id=1506',
        CRO: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=1510617&pref_coin_id=1506',
        LTC: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=359&pref_coin_id=1506',
        DAI: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=345508&pref_coin_id=1506',
        ADA: 'https://widget.coinlib.io/widget?type=chart&theme=light&coin_id=122882&pref_coin_id=1506'
    },
    coinmarketcap:{
        DOT: 'https://coinmarketcap.com/currencies/polkadot-new/',
        ATOM : 'https://coinmarketcap.com/currencies/cosmos/',
        FLOW2 : 'https://coinmarketcap.com/currencies/flow/'
    }
} ;

const config = process.env.REACT_APP_STAGE === 'prod'  ? prod : other;

  export default { ...config};