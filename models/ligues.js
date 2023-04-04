// (Étape 1) Import du DRM mongoose et luxon
var mongoose = require("mongoose");
const { DateTime } = require("luxon");

/* (Étape 2) Définition de la méthode qui permet de valider le format d'un email
const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};*/

// (Étape 2) Définition du schéma ligues
// https://mongoosejs.com/docs/guide.html
// https://mongoosejs.com/docs/schematypes.html#schematype-options
const liguesSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    nom: { type: String, required: true },
    pays: { type: String, required: true },
    nbEquipes: { type: Number, required: false },
});

module.exports = mongoose.model("Ligues", liguesSchema);

// (Étape 3) Création d'une nouvelle propriété virtuelle "id" qui aura la valeur de la propriété "_id"
liguesSchema.virtual("id").get(function () {
    return this._id;
});

// (Étape 3) Définition de l'object qui sera retourné lorsque la méthode toJSON est appelée
liguesSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

// (Étape 4) Export du modèle ligues
// Les modèles sont responsables de la création et de la lecture des documents à partir de la base de données MongoDB.
module.exports = mongoose.model("Ligues", liguesSchema);