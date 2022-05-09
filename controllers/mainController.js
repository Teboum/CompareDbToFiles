const { getInfoIndividu } = require("../model/dbModel");
const { csvParse, XMLParse, objToCsv } = require("../model/filesModel");
const { jsonParse } = require("../model/jsonModel");

exports.mainController = (req, res, next) => {
  var data = [];
  XMLParse(req.query.xml)
    .then((result) => {
      data = result;
      return jsonParse(req.query.json);
    })
    .then((result) => {
      result.forEach((element, i) => {
        if (
          data.findIndex((e) => +e.idIndividu === +element.idIndividu) !== -1
        ) {
          data[data.findIndex((e) => +e.idIndividu === +element.idIndividu)] = {
            ...data[
              data.findIndex((e) => +e.idIndividu === +element.idIndividu)
            ],
            dateEntreeDB: element.dateEntreeDB,
            dateNaissanceDB: element.dateNaissanceDB,
          };
        } else {
          console.log("elem", element);
          data.push(element);
        }
      });
      res.render("mainList", {
        data: data.filter(
          (e) =>
            e.dateNaissanceFichier != e.dateNaissanceDB ||
            e.dateEntreeFichier != e.dateEntreeDB
        ),
      });
    });
};

exports.xmlToCsvController = (req, res, next) => {
  XMLParse(req.query.xml)
    .then((obj) => {
      return objToCsv(obj, req.query.xml);
    })
    .then((obj) => {
      console.log(obj);
      res.render("csv", {
        csv: obj,
      });
    });
};

exports.uploadXMLView = (req, res, next) => {
  res.render("uploadcsv");
};

exports.uploadXML = (req, res, next) => {
  const fileName = req.file.originalname.slice(
    0,
    req.file.originalname.length - 4
  );
  XMLParse(fileName)
    .then((obj) => {
      return objToCsv(obj, fileName);
    })
    .then((obj) => {
      console.log(obj);
      res.render("csv", {
        csv: obj,
        download: fileName,
      });
    });
};

exports.downloadCSV = (req, res, next) => {
  console.log(req.query.fileName);
  const file = `./statics/${req.query.fileName}.csv`;
  res.download(file); // Set disposition and send it.
};

exports.downloadCSVJSON = (req, res) => {
  if (req.query.json) {
    jsonParse(req.query.json)
      .then((obj) => objToCsv(obj, req.query.json))
      .then(() => {
        const file = `./statics/${req.query.json}.csv`;
        res.download(file);
      });
  }
};
