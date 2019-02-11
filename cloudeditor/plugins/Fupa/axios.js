const axios = require("axios");

const instance = axios.create({
  baseURL: "https://stadionzeitung02.bestinprint.de/fupa/"
});

module.exports = instance;
