const router = require("express").Router();
const {
  mainController,
  xmlToCsvController,
} = require("../controllers/mainController");

router.get("/", mainController);
router.get("/xmltocsv", xmlToCsvController);
module.exports = router;
