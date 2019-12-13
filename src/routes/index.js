const { Router } = require('express');
const router = Router();

const { unlink } = require('fs-extra'); //Para Eliminar la Imagen y sorporta promesas y async-await
const path = require('path');

/* Modelo de la BD */
const Image = require('../models/image');

router.get('/', async(req, res) => {
    try {
        const images = await Image.find();
        res.render('index', { images: images });
    } catch (error) {
        console.log(error);
    }
});

router.get('/upload', (req, res) => {
    res.render('upload');
})

router.post('/upload', async(req, res) => {
    try {
        // console.log(req.file); (Lo Tomo Del Middleware De Multer).
        const image = new Image();
        image.title = req.body.title;
        image.description = req.body.description;
        image.filename = req.file.filename;
        image.path = './img/uploads/' + req.file.filename;
        image.originalname = req.file.originalname;
        image.mimetype = req.file.mimetype;
        image.size = req.file.size;

        /* Esto es una operación ASYNCRONA
        por ende, va a tomar un tiempo y para 
        manejar que NODEJS haga una pausa y haga la
        operacion de guardar la imagen, se necesita
        un callback, promesa o async-await, por que
        NODEJS es un lenguaje NO-BLOCKING */
        await image.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;

        const image = await Image.findById(id);
        res.render('profile', { image: image });
    } catch (error) {
        console.log(error);
    }
});

/* Debo Eliminar Los Datos De La DB Y Tambien La Imagen
Desde las carpetas ./public/img/uploads es decir,
eliminar su ubicación en el servidor */
router.get('/image/:id/delete', async(req, res) => {
    try {
        const { id } = req.params;

        /* Una vez elimines el objeto de la BD guardalo en
        la variable image, para luego obtener el path de las imagen y
        asi eliminarla desde el servidor */
        const image = await Image.findByIdAndRemove(id);

        /*Eliminando la imagen del servidor  */
        await unlink(path.resolve('./src/public/' + image.path)); //Este metodo resolve me da la ubicacion inicial de donde se esta ejecutando el index.js, es decir la carpeta src.
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;