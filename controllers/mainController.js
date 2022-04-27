const { getInfoIndividu } = require("../model/dbModel");
const { csvParse, XMLParse, objToCsv } = require("../model/filesModel");

exports.mainController = (req, res, next) => {
  var data = [];
  csvParse(req.query.csv)
    .then((result) => {
      data = result;
      return XMLParse(req.query.xml);
    })
    .then((result) => {
      data = data.concat(result);
      return getInfoIndividu();
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
          data.push(element);
        }
      });
      if (req.query.id) res.json({ test: "test" });
      else {
        res.render("mainList", { data: data });
      }
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
