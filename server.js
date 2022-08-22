const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var path = require('path');
const app = express();

app.listen(3000, () => console.log("App escuchando en el puerto 3000!"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
.connect(
  "mongodb+srv://eframacias13:Adimex2022@cluster0.x8paoaa.mongodb.net/tarea4?retryWrites=true&w=majority"
)
.catch((error) => console.error(error));

//Definiendo el esquema de Musica
const musicaSchema = new mongoose.Schema(
{
  //ID de cada registro autogenerado por MongoDB
  cancion: { cancion: String},
  artista: { artista: String},
  album: { album: String},
  anio: { anio: String},
  pais: { pais: String},
},
{
  collection: "musica",
}
);

//paseando el esquema al modelo Musica
const musica = mongoose.model("musica", musicaSchema);

//Funcion GET para mostrar el listado de canciones en formato JSON
app.get("/api/canciones", (req, res) => {
    musica.find((err, musica) => {
      if (err) res.status(500).send("Error en la base de datos");
      else res.status(200).json(musica);
    });
  });

//Funcion GET para buscar una cancion por ID   
  app.get("/api/canciones/:id", function (req, res) {
    musica.findById(req.params.id, function (err, musica) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (musica != null) {
          res.status(200).json(musica);
        } else res.status(404).send("No se encontro esa cancion");
      }
    });
  });

//Funcion GET para buscar una cancion por artista   
app.get("/api/canciones/:artista", function (req, res) {
    //hace un query de los documentos
    musica.find({ artista: { $gt: req.query.artista } }, function (err, artista) {
      if (err) {
        console.log(err);
        res.status(500).send("Error al leer de la base de datos");
      } else res.status(200).json(musica);
    });
  });

  app.get('',function (req, res) {
    res.sendFile(path.join(__dirname,'templates','index.html'));
  });

  app.get('/canciones',function (req, res) {
    res.sendFile(path.join(__dirname,'templates','canciones.html'));
  });

  //Metodo POST para poder agregar un nuevo artista a la base de datos
  app.post("/api/canciones", function (req, res) {
    //crea un objeto pero del modelo Persona
    const musica1 = new musica({
      cancion: { nombre: req.body.nombre },
      artista: { artista: req.body.artista},
      album: { album: req.body.album},
      anio: { anio: req.body.anio},
      pais: { pais: req.body.pais},
    });
  
    //guarda una cancion en la base de datos
    musica1.save(function (error, musica1) {
      if (error) {
        res.status(500).send("No se ha podido agregar.");
      } else {
        res.status(200).json(musica1);
      }
    });
  });

//Metodo PUT para poder modificar un artista a la base de datos
  app.put("/api/canciones/:id", function (req, res) {
    //Modificar con Find ID un elemento del Modelo Musica
    musica.findById(req.params.id, function (err, musica) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (musica != null) {
          musica.cancion = req.body.cancion;
          musica.artista= req.body.artista;
          musica.album= req.body.album;
          musica.anio = req.body.anio;
          musica.pais = req.body.pais;

          musica.save(function (error, musica1) {
            if (error) res.status(500).send("Error en la base de datos");
            else {
              res.status(200).send("Modificado exitosamente");
            }
          });
        } else res.status(404).send("No se encontro esa cancion");
      }
    });
  });
