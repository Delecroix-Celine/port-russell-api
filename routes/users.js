const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// 1. GET /users - Lister tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // On cache le mot de passe haché par sécurité
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. GET /users/:email - Récupérer un utilisateur par son email
router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email.toLowerCase().trim() }).select('-password');
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. POST /users - Créer un utilisateur (Inscription)
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérification de l'existence de l'email
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) return res.status(400).json({ message: "Cet email est déjà utilisé." });

        // Le hachage du mot de passe va se faire automatiquement grâce au .pre('save') de ton modèle !
        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
        
        res.status(201).json({ message: "Utilisateur créé avec succès !", userId: savedUser._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. PUT /users/:email - Modifier un utilisateur
router.put('/:email', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ email: req.params.email.toLowerCase().trim() });

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        if (username) user.username = username;
        
        // Si un nouveau mot de passe est fourni, on l'assigne (le hook .pre('save') s'occupera de le re-hacher)
        if (password) user.password = password;

        await user.save();
        res.status(200).json({ message: "Utilisateur mis à jour avec succès" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 5. DELETE /users/:email - Supprimer un utilisateur
router.delete('/:email', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ email: req.params.email.toLowerCase().trim() });
        if (!deletedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;