const express = express();
const router = express.Router();

const model = require("../model.js");

// API backend
router.get("/beers");
router.get("/allergens");
router.get("/order");

router.get("/beers/list");


module.exports = router;