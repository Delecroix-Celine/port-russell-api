require('dotenv').config(); 
const express = require('express');
const session = require('express-session'); 
const path = require('path');               
const connectDB = require('./config/db.js');

const app = express();

// Connexion à la base de données
connectDB();

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');                               
app.set('views', path.join(__dirname, 'views'));             

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));     

// Configuration de la session utilisateur
app.use(session({                                            
    secret: process.env.SESSION_SECRET || 'port_russell_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Route d'accueil principale
app.get('/', (req, res) => {
    res.render('index', { title: "Accueil - Port de Russell" }); 
});

// Import des routes
const viewRoutes = require('./routes/viewRoutes'); // ◄ AJOUTÉ
const catwayRoutes = require('./routes/catways');
const reservationRoutes = require('./routes/reservation'); 
const userRoutes = require('./routes/users'); 
const authRoutes = require('./routes/auth');   

// Utilisation des routes
app.use('/', viewRoutes); // ◄ AJOUTÉ (doit être mis en premier pour gérer les pages HTML)
app.use('/catways', catwayRoutes);
app.use('/catways', reservationRoutes);
app.use('/users', userRoutes); 
app.use('/', authRoutes);      

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});