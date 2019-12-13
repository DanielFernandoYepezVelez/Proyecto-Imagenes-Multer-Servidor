require('./database');

const { format } = require('timeago.js');
const express = require('express');
const multer = require('multer');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const ejs = require('ejs');

/* Initializations */
const app = express();

/* Settings */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './views/'));
app.set('view engine', 'ejs');

/* Middlewares */
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
/* Configurando Multer (Middleware) */
const storage = multer.diskStorage({
    destination: path.join(__dirname, './public/img/uploads'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
});
/* Ejecutando Multer (Middleware)*/
app.use(multer({ storage: storage }).single('image'));

/* Global Variables (SON MIDDLEWARES)*/
app.use((req, res, next) => {
    app.locals.format = format;
    next();
});

/* Routes */
app.use(require('./routes/index'));

/* Static Files */
app.use(express.static(path.join(__dirname, './public/')));

/* Starting The Server */
app.listen(app.get('port'), () => {
    console.log(`Server On Port ${app.get('port')}`);
})