const express = require("express");
const router = express.Router();

const allergens = require("./allergens.json");
const beers = require("./beers.json");
const model = require("./model.js");
const orders = require("./orders.json")

// API backend - path kezelő
router.get("/beers", (req, res) => {
  res.send(beers);
});

router.get("/allergens", (req, res) => {
  res.send(allergens);
});

router.get("/order", (req, res) => {
  res.send(orders)
});

router.post("/order", (req, res) => {
  model.addNewOrder(req.body).then((data) => res.json(data));
})

module.exports = router;
