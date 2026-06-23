const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway'); 
const User = require('../models/User');     

/**
 * @file viewRoutes.js
 * @description Gestionnaire des routes d'affichage des pages HTML (EJS)
 */

/**
 * Middleware de sécurité pour vérifier si l'utilisateur est connecté.
 */
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/');
}

/**
 * @route GET /dashboard
 * @description Affiche le tableau de bord principal
 */
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const reservations = await Reservation.find();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('fr-FR', options);

        res.render('dashboard/index', {
            user: req.session.user,
            dateToday: today,
            reservations: reservations
        });
    } catch (error) {
        res.status(500).send("Erreur tableau de bord : " + error.message);
    }
});

/**
 * @route GET /dashboard/catways
 * @description Interface CRUD pour la gestion des Catways
 */
router.get('/dashboard/catways', isAuthenticated, async (req, res) => { 
    try {
        const catways = await Catway.find();
        res.render('dashboard/catways', {
            user: req.session.user,
            catways: catways
        });
    } catch (error) {
        res.status(500).send("Erreur lors du chargement des catways : " + error.message);
    }
});

/**
 * @route GET /dashboard/reservations
 * @description Interface CRUD pour la gestion des Réservations
 */
router.get('/dashboard/reservations', isAuthenticated, async (req, res) => { 
    try {
        const reservations = await Reservation.find();
        const catways = await Catway.find(); 
        res.render('dashboard/reservations', {
            user: req.session.user,
            reservations: reservations,
            catways: catways
        });
    } catch (error) {
        res.status(500).send("Erreur lors du chargement des réservations : " + error.message);
    }
});

/**
 * @route GET /dashboard/users
 * @description Interface CRUD pour la gestion des Utilisateurs
 */
router.get('/dashboard/users', isAuthenticated, async (req, res) => { // ◄ AJOUTÉ
    try {
        // Récupérer tous les utilisateurs en masquant leur mot de passe haché
        const users = await User.find().select('-password');
        res.render('dashboard/users', {
            user: req.session.user,
            users: users
        });
    } catch (error) {
        res.status(500).send("Erreur lors du chargement des utilisateurs : " + error.message);
    }
});

/**
 * @route GET /docs
 * @description Affiche la documentation technique de l'API du Port de Russell
 */
router.get('/docs', (req, res) => {
    res.render('docs', { title: "Documentation API - Port de Russell" });
});

module.exports = router;