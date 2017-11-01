const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getAlbum(req, res) {
    let albumId = req.params.id;
    //La ruta la asocias a propiedad que tiene que llenar
    Album.findById(albumId)
        .populate({ path: 'artist' })
        .exec((err, album) => {
            if (err) {
                res.status(500).send({ message: 'Error en la peticion' });
            } else {
                if (!album) {
                    res.status(404).send({ message: 'El album no existe' });
                } else {
                    res.status(200).send({ album });
                }
            }
        });
}

function saveAlbum(req, res) {
    let album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    //pasa el id del artista
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else if (!albumStored) {
            res.status(404).send({ message: 'No se ha guardado el album' });
        } else {
            res.status(200).send({ albumStored });
        }

    });
}

function getAlbums(req, res) {
    let artistId = req.params.artist;
    let find
    if (!artistId) {
        //sacar todos los album de la base de datos
        find = Album.find({}).sort('title');
    } else {
        //sacar los album de un artista concreto
        find = Album.find({ artist: artistId }).sort('year');
    }
    /* sostituye el atributo a un objecto determinado */
    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else if (!albums) {
            res.status(404).send({ message: 'No hay albums' });
        } else {
            res.status(200).send({ albums });
        }
    });
}

function updateAlbum(req, res) {
    let albumId = req.params.id;
    let update = req.body;
    /**que lo encuentre y lo actualice  */
    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else if (!albumUpdated) {
            res.status(404).send({ message: 'No se ha actualizado el album' });
        } else {
            res.status(200).send({ album: albumUpdated });
        }
    });
}

function deleteAlbum(req,res){
    let albumId = req.params.id;

    Album.findByIdAndRemove(albumId,(err,albumRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el album'});
        }else if(!albumRemoved){
            res.status(404).send({message: 'El album no ha sido eliminado'});
        }else{
            Song.find({album: albumRemoved._id}).remove((err,songRemoved)=>{
                if(err){
                    res.status(500).send({message: 'Error al eliminar la canción'});
                }else if(!songRemoved){
                    res.status(404).send({message: 'La cancion no ah sido eliminada'});
                }else{
                    res.status(200).send({album: albumRemoved});
                }
            });
        }
    });
}
/**
 * metodo para cargar una imagen
 * @param {*} req 
 * @param {*} res 
 */
function upLoadImage(req, res) {
    let albumId = req.params.id;
    let filename = 'No subido...';
    if (req.files) {
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[file_split.length - 1];
        let ext_slipt = file_name.split('\.');
        let file_ext = ext_slipt[1];

        if (file_ext === 'png' || file_ext === 'jpg') {
            //actualizo solamente la imagen del documento
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'Error al actualizar el album' });
                } else {
                    if (!albumUpdated) {
                        res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                    } else {
                        res.status(200).send({ album: albumUpdated });
                    }

                }

            });
        } else {
            res.status(200).send({ message: 'Extensión del archivo no válida' });
        }

    } else {
        req.status(200).send({ message: 'no ha subido ninguna imagen' });
    }
};
/**
 * metodo para obtener la imagen del album
 * @param {*} req 
 * @param {*} res
 *  
 */
function getImageFile(req,res){
    let imageFile = req.params.imageFile;
    let path_file = `./uploads/albums/${imageFile}`;
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    upLoadImage,
    getImageFile
};