const express = require('express');
const AlbumController = require('../controllers/album');
const api = express.Router();
const md_auth = require('../middlewares/authenticated');
/*variables para cargar la imagen*/
const multipart = require('connect-multiparty');
let md_upload = multipart({uploadDir:'./uploads/albums'});


api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id',md_auth.ensureAuth,AlbumController.updateAlbum);
api.delete('/album/:id',md_auth.ensureAuth,AlbumController.deleteAlbum);
api.post('/upload-image-album/:id',[md_auth.ensureAuth,md_upload],AlbumController.upLoadImage);
api.get('/get-image-album/:imageFile',AlbumController.getImageFile);

module.exports = api;