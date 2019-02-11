const axios = require("axios");

const instance = axios.create({
  //baseURL: "https://stadionzeitung02.bestinprint.de/fupa/"
  baseURL: "http://work.cloudlab.at:9012/hp/asgard/public/en/api/fupa/"
});

module.exports = instance;
