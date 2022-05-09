const router = require("express").Router();
const multer = require("multer");
const {
  mainController,
  xmlToCsvController,
  uploadXMLView,
  uploadXML,
  downloadCSV,
  downloadCSVJSON,
} = require("../controllers/mainController");

router.get("/", mainController);
router.get("/xmltocsv", xmlToCsvController);
router.get("/upload", uploadXMLView);
router.post(
  "/uploadxml",
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "statics"); /// images--->folder destination
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); //file name with extention And to store it in db
      },
    }),
  }).single("xml"),
  uploadXML
);
router.get("/downloadcsv", downloadCSV);
router.get("/csvjson", downloadCSVJSON);
module.exports = router;
