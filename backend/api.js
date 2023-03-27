const express = require("express");
const router = express.Router();

const allergens = require("./allergens.json");
const beers = require("./beers.json");
const model = require("./model.js");

// API backend - path kezelő
router.get("/beers", (req, res) => {
  res.send(beers);
});

router.get("/allergens", (req, res) => {
  res.send(allergens);
});

// az order object meghívás
//router.get("/order");

module.exports = router;
