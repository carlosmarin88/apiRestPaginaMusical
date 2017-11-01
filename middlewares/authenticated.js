const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_curso';

exports.ensureAuth=(req,res,next)=>{
    let payload;
    
    if(!req.headers.authorization){
        return res.status(403).send({message: 'la petición no tiene la cabecera de autenticación'})
    }
    //sustituir todas las comillas del token eso significa la g
    let token = req.headers.authorization.replace(/['"]+/g,'');

    try {
        payload = jwt.decode(token,secret);
       if(payload.exp <= moment().unix()){
           return res.status(401).send({message: 'El token ha expirado'});
       }
       
    } catch (error) {
        console.log(error);
        return res.status(404).send({message:'Token no válido'}); 
    }

    req.user = payload;
    next();
}