// Import du modèle ligues
var Ligues = require("../models/ligues");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const liguesValidationRules = () => {
  return [
    body("nom")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Un nom de ligue doit être spécifié")
      .isAlphanumeric()
      .withMessage("Cette ligue ne doit pas contenir des caractères spéciaux"),

    body("pays")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Un pays doit être spécifié pour cette ligue")
      .isAlphanumeric()
      .withMessage("Le pays ne doit pas contenir de caractère spéciaux."),

    body("nbEquipes")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Un nombre d'equipes doit être spécifié pour cette ligue"),
  ];
};

const paramIdValidationRule = () => {
  return [
    param("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("L'id doit être spécifié.")
      .isNumeric()
      .withMessage("L'id doit être un chiffre."),
  ];
};

const bodyIdValidationRule = () => {
  return [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("L'id doit être spécifié.")
      .isNumeric()
      .withMessage("L'id doit être un chiffre."),
  ];
};

// Méthode de vérification de la conformité de la requête
const checkValidity = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

// Create
exports.create = [
  bodyIdValidationRule(),
  liguesValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de ligues à ajouter
    var Ligues = new Ligues({
      _id: req.body.id,
      nom: req.body.nom,
      pays: req.body.pays,
      nbEquipes: req.body.nbEquipes,
    });

    // Ajout de ligues dans la bdd
    Ligues.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json("La ligue a bien été crée!");
    });
  },
];

// Read
exports.getAll = (req, res, next) => {
  Ligues.find(function (err, result) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

exports.getById = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Ligues.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    });
  },
];

// Update
exports.update = [
  paramIdValidationRule(),
  liguesValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de ligues à ajouter
    var Ligues = new Ligues({
        _id: req.body.id,
        nom: req.body.nom,
        pays: req.body.pays,
        nbEquipes: req.body.nbEquipes,
      });

    Ligues.findByIdAndUpdate(req.params.id, ligues, function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("ligues with id " + req.params.id + " is not found !");
      }
      return res.status(201).json("ligues updated successfully !");
    });
  },
];

// Delete
exports.delete = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Ligues.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("ligues with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("ligues deleted successfully !");
    });
  },
];
