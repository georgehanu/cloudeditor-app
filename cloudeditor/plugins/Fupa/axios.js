const axios = require("axios");

const instance = axios.create({
  //baseURL: "https://stadionzeitung02.bestinprint.de/fupa/"
  baseURL: "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs"
});

module.exports = instance;
