const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet'); // Para protección contra XSS

// CONFIGURACIONES
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

//MIDDLEWARES
app.use(morgan('dev'));
app.use(helmet()); // Aplica encabezados de seguridad de Helmet
app.use(express.urlencoded({extended: false}))
app.use(express.json());

// RUTAS
app.use(require('./routes/index'));
app.use('/api/movies',require('./routes/movies'));


// EMPEZANDO EL SERVIDOR
app.listen(app.get('port'),() =>{
    console.log(`Server on port ${3000}`);
});