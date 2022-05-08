const fs = require("fs");

const dateFormat = (date) =>
  date.slice(8, 10) + "-" + date.slice(5, 7) + "-" + date.slice(0, 4);

exports.jsonParse = (file) => {
  return new Promise((resolve, reject) => {
    const response = [];
    fs.readFile("./statics/" + file + ".json", "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      data = JSON.parse(data);
      data.forEach((e) => {
        e.individu.forEach((elem) => {
          response.push({
            idFoyer: e.idFoyer,
            idIndividu: elem.idIndividu,
            dateEntreeDB: dateFormat(elem.audience.dateEntree),
            dateNaissanceDB: dateFormat(elem.infoPerso.dateNaissance),
          });
        });
      });

      console.log(response);
      resolve(response);
    });
  });
};
