const jwt = require('jwt-simple');

/*pay load - la fecha de creacion y de expiracion del token*/
const moment = require('moment');
let secret = 'clave_secreta_curso';

createToken = (user)=>{
    let payload ={
        /*id  */
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image : user.image,
        /*fecha de creacion del token - en formato stamp */
        iat: moment().unix(),
        /** fecha de expiracion */
        exp : moment().add(1,'days').unix()
    };
    /** el secret es la clave secreta, se genera el hash a traves de eso */
    return jwt.encode(payload,secret);
}

module.exports={createToken};