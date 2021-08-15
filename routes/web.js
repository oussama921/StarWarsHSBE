const router = require("express").Router();

const starshipController = require("../controllers/starship");
const personController = require("../controllers/person");
const planetController = require("../controllers/planet");
const specieController = require("../controllers/specie");
const vehicleController = require("../controllers/vehicle");
const filmController = require("../controllers/film");


let routes = app => {

  router.get('/starships', starshipController.getStarships)
  router.get('/people', personController.getPeople)
  router.get('/planets', planetController.getPlanets)
  router.get('/species', specieController.getSpecies)
  router.get('/vehicles', vehicleController.getVehicles)
  router.get('/films', filmController.getFilms)

  return app.use("/api", router);
};

module.exports = routes;

