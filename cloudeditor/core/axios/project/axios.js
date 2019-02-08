const axios = require("axios");

let instance = axios.create({
  baseURL: "https://stadionzeitung02.bestinprint.de"
});

module.exports = instance;
