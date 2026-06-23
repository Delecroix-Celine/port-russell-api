const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * @file auth.js
 * @description Routes pour la gestion de l'authentification (Connexion / Déconnexion)
 */

/**
 * @route POST /login
 * @description Connecte un utilisateur de la capitainerie et initialise sa session
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Trouver l'utilisateur par son email
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).send("Identifiants incorrects (email introuvable)");
        }

        // 2. Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Identifiants incorrects (mot de passe invalide)");
        }

        // 3. Stocker les infos de l'utilisateur dans la session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        // 4. Redirection vers le tableau de bord (qu'on va créer juste après)
        res.redirect('/dashboard');

    } catch (error) {
        res.status(500).send("Erreur lors de la connexion : " + error.message);
    }
});

/**
 * @route GET /logout
 * @description Déconnecte l'utilisateur en détruisant sa session
 */
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Erreur lors de la déconnexion");
        }
        res.clearCookie('connect.sid'); // Nettoie le cookie de session dans le navigateur
        res.redirect('/'); // Redirige vers l'accueil
    });
});

module.exports = router;