const Backend = require("i18next-xhr-backend");
//const LanguageDetector = require( "i18next-browser-languagedetector");
const { reactI18nextModule } = require("react-i18next");
const i18n = require("i18next");

i18n
  .use(Backend)
  //.use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: "en-US",
    fallbackNS: "translate",
    ns: "translate",
    defaultNS: "translate",
    debug: true,
    load: "currentOnly",
    interpolation: {
      escapeValue: false
    },
    react: {
      wait: true,
      nsMode: "translate",
      bindStore: false,
      bindI18n: "languageChanged"
    },
    backend: {
      loadPath: "./locales/{{lng}}/{{ns}}.json"
    }
  });

module.exports = i18n;
