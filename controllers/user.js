
/*importamos el modelo del usuario */
let User = require('../models/user');
/* para encriptar la contraseña*/
let bcrypt = require('bcrypt-nodejs');
let jwt = require('../services/jwt.js');
const fs = require('fs');
const path = require('path');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una action del controlador de usuario'
    });
}

function saveUser(req, res) {
    let user = new User();
    /*todo los datos que lleguen por post en forma de json */
    let params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        //Encriptar la contraseña y guardar
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            if (user.name != null && user.surname != null
                && user.email != null) {
                //guardar el usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al guardar el usuario' });
                    } else {
                        if (!userStored) {
                            res.status(404).send({ message: 'No se ha registrado el usuario' });
                        } else {
                            res.status(200).send({ user: userStored });
                        }
                    }
                });
            } else {
                res.status(200).send({ message: 'Rellena todos los campos' });
            }
        });
    } else {
        res.status(500).send({ message: 'Introduce la contraseña' });
    }
}

function loginUser(req, res) {
    let params = req.body;
    let email = params.email;
    let password = params.password;

    User.findOne({
        email: email.toLowerCase(),
    }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' })
        } else {
            if (!user) {
                res.status(404).send({message: 'El usuario no existe!'});
            } else {
                //comprobar la contraseña
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        if (params.gethash) {
                            //devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        } else {
                            res.status(200).send({ user });
                        }
                        //devolver los datos del usuario logueado
                    } else {
                        res.status(404).send({ message: 'El usuario no ha podido loguearse' });
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    console.log('actualizar el usuario');
    let userId = req.params.id;
    let update = req.body;

    /*viene el usuario logeado desde middleware 
    de autentificacion, en el payload, la configuracion que 
    dice que el sub es el id se encuentra en el archivo jwt,
    y la validacion, valida que el usuario que se modifique sea uno mismo  */
    if(userId!= req.user.sub){
      return res.status(500).send({message: 'No tienes permiso para actualizar estos datos'});
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el usuario' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ user: userUpdated });
            }

        }
    });
}

function upLoadImage(req, res) {
    let userId = req.params.id;
    let filename = 'No subido...';
    if (req.files) {
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[file_split.length - 1];
        let ext_slipt = file_name.split('\.');
        let file_ext = ext_slipt[1];

        if (file_ext === 'png' || file_ext === 'jpg') {
            //actualizo solamente la imagen del documento
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualizar el usuario' });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                    } else {
                        res.status(200).send({image: file_name, user: userUpdated });
                    }

                }

            });
        } else {
            res.status(200).send({ message: 'Extensión del archivo no válida' });
        }

    } else {
        req.status(200).send({ message: 'no ha subido ninguna imagen' });
    }
}

function getImageFile(req,res){
    let imageFile = req.params.imageFile;
    let path_file = `./uploads/users/${imageFile}`;
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    upLoadImage,
    getImageFile
}