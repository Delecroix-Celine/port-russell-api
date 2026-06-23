const express = require('express');
const router = express.Router();
const Catway = require('../models/Catway');

// 1. GET /catways - Lister l'ensemble des catways
router.get('/', async (req, res) => {
    try {
        const catways = await Catway.find();
        res.status(200).json(catways);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. GET /catways/:id - Récupérer les détails d'un catway spécifique
router.get('/:id', async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
        res.status(200).json(catway);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. POST /catways - Créer un catway (avec sécurité doublon intégrée)
router.post('/', async (req, res) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;

        // Sécurité : On vérifie si le numéro existe déjà
        const existingCatway = await Catway.findOne({ catwayNumber });
        if (existingCatway) {
            return res.status(400).json({ message: "Ce numéro de catway existe déjà." });
        }

        const newCatway = new Catway({
            catwayNumber,
            catwayType,
            catwayState
        });

        const savedCatway = await newCatway.save();
        res.status(201).json(savedCatway);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. PUT /catways/:id - Modifier la description de l'état d'un catway
router.put('/:id', async (req, res) => {
    try {
        // Seul l'état change (le numéro et le type ne bougent pas)
        const updatedCatway = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.id },
            { catwayState: req.body.catwayState },
            { new: true }
        );
        
        if (!updatedCatway) return res.status(404).json({ message: "Catway non trouvé" });
        res.status(200).json(updatedCatway);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5. DELETE /catways/:id - Supprimer un catway
router.delete('/:id', async (req, res) => {
    try {
        const catway = await Catway.findOneAndDelete({ catwayNumber: req.params.id });
        if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
        res.status(200).json({ message: "Catway supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;