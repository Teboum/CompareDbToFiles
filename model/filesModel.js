const csv = require("csv-parser");
const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");
const ObjectsToCsv = require("objects-to-csv");

exports.csvParse = (file) => {
  return new Promise((resolve, reject) => {
    const results = [];
    var indexIndividu = 1;
    const response = [];
    var index = 0;
    fs.readFile("./statics/" + file + ".csv", "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      var result = data.replace(/;/g, ",");

      fs.writeFile(
        "./statics/" + file + ".csv",
        result,
        "utf8",
        function (err) {
          if (err) reject(err);
          fs.createReadStream(
            path.join(__dirname, "..", "statics", file + ".csv")
          )
            .pipe(csv())
            .on("data", (data) => {
              return results.push(data);
            })
            .on("end", () => {
              // [
              //   { NAME: 'Daffy Duck', AGE: '24' },
              //   { NAME: 'Bugs Bunny', AGE: '22' }
              // ]
              results.forEach((result) => {
                const keys = Object.keys(result);
                keys.forEach((e, i) => {
                  if (e.includes("naiss_jour_I") && result[e]) {
                    response[index] = {
                      dateNaissanceFichier: result[e],
                    };
                  }

                  if (e.includes("naiss_mois_I") && result[e]) {
                    response[index] = {
                      dateNaissanceFichier:
                        response[index].dateNaissanceFichier + "-" + result[e],
                    };
                  }
                  if (e.includes("naiss_année_I") && result[e]) {
                    response[index] = {
                      dateNaissanceFichier:
                        response[index].dateNaissanceFichier + "-" + result[e],
                    };
                  }
                  if (e.includes("ID_ind") && result[e]) {
                    response[index] = {
                      ...response[index],
                      idIndividu: result[e],
                      idFoyer: result.IDFOYER,
                    };
                    index++;
                  }
                });
              });
              fs.readFile(
                "./statics/" + file + ".csv",
                "utf8",
                function (err, data) {
                  if (err) {
                    reject(err);
                  }
                  var result = data.replace(/,/g, ";");

                  fs.writeFile(
                    "./statics/" + file + ".csv",
                    result,
                    "utf8",
                    function (err) {
                      if (err) reject(err);
                      resolve(response);
                    }
                  );
                }
              );
            });
        }
      );
    });
  });
};

exports.XMLParse = (file) => {
  var response = [];
  return new Promise((resolve, reject) => {
    var parser = new xml2js.Parser();
    fs.readFile(
      path.join(__dirname, "..", "statics", file + ".xml"),
      function (err, data) {
        parser.parseString(data, function (err, result) {
          if (err) reject(err);
          result.foyers.foyer.forEach((foyer, i) => {
            foyer.individus &&
              foyer.individus.forEach((elem, index) => {
                elem.individu &&
                  elem.individu.forEach((individu, ind) => {
                    var dateNaissance = individu.infoPerso[0].dateNaissance[0];
                    dateNaissance =
                      dateNaissance.slice(8, 10) +
                      "-" +
                      dateNaissance.slice(5, 7) +
                      "-" +
                      dateNaissance.slice(0, 4);

                    var dateEntree = individu.audience[0].dateEntree[0];
                    dateEntree =
                      dateEntree.slice(8, 10) +
                      "-" +
                      dateEntree.slice(5, 7) +
                      "-" +
                      dateEntree.slice(0, 4);
                    response.push({
                      idFoyer: foyer.idFoyer[0],
                      idIndividu: individu.idIndividu[0],
                      dateNaissanceFichier: dateNaissance,
                      dateEntreeFichier: dateEntree,
                    });
                  });
              });
          });
          resolve(response);
        });
      }
    );
  });
};

exports.objToCsv = (obj, csvName) => {
  (async () => {
    const csv = new ObjectsToCsv(obj);
    await fs.closeSync(fs.openSync("./statics/" + csvName + ".csv", "w"));
    await csv.toDisk("./statics/" + csvName + ".csv");
    fs.readFile("./statics/" + csvName + ".csv", "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/,/g, ";");

      fs.writeFile(
        "./statics/" + csvName + ".csv",
        result,
        "utf8",
        function (err) {
          if (err) return console.log(err);
        }
      );
    });
  })();
};
