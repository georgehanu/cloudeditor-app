const Backend = require("i18next-xhr-backend");
//const LanguageDetector = require( "i18next-browser-languagedetector");
const { reactI18nextModule } = require("react-i18next");
const i18n = require("i18next");

const i18nFunc = config => {
  const baseUrl = config.baseUrl || "http://localhost:8081";
  const publicPath = config.publicPath || "/";
  const basePath = config.basePath || "locales";
  const lang = config.lang || "en-US";

  return (
    i18n
      .use(Backend)
      //.use(LanguageDetector)
      .use(reactI18nextModule)
      .init({
        lng: lang,
        fallbackLng: "en-US",
        fallbackNS: "translate",
        ns: "translate",
        defaultNS: "translate",
        debug: "true",
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
          loadPath: baseUrl + publicPath + basePath + "/{{lng}}/{{ns}}.json"
        }
      })
  );
};

module.exports = i18nFunc;
