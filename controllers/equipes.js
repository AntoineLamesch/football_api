// Import du modèle equipes
var Equipes = require("../models/equipes");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const equipesValidationRules = () => {
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
      .withMessage("Un pays doit être spécifié pour cette equipe")
      .isAlphanumeric()
      .withMessage("Le pays ne doit pas contenir de caractère spéciaux."),

    body("stadeEquipe")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Un stade doit être spécifié pour cette equipe")
      .isAlphanumeric()
      .withMessage("Le satde ne doit pas contenir de caractère spéciaux."),

    body("dateCreation")
      .isDate({ format: "DD-MM-YYYY" })
      .withMessage("La date de création doit être au format DD-MM-YYYY")
      .custom((value) => {
        const minDate = new Date("1800-01-01");
        const maxDate = new Date("2100-12-31");
        const dateToCheck = new Date(value);
        if (dateToCheck < minDate || dateToCheck > maxDate) {
          throw new Error(
            "La date de création doit être comprise entre 1800 et 2100"
          );
        }
        return true;
      }),

    body("ligue")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Une ligue doit être spécifiée")
      .isAlphanumeric()
      .withMessage("La ligue ne doit pas contenir des caractères spéciaux"),
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
  equipesValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de equipes à ajouter
    var equipes = new Equipes({
      _id: req.body.id,
      nom: req.body.nom,
      pays: req.body.pays,
      stadeEquipe: req.body.stadeEquipe,
      dateCreation: req.body.dateCreation,
      ligue: req.body.ligue,
    });

    // Ajout de equipes dans la bdd
    equipes.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json("L'équipe a bien été crée!");
    });
  },
];

// Read
exports.getAll = function (req,res,next) {
  Equipes.find()
  .populate("ligue")
    .exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    }
  );
};

exports.getById = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    equipes.findById(req.params.id)
      .populate("ligue")
      .exec(function (err, result) {
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
  equipesValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de equipes à ajouter
    var equipes = new Equipes({
      _id: req.body.id,
      nom: req.body.nom,
      pays: req.body.pays,
      dateCreation: req.body.dateCreation,
      ligue: req.body.ligue,
    });

    equipes.findByIdAndUpdate(req.params.id, equipes, function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("equipes with id " + req.params.id + " is not found !");
      }
      return res.status(201).json("equipes updated successfully !");
    });
  },
];

// Delete
exports.delete = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    equipes.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("equipes with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("equipes deleted successfully !");
    });
  },
];
