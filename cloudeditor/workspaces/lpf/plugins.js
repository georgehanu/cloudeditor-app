const LpfLpf = require("../../plugins/Lpf/Lpf/Lpf");
const StepChooser = require("../../plugins/Lpf/Lpf/StepChooser/StepChooser");
const StepsConfigurator = require("../../plugins/Lpf/Lpf/StepsConfigurator/StepsConfigurator");
const PanelConfigurator = require("../../plugins/Lpf/Lpf/PanelConfigurator/PanelConfigurator");
const PrintOptionsConfigurator = require("../../plugins/Lpf/Lpf/PrintOptionsConfigurator/PrintOptionsConfigurator");
const GlobalLoading = require("../../plugins/Lpf/Lpf/GlobalLoading/GlobalLoading");
const ProductSumary = require("../../plugins/Lpf/Lpf/ProductSumary/ProductSumary");
const RelatedProductsConfigurator = require("../../plugins/Lpf/Lpf/RelatedProductsConfigurator/RelatedProductsConfigurator");
const WallDecorationConfigurator = require("../../plugins/Lpf/Lpf/WallDecorationConfigurator/WallDecorationConfigurator");
const DecorationConfigurator = require("../../plugins/Lpf/Lpf/WallDecorationConfigurator/plugins/DecorationConfigurator");
const SocketConfigurator = require("../../plugins/Lpf/Lpf/WallDecorationConfigurator/plugins/components/SocketConfigurator");
const OvalRectangleConfigurator = require("../../plugins/Lpf/Lpf/WallDecorationConfigurator/plugins/components/OvalRectangleConfigurator");
const ShapesConfigurator = require("../../plugins/Lpf/Lpf/WallDecorationConfigurator/plugins/components/ShapesConfigurator");
const ImageApiConfigurator = require("../../plugins/Lpf/Lpf/ImageApiConfigurator/ImageApiConfigurator");
const ApiConfigurator = require("../../plugins/Lpf/Lpf/ImageApiConfigurator/plugins/ApiConfigurator");
const ApiGalleryFreeImages = require("../../plugins/Lpf/Lpf/ImageApiConfigurator/plugins/components/ApiGalleryFreeImages");
const plugins = {
  LpfLpf: LpfLpf,
  StepChooser: StepChooser,
  StepsConfigurator: StepsConfigurator,
  PanelConfigurator: PanelConfigurator,
  PrintOptionsConfigurator: PrintOptionsConfigurator,
  GlobalLoading: GlobalLoading,
  ProductSumary: ProductSumary,
  RelatedProductsConfigurator: RelatedProductsConfigurator,
  WallDecorationConfigurator: WallDecorationConfigurator,
  DecorationConfigurator: DecorationConfigurator,
  SocketConfigurator: SocketConfigurator,
  OvalRectangleConfigurator: OvalRectangleConfigurator,
  ShapesConfigurator: ShapesConfigurator,
  ImageApiConfigurator: ImageApiConfigurator,
  ApiConfigurator: ApiConfigurator,
  ApiGalleryFreeImages: ApiGalleryFreeImages
};

const requires = {};

module.exports = { plugins, requires };
