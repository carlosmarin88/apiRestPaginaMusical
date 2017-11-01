const mongoose = require('mongoose');
/*obtener un schema */
let Schema = mongoose.Schema;
/*creacion de schema */
let UserSchema = Schema({
    name : String,
    surname: String,
    email : String,
    password: String,
    role: String,
    image: String
});
//guarda en la base el schema en plural eje 
// user que es el primer parametro es el nombre de la base
module.exports = mongoose.model('User',UserSchema);