module.exports = global.config = {
    appConfig: {
        url: {
            dev: 'http://192.168.1.59/PandemikDebug/api/',  //https://localhost:44340/api/
            prod: 'http://192.168.1.59/Pandemik/api/'
        }, 
        credentials: {
            googleMapsKey: 'AIzaSyB0c7Oaoom8FtcCn46Eggfh8huka7rmOpc',
            mapUrl: 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAGsIHQthYktxakOhGokx46w06MsRVDo7g',
        },
        headers :{
            dev: new Headers({'Content-Type': 'application/json;charset=UTF-8'}),
            prod: ''
        },
        images :{
            local: process.env.PUBLIC_URL,
            api: 'http://192.168.1.24:8000/images/'
        },
        videos :{
            local: process.env.PUBLIC_URL,
            api: 'http://192.168.1.24:8000/videos/'
        }
    }
};