// (Étape 1) Import de express
var express = require('express');

// (Étape 1) Définition du router
var router = express.Router();

// Import du Contrôleur equipes
var equipes_controller = require("../controllers/equipes");

// (Étape 2) Ajout de la route qui permet d'ajouter un étudiant
router.post("/", equipes_controller.create);

// (Étape 2) Ajout de la route qui permet d'afficher tous les étudiants
router.get("/", equipes_controller.getAll);

// (Étape 2) Ajout de la route qui permet d'afficher un seul étudiant grâce à son identifant
router.get("/:id", equipes_controller.getById);

// (Étape 2) Ajout de la route qui permet de modifier un seul étudiant grâce à son identifant
router.put("/:id", equipes_controller.update);

// (Étape 2) Ajout de la route qui permet de supprimer un seul étudiant grâce à son identifant
router.delete("/:id", equipes_controller.delete);

// (Étape 1) Export du router
module.exports = router;