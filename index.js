const mongoose = require('mongoose');
const app = require('./app');
let port = process.env.PORT || 5000;

/**
 * Para eliminar el aviso de mongoose que devuelve por la consola donde hemos lanzado el npm start
 */
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2',{ useMongoClient: true } ,(err,res)=>{
    if(err)throw err;
    console.log('La base de datos esta funcionando correctamente');

    app.listen(port,()=>{
        console.log('Servidor del api escuchando en http://localhost:'+port);
    });
});