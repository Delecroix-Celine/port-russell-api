const express = require('express');
const router = express.Router({ mergeParams: true }); 
const Reservation = require('../models/Reservation');

// 1. GET /catways/:id/reservations - Lister toutes les réservations d'un catway
router.get('/:id/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find({ catwayNumber: req.params.id });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. GET /catways/:id/reservations/:idReservation - Détails d'une réservation spécifique
router.get('/:id/reservations/:idReservation', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ message: "Réservation introuvable" });
        }
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. POST /catways/:id/reservations - Créer une réservation pour un catway
router.post('/:id/reservations', async (req, res) => {
    try {
        const { clientName, boatName, startDate, endDate } = req.body;

        const newReservation = new Reservation({
            catwayNumber: req.params.id, // On récupère le numéro directement depuis l'URL !
            clientName,
            boatName,
            startDate,
            endDate
        });

        const savedReservation = await newReservation.save();
        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(400).json({ message: "Erreur de création : " + error.message });
    }
});

// 4. PUT /catways/:id/reservations/:idReservation - Modifier une réservation
// Note : Le brief indique "PUT /catways/:id/reservations", mais pour cibler la bonne réservation à modifier, 
// l'usage d'un ID de réservation (:idReservation) est indispensable.
router.put('/:id/reservations/:idReservation', async (req, res) => {
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.idReservation,
            req.body,
            { new: true } // Pour renvoyer l'objet mis à jour
        );

        if (!updatedReservation) {
            return res.status(404).json({ message: "Réservation introuvable" });
        }
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(400).json({ message: "Erreur de modification : " + error.message });
    }
});

// 5. DELETE /catways/:id/reservations/:idReservation - Supprimer une réservation
router.delete('/:id/reservations/:idReservation', async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.idReservation);
        if (!deletedReservation) {
            return res.status(404).json({ message: "Réservation introuvable" });
        }
        res.status(200).json({ message: "Réservation supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;