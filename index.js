const express = require("express");
const expressFileUpload = require("express-fileupload");
const fs = require("fs");
const app = express();

app.use(
    expressFileUpload({
        limits: { fileSize: 5242880},
        abortOnLimit: true,
        responseOnLimit: "El peso máximo es 5MB"
    })
)

app.use(express.static(__dirname + "/public"));


app.get("/", (req,res) => {
    res.sendFile(__dirname + '/public/formulario.html')
});


//subir img:
app.post("/imagen", (req, res) => {
    const { posicion } = req.body; 
    console.log(posicion);

    if(req.files.target_file.size >= 5242880) {
        return res.send('Solo se permiten imagenes hasta 5MB')
    }

    req.files.target_file.mv(`${__dirname}/public/imgs/imagen-${posicion}.jpg`, err => {
        if(err) {
            console.log(err);
            return res.send('Error');
        }
        //res.send('Archivo cargado');
        res.sendFile(__dirname + '/public/collage.html')
        //return res.redirect("/collage.html")
    });

});


//borrar:
app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params
    console.log(nombre);

    fs.unlink(`${__dirname}/public/imgs/${nombre}`, err => {
        if(err){
            console.log(err);
            return res.send('No se pudo eliminar el archivo');
        }
        console.log(`Archivo eliminado: ${nombre}`)
        return res.redirect("/collage.html");
    });

});


app.listen(5000, () => console.log('Servidor OK...'));