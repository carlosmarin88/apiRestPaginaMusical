
const express = require('express');
const userController = require('../controllers/user');
const md_auth = require('../middlewares/authenticated');
/** middleware de subida de fichero */
const multipart = require('connect-multiparty');

let api = express.Router();
/** se va a subir la imagen de los usuarios */
let md_upload = multipart({uploadDir:'./uploads/users'});

api.get('/probando-controlador', md_auth.ensureAuth,userController.pruebas);
api.post('/register',userController.saveUser);
api.post('/login',userController.loginUser);
/**:id hace que sea obligatorio el ? es opcional */
api.put('/update-user/:id',md_auth.ensureAuth,userController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],userController.upLoadImage);
api.get('/get-image-user/:imageFile',userController.getImageFile);


module.exports = api;