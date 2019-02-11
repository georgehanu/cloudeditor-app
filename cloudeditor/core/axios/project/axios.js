const axios = require("axios");

let instance = axios.create({
  //baseURL: "https://stadionzeitung02.bestinprint.de"
  baseURL: "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs"
});

module.exports = instance;
