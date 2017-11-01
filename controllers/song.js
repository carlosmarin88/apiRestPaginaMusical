const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');


function getSong(req,res){
    let songId = req.params.id;

    Song.findById(songId).populate({path:'album'}).exec((err,song)=>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else if(!song){
            res.status(404).send({message:'La cancion no existe'});
        }else{
            res.status(200).send(song);
        }
    });
}

function getSongs(req,res){
  let albumId = req.params.album;
  let find;
  if(!albumId){
     find = Song.find({}).sort('number');
  }else{
      find = Song.find({album : albumId}).sort('number');
  }
  /**
  * populo los datos del artista tambien
  */
  find.populate({
    path : 'album',
    populate: {
      path: 'artist',
      model : 'Artist'
    }
  }).exec((err, songs)=>{
      if(err){
        res.status(500).send({message: 'Error en la petición'});
      }else if(!songs){
        res.status(404).send({message: 'No hay canciones'});
      }else{
        res.status(200).send({songs});
      }
  });

}

function saveSong(req,res){
    let song = new Song();

    let params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err,songStored)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }else if(!songStored){
         res.status(404).send({message : 'No se ha guardado la canción'});
        }else{
            res.status(200).send({song: songStored});
        }
    });
}

function updateSong(req,res){
  let songId = req.params.id;
  let update = req.body;

  Song.findByIdAndUpdate(songId, update,(err,songUpdate)=>{
    if(err){
      console.error(err);
      res.status(500).semd({message: 'surgio un error en el servidor'});
    }else if(!songUpdate){
      res.status(404).send({message: 'Error al actualizar el objeto'});
    }else{
      res.status(200).send({song: songUpdate});
    }
  });
}

function deleteSong(req,res){
  let songId = req.params.id;
  Song.findByIdAndRemove(songId,(err,songDelete)=>{
    if(err){
      res.status(500).send({message: 'Error al eliminar la canción'});
    }else if(!songDelete){
      res.status(404).send({message: 'No se ha econtrado la cancion'});
    }else{
      res.status(200).send({song: songDelete});
    }
  });
}

function upLoadFile(req,res){
  let songId = req.params.id;
  let fileName = 'No subido...';

  if(req.files){
    let file_path = req.files.file.path;
    let file_split = file_path.split('\\');
    file_name = file_split[file_split.length - 1];
    let ext_split = file_name.split('\.');
    let file_ext = ext_split[1];

    if(file_ext === 'mp3' || file_ext ==='ogg'){
      Song.findByIdAndUpdate(songId,{file: file_name},(err,songUpdate)=>{
        if(!songUpdate){
          res.status(404).send({message: 'No se ha podido actualizar la canción'});
        }else{
          res.status(200).send({song : songUpdate});
        }
      });
    }else{
      res.status(200).send({message: 'Extensión del archivo no valida: ' + file_ext});
    }
  }else{
    res.status(200).send({message: 'No has subido ningun archivo...'});
  }
}

function getSongFile(req,res){
  let file = req.params.songFile;
  var path_file = './uploads/songs/'+file;
  fs.exists(path_file,(exists)=>{
    if(exists){
      res.sendFile(path.resolve(path_file));
    }else{
      res.status(200).send({message: 'No existe el fichero de audio...'});
    }
  });
}


module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    upLoadFile,
    getSongFile,
}
