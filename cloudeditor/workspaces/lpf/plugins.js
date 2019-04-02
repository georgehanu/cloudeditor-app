const LpfLpf = require("../../plugins/Lpf/Lpf/Lpf");
const StepChooser = require("../../plugins/Lpf/Lpf/StepChooser/StepChooser");
const StepsConfigurator = require("../../plugins/Lpf/Lpf/StepsConfigurator/StepsConfigurator");
const PanelConfigurator = require("../../plugins/Lpf/Lpf/PanelConfigurator/PanelConfigurator");
const MaterialConfigurator = require("../../plugins/Lpf/Lpf/MaterialConfigurator/MaterialConfigurator");
const plugins = {
  LpfLpf: LpfLpf,
  StepChooser: StepChooser,
  StepsConfigurator: StepsConfigurator,
  PanelConfigurator: PanelConfigurator,
  MaterialConfigurator: MaterialConfigurator
};

const requires = {};

module.exports = { plugins, requires };
