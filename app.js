const express = require('express');
const bodyParser = require('body-parser');

let app = express();

//cargar ruta
const user_routes = require('./routes/user');
const artist_routes = require('./routes/artist');
const album_routes = require('./routes/album');
const song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//configurar cabeceras http
app.use((req, res, next)=>{
    /**
     * configuracion de CORS
     * permito el acceso a nuestra api en todos los dominio
     * !!! si esto no se configura bien no nos va realizar peticiones
     * 
     */
    res.header('Access-Control-Allow-Origin','*');
    /**
     * configuracion de cabezera para resolver peticiones ajax
     */
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    /**
     * permitir los metodos http
     */
    res.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    res.header('Allow', 'GET, POST, PUT, DELETE, OPTIONS');
    /** continua el flow */
    next();
});

//ruta base
app.use('/api',user_routes);
app.use('/api',artist_routes);
app.use('/api',album_routes);
app.use('/api',song_routes);
/*
app.get('/pruebas',(req,res)=>{
    res.status(200).send({message: 'bienvenido al curso'})
});
*/
module.exports= app;