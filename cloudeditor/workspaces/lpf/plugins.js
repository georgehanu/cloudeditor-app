const LpfLpf = require("../../plugins/Lpf/Lpf/Lpf");
const StepChooser = require("../../plugins/Lpf/Lpf/StepChooser/StepChooser");
const StepsConfigurator = require("../../plugins/Lpf/Lpf/StepsConfigurator/StepsConfigurator");
const PanelConfigurator = require("../../plugins/Lpf/Lpf/PanelConfigurator/PanelConfigurator");
const PrintOptionsConfigurator = require("../../plugins/Lpf/Lpf/PrintOptionsConfigurator/PrintOptionsConfigurator");
const GlobalLoading = require("../../plugins/Lpf/Lpf/GlobalLoading/GlobalLoading");
const ProductSumary = require("../../plugins/Lpf/Lpf/ProductSumary/ProductSumary");
const plugins = {
  LpfLpf: LpfLpf,
  StepChooser: StepChooser,
  StepsConfigurator: StepsConfigurator,
  PanelConfigurator: PanelConfigurator,
  PrintOptionsConfigurator: PrintOptionsConfigurator,
  GlobalLoading: GlobalLoading,
  ProductSumary: ProductSumary
};

const requires = {};

module.exports = { plugins, requires };
