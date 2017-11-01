const path = require('path');
const fs = require('fs');
/**
 * para hacer paginacion
 */
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');


function getArtist(req, res) {
    let artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({ message: 'Error al obtener el artista' });
        } else {
            if (!artist) {
                res.status('404').send({ message: 'No se encontro el artista' });
            } else {
                res.status('200').send({ artist });
            }
        }
    });

}

function getArtists(req, res) {
    /**
     * crear paginación de la base
     */
    let page
    if (req.params.page) {
        page = req.params.page;
    } else {
        page = 1;
    }
    let itemsPage = 3;

    Artist.find().sort('name').paginate(page, itemsPage, (err, artists, total) => {
        if (err) {
            res.status('500').send({ message: 'Error en la petición' });
        } else {
            if (!artists) {
                res.status('404').send({ message: 'No hay artistas!!' });
            } else {
                return res.status('200').send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });
}

function saveArtist(req, res) {
    let artist = new Artist();

    let params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el artista' });
        } else {
            if (!artistStored) {
                res.status(404).send({ message: 'El artista no ha sido guardado' });
            } else {
                res.status(200).send({ artist: artistStored });
            }
        }
    });
}

function updateArtist(req, res) {
    let artistId = req.params.id;
    let update = req.body;
    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el artista' });
        } else {
            if (!artistUpdated) {
                res.status(404).send({ message: 'el artista no ha sido actualizado' });
            } else {
                res.status('200').send({ artist: artistUpdated });
            }
        }
    });
}
//TODO mejorar el codigo de eliminacion del artista
// buscar una mejor manera la eliminacion en cascada
function deleteArtist(req, res) {
    let artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemove) => {
        if (err) {
            res.status(500).send({ message: ' error al eliminar el artista' });
        } else {
            if (!artistRemove) {
                res.status(404).send({ message: 'El artista no ha sido eliminado' });
            } else {
                console.log(artistRemove);
                res.status(200).send(artistRemove);
                Album.find({ artist: artistRemove._id }).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al eliminar el album' });
                    } else {
                        if (!albumRemoved) {
                            res.status(404).send({ message: 'El album no ha sido eliminado' });
                        } else {
                            Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error al eliminar el elimincar la cancion' });
                                } else {
                                    if (!albumRemoved) {
                                        res.status(404).send({ message: 'La cancion no ha sido eliminado' });
                                    } else {
                                        res.status(200).send({ artist: artistRemove });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

/**
 * metodo para subir la imagen
 */

function uploadImage(req, res) {
    let artistId = req.params.id;
    let file_name = 'No subido ...';

    if (req.files) {
        let file_path = req.files.image.path;
        let file_split = file_path.split('\\');
        let file_name = file_split[2];

        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext === 'gif') {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if (!artistUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el artista' });
                } else {
                    res.status(200).send({ artist: artistUpdated })
                }
            });

        }else{
           res.status(200).send({message : 'Extension del archivo no valida'}); 
        }
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen...'});
    }
};

function getImageFile(req,res){
    let imageFile = req.params.imageFile;
    let path_file = './uploads/artists/'+imageFile;
    fs.exists(path_file,(exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message: 'No existe la imagen'});           
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};