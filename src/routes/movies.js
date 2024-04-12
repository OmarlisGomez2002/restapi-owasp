const { Router } = require('express');
const router = Router();
const _ = require('underscore');
const movies = require('../sample.json');

const { body, validationResult } = require('express-validator');  // Prevención de inyecciones (Injection Prevention)

// Autenticación y autorización adecuadas 
const authenticateUser = (req, res, next) => { // Middleware de autenticación
    
    const username = 'r_gomez'; 
    const password = '1234'; 
    const token    = 'K8E9KJYW8R95';

    if (username === 'r_gomez' && password === '1234' && token === 'K8E9KJYW8R95' ) {
        next(); 
    } else {
        res.status(401).json({ error: 'Autenticación fallida' });
    }
};

router.use(authenticateUser);
/*router.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["''"], 
        scriptSrc: ["''"], 
        styleSrc: ["''"], 
        fontSrc: ["''"], 
        imgSrc: ["''"], 
        objectSrc: ["''"], 
        upgradeInsecureRequests: [], 
    },
}));*/

// Obteniendo datos
router.get('/', (req, res) => { 
    res.json(movies);
});

// Validación de entrada (Input Validation)
// Enviando datos
router.post('/', 
    authenticateUser,  // Aplica el middleware de autenticación antes de procesar la solicitud
    body('title').isString().notEmpty(),  // Validación de campo title
    body('director').isString().notEmpty(),  // Validación de campo director
    body('year').isString().notEmpty(),  // Validación de campo year
    body('rating').isString().notEmpty(),  // Validación de campo rating
    (req, res) => {  // GUARDANDO EN MEMORIA
        const errors = validationResult(req);
        if (!errors.isEmpty()) {  // Manejo adecuado de errores (Error Handling)
            return res.status(400).json({ errors: errors.array() });
        }   

        const id = movies.length + 1;
        const newMovie = { ...req.body, id };
        movies.push(newMovie);
        res.json(movies);
    }
);
// actualizando datos
router.put('/:id', authenticateUser, (req, res) => {
    const { id } = req.params;
    const { title, director, year, rating } = req.body;
    // Validación de entrada (Input Validation)
    if (title && director && year && rating) {
        _.each(movies, (movie, i) => {
            if (movie.id == id) {
                movie.title = title;
                movie.director = director;
                movie.year = year;
                movie.rating = rating;
            }
        });
        res.json(movies);
    } else {
        res.status(500).json({ error: 'Hubo un error' });
    }
});
// Eliminando datos
router.delete('/:id', authenticateUser, (req, res) => {
    const { id } = req.params;
    
    _.each(movies, (movie, i) => { 
        if (movie.id == id) {
            movies.splice(i, 1);
        }
    })
    res.send(movies);
});

module.exports = router;