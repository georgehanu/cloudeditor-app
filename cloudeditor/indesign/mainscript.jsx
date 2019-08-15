#target indesign
#include json2.js

app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
var w = new Window('dialog {text: "Batch Export/Packaging Preferences", orientation: "column", alignChildren:["fill","fill"], properties: {closeButton: false}}');
var options = {};
w.main = w.add('group {preferredSize: [600, 500], alignChildren: ["left","fill"]}');
w.stubs = w.main.add('listbox', undefined, ['1. Preflight', '2.1. Input/Output', '2.2 Preferences']);
w.stubs.preferredSize.width = 150;
w.tabGroup = w.main.add('group {alignment: ["fill","fill"], orientation: "stack"}');
w.tabs = [];
// Preflight
w.tabs[0] = w.tabGroup.add('group');
w.tabs[0].add('statictext {text: "Preflight"}');
w.tabs[0].add('panel');
var preflightTab = w.tabs[0].add('panel {text: " ", preferredSize: [-1, 80]}');
preflightTab.alignChildren = "left";
preflightTab.add('statictext{text:"Check your document for errors"}');
preflightTab.buttons = preflightTab.add('group {alignment: ["fill","fill"]}');
preflightTab.dummy = preflightTab.add('group');
var list = preflightTab.dummy.add('listbox', undefined, undefined, {
    numberOfColumns: 3,
    showHeaders: true,
    columnTitles: ['Type', 'Message', 'Location'],
    columnWidths: [50, 350, 70],
    multiselect: true
});
list.minimumSize.height = 450;
list.minimumSize.width = 500;
preflightTab.buttons = preflightTab.add('group');
var startPreflight = preflightTab.buttons.add('button {text: "Start Preflight"}');
startPreflight.onClick = function() {
    preflightDocument(list);
}
//
// Input/Output locations
w.tabs[1] = w.tabGroup.add('group');
w.tabs[1].add('statictext {text: "Export locations"}');
w.tabs[1].add('panel');
var inputTab = w.tabs[1].add('panel {text: "Input ", preferredSize: [-1, 80]}');
var outputTab = w.tabs[1].add('panel {text: "Output", preferredSize: [-1, 80]}');

inputTab.alignChildren = "left";
inputTab.add('statictext{text:"Choose Input folder"}');
var folderInput = inputTab.add('edittext', undefined);
folderInput.preferredSize.width = 400;
inputTab.buttons = inputTab.add('group {alignment: ["fill","fill"], orientation:["fill","fill"]}');
var openInput = inputTab.buttons.add('button {text: "Open"}');
openInput.onClick = function() {
    var folderIn = Folder.selectDialog("Select a folder with InDesign files");
    folderInput.value = folderIn.fsName;
    folderInput.text = folderIn.absoluteURI;
    w.inValue = folderInput.value;
    options.input = w.inValue;
}
outputTab.alignChildren = "left";
outputTab.add('statictext{text:"Choose Output folder"}');
var outputFolder = outputTab.add('edittext', undefined, '');
outputFolder.preferredSize.width = 400;
outputTab.buttons = outputTab.add('group {alignment: ["fill","fill"], orientation:["fill","fill"]}');
var openOutput = outputTab.buttons.add('button {text: "Open"}');
openOutput.onClick = function() {
    var folderOut = Folder.selectDialog("Select a folder with InDesign files");
    outputFolder.value = folderOut.absoluteURI;
    outputFolder.text = folderOut.absoluteURI.toString();
    w.outValue = outputFolder.value;
    options.output = w.outValue;
}
//  End Input/Output locations
// General export preferences
w.tabs[2] = w.tabGroup.add('group');
w.tabs[2].add('statictext {text: "General"}');
w.tabs[2].add('panel');
var writeErrors = w.tabs[2].add('checkbox {text: "Write errors to log"}');
var pdfTab = w.tabs[2].add('panel {text: "PDF", preferredSize: [-1, 80]}');
var packageTab = w.tabs[2].add('panel {text: "Package", preferredSize: [-1, 80]}');
var imagesTab = w.tabs[2].add('panel {text: "Image preferences", preferredSize: [-1, 150]}');
//start export tab
var exportTab = w.tabs[2].add('panel {text: "Export preferences", preferredSize: [-1, 150]}');
var includeZip = exportTab.add("checkbox", undefined, "Zip package (Note: experimental function only for WINDOWS)");
includeZip.value = false;
var includeOriginals = exportTab.add("checkbox", undefined, "Keep original packages");
includeOriginals.value = false;
exportTab.alignChildren = "left";
// end export tab
var showBleedMarks = pdfTab.add("checkbox", undefined, "IncludeBleed");
showBleedMarks.value = false;
pdfTab.alignChildren = "left";
// add pdf presets options
var arr = [];
for (var i in PDFXStandards) {
    var type = PDFXStandards[i];
    arr.push(type);
}
var pdfPresets = arr;
pdfTab.add('statictext{text:"PDF Standard Compliance: "}');
var pdfStandard = pdfTab.add('dropdownlist', undefined, pdfPresets);
pdfStandard.selection = 5;
// add package preferences
packageTab.alignChildren = "left";
packageTab.orientation = "row";
var fonts = packageTab.add("checkbox", undefined, "Include Fonts");
fonts.value = true;
fonts.enabled = false;
var links = packageTab.add("checkbox", undefined, "Include Links");
links.value = true;
links.enabled = false;
var png = packageTab.add("checkbox", undefined, "Include Png");
png.value = true;
png.enabled = false;


//add image preferences
imagesTab.alignChildren = "left";
imagesTab.add('statictext{text:"Choose image resolution(ppi):"}');
var resolutionSelect = imagesTab.add('dropdownlist', undefined, ['72', '96', '150', '300', '600', '1200', '2400']);
resolutionSelect.preferredSize.width = 100;
resolutionSelect.selection = 2;
var transparency = imagesTab.add("checkbox", undefined, "Use transparent background");
transparency.value = true;
// end image preferences
// End general export preferences
w.buttons = w.tabs[2].add('group {alignment: ["center","center"]}');
w.okBtn = w.buttons.add('button {text: "Start Export"}');
w.cancelBtns = w.add('group');
w.cancelBtn = w.cancelBtns.add('button {text: "Cancel"}');
w.okBtn.onClick = function() {
    options.packageOptions = [];
    options.imageResolution = resolutionSelect.selection.text;
    options.useTransparency = transparency.value;
    options.showBleedMarks = showBleedMarks.value;
    options.includeZip = includeZip.value;
    options.includeOriginals = includeOriginals.value;
    options.includeFonts = fonts.value;
    options.includeLinks = links.value;
    options.writeErrors = writeErrors.value;
    options.standardPdf = pdfStandard.selection.text;
    for (var i = 0; i < pdfTab.children.length; i++) {
        if (pdfTab.children[i].value == true)
            options.pdfPreset = pdfTab.children[i].text;
    }
    for (var i = 0; i < packageTab.children.length; i++) {
        if (packageTab.children[i].value == true)
            options.packageOptions[i] = packageTab.children[i].text;
    }
    if (typeof(w.outValue) == "undefined" || typeof(w.inValue) == "undefined") {
        alert("Please selet input/output locations");
    } else {
        w.close();
    }
}
w.cancelBtn.onClick = function() {
    options.stop = true;
    w.close();

}
for (var i = 0; i < w.tabs.length; i++) {
    w.tabs[i].orientation = 'column';
    w.tabs[i].alignChildren = 'fill';
    w.tabs[i].alignment = ['fill', 'fill'];
    w.tabs[i].visible = false;
}
w.stubs.onChange = showTab;

function showTab() {
    if (w.stubs.selection !== null) {
        for (var i = w.tabs.length - 1; i >= 0; i--) {
            w.tabs[i].visible = false;
        }
        w.tabs[w.stubs.selection.index].visible = true;
    }
}
w.onShow = function() {
    w.stubs.selection = 0;
    showTab;
}
w.show();
beginExport(options);
// start export functionality
function beginExport(options) {
    var start = Date.now();
    WriteToFile("\r--------------------- Script started -- " + GetDate() + " ---------------------\n");
    if (options.stop) {
        return;
    }
    var tempPreset = app.pdfExportPresets.item("tempPreset");
    try {
        tempPreset.name;
    } catch (eNoSuchPreset) {
        tempPreset = app.pdfExportPresets.add({
            name: "tempPreset"
        });
    }
    with(tempPreset) {
        cropMarks = false;
        bleedMarks = false;
        if (options.showBleedMarks) {
            useDocumentBleedWithPDF = true;
        } else {
            useDocumentBleedWithPDF = false;
        }
        switch (options.standardPdf) {
            case "PDFX42010_STANDARD":
                standardsCompliance = PDFXStandards.PDFX42010_STANDARD;
                break;
            case "PDFX1A2001_STANDARD":
                standardsCompliance = PDFXStandards.PDFX1A2001_STANDARD;
                break;
            case "PDFX1A2003_STANDARD":
                standardsCompliance = PDFXStandards.PDFX1A2003_STANDARD;
                break;
            case "PDFX32002_STANDARD":
                standardsCompliance = PDFXStandards.PDFX32002_STANDARD;
                break;
            case "PDFX32003_STANDARD":
                standardsCompliance = PDFXStandards.PDFX32003_STANDARD;
                break;
            case "NONE":
                standardsCompliance = PDFXStandards.NONE;
                break;
            default:
                standardsCompliance = PDFXStandards.PDFX42010_STANDARD;
                break;
        }
    }
    var progressBarWindow = new Window('window', 'Packaging files');
    var outputFolder = options.output;
    try {
        if (options.input) {
            var inputFolder = Folder(options.input);
            var subfolders = inputFolder.getFiles();
            if (options.includeOriginals) {
                var originalsFolder = new Folder(options.input + "/originals/");
                if (originalsFolder.exists) {
                    originalsFolder = new Folder(originalsFolder + "_" + parseInt((Math.random() * (2000 - 10)) + 10));
                }
            }
            var progressBar = progressBarWindow.add('progressbar', [12, 12, 350, 24], 0, subfolders.length);
            var progressBarTxt = progressBarWindow.add('statictext', undefined, 'Starting packaging files');
            progressBarTxt.bounds = [0, 0, 740, 30];
            progressBarTxt.alignment = "left";
            progressBarWindow.show();
            progressBarWindow.cancelButton = progressBarWindow.add('button', undefined, 'Close');
            progressBarWindow.cancelButton.onClick = function() {
                return progressBarWindow.exception = new Error('User canceled the pre-processing!');
            };
            var inddFilesCount = getAllInddFiles(subfolders);
            var indexFile = 1;
            for (var index = 0; index < subfolders.length; index++) {
                var myCurrentFolder = subfolders[index];
                if (options.includeOriginals) {
                    copyFolder(myCurrentFolder, new Folder(originalsFolder + '/' + myCurrentFolder.name));
                }
                if (myCurrentFolder instanceof Folder) {
                    var myInddFiles = myCurrentFolder.getFiles("*.indd");
                    for (indd_index = 0; indd_index < myInddFiles.length; indd_index++) {
                        indexFile++;
                        var myCurrentFile = myInddFiles[indd_index];
                        // add values to progress bar
                        progressBar.value = indexFile;
                        progressBarTxt.text = String("Packaging file - " + myCurrentFile.name + " (" + indexFile + " of " + inddFilesCount + " from folder " + myCurrentFolder.name + " ) ");
                        WriteToFile("Packaging file - " + myCurrentFile.name + "\n");
                        // end add values to progress bar
                        exportAndCreatePackage(myCurrentFile, outputFolder, options, tempPreset);
                    }
                }
            }
        }
        var end = Date.now();
        var diff = (end - start) / 1000.0;
        WriteToFile("\r--------------------- Script ended-- " + GetDate() + " ---------------------\n");
        WriteToFile("\r--------------------- Script finished in " + diff + " seconds---------------------\n");
    } catch (err) {
        WriteToFile("\r An error has occured " + err + "\n");
    }
}

function getAllInddFiles(subfolders) {
    var count = 1;
    for (var index = 0; index < subfolders.length; index++) {
        var myCurrentFolder = subfolders[index];
        if (myCurrentFolder instanceof Folder) {
            var myInddFiles = myCurrentFolder.getFiles("*.indd");
            for (indd_index = 0; indd_index < myInddFiles.length; indd_index++) {
                count++;
            }
        }
    }
    return count;
}

function exportAndCreatePackage(document, outputFolder, options, tempPreset) {
    var outputFolder = Folder(options.output);
    try {
        var myDoc = app.open(document, false);
        var myDocumentName = myDoc.name.slice(0, -5);
        // updating indesign file's links
        updateLinks(myDoc);
        //
        var inddFolderExport = new Folder(outputFolder + "/" + myDocumentName + "_" + parseInt((Math.random() * (2000 - 10)) + 10));
        inddFolderExport.create();
        var myFolderName = myDoc.filePath;
        var hasAdditional = false;
        var dynamicLayers = [];
        var additionalLayers = [];
        var staticLayers = [];
        var noLayers = myDoc.layers.length - 1;
        var layersOrder = {};
        var additional_index = 1;
        var dynamic_index = 1;
        for (i = noLayers; i >= 0; i--) {
            var currentLayer = myDoc.layers[i];
            layersOrder[currentLayer.index] = {};
            if (i == noLayers && currentLayer.locked) {
                staticLayers.push(currentLayer.name);
            } else {
                if (currentLayer.locked) {
                    layersOrder[currentLayer.index] = {
                        'type': 'additional'
                    };
                    currentLayer.name = 'additional' + parseInt(additional_index);
                    additionalLayers.push(currentLayer.name);
                    additional_index++;
                } else {
                    layersOrder[currentLayer.index] = {
                        'type': 'dynamic'
                    };
                    currentLayer.name = 'dynamic' + parseInt(dynamic_index);
                    dynamicLayers.push(currentLayer.name);
                    dynamic_index++;
                }
            }
        }
        if (additionalLayers.length) {
            hasAdditional = true;
        }

        var presets = options.pdfPreset;
        var layouts = {};
        for (var p = 0; p < myDoc.pages.length; p++) {
            var page = myDoc.pages[p];
            var layout = page.appliedAlternateLayout.alternateLayout;
            if (page.appliedAlternateLayout.index == 0) {
                layouts[layout] = {
                    'default': true
                };
            } else {
                layouts[layout] = {};
            }
        }
        var layouts_data = JSON.stringify(layouts);
        writeJson(layouts_data, inddFolderExport, 'layoutsData.json');
        for (layout in layouts) {
            var layoutFolder = new Folder(inddFolderExport + "/" + layout.replace(/ /g, "_"));
            app.pdfExportPreferences.pageRange = layout;
            app.pngExportPreferences.pageString = layout;
            var thumbnailFolder = new Folder(inddFolderExport + "/" + layout.replace(/ /g, "_") + "/thumbnails");
            thumbnailFolder.create();
            createThumbnails(myDoc, thumbnailFolder, true, layout);
            layoutFolder.create();
            var additional_folder = new Folder(inddFolderExport + "/" + layout.replace(/ /g, "_") + "/additional/");
            if (hasAdditional) {
                additional_folder.create();
            }
            var myFilePath = layoutFolder + "/" + myDocumentName + ".pdf";
            var myStaticFile = new File(myFilePath);
            exportStaticPdf(myDoc, myStaticFile, presets, thumbnailFolder, tempPreset, staticLayers, layout); //export static layers
            for (var layer_index = additionalLayers.length - 1; layer_index >= 0; layer_index--) {
                var layerName = additionalLayers[layer_index];
                exportAdditionalPdf(myDoc, layer_index + 1, additional_folder, tempPreset, layerName); // export additional layers
                myDoc.layers.item(layerName).visible = false;
            }
            var blocksData = getBlocksData(myDoc, dynamicLayers, layout, options, additionalLayers);
            var jsonData = JSON.stringify(blocksData);
            writeJson(jsonData, layoutFolder, 'data.json');
        }
        createPackage(myDoc, inddFolderExport); // create the package

        if (options.includeZip) {
            if (File.fs == "Macintosh") {
                var destZip = inddFolderExport.parent.fsName + '/' + inddFolderExport.name + '.zip';
                var toZip = inddFolderExport.parent.fsName + '/' + inddFolderExport.name;
                var zipCommand = 'zip -r -X -y ' + destZip.replace(/(\s)/, "\\\\ ") + ' ' + toZip.replace(/(\s)/, "\\\\ ");
                var appleCommand = 'do shell script "' + zipCommand + '"';
                app.doScript(appleCommand, ScriptLanguage.APPLESCRIPT_LANGUAGE);
            } else if (File.fs == "Windows") {
                var basePath = options.extensionRoot;
                var f = new File(basePath + '/zipShell.vbs');
                var destZip = inddFolderExport.parent.fsName + '\\' + inddFolderExport.name + '.zip';
                var toZip = inddFolderExport.parent.fsName + '\\' + inddFolderExport.name;
                var destZip = inddFolderExport.parent.fsName + '\\' + inddFolderExport.name + '.zip';
                var toZip = inddFolderExport.parent.fsName + '\\' + inddFolderExport.name;
                app.doScript(f, ScriptLanguage.VISUAL_BASIC, [destZip, toZip, basePath, 'zip.vbs']);
            }
        }

        app.pdfExportPreferences.pageRange = "All";
        myDoc.close(SaveOptions.YES, myDoc, '', true);
    } catch (err) {
        WriteToFile("\r An error has occured " + err + "\n");
    }
}

function getObjectsForPage(page, dynamicBlocks, dynamicLayer, additionalLayers) {
    var blocks = [];
    var dynamicBlocksPerLayer = {};
    for (var key in dynamicBlocks) {
        if (dynamicBlocks.hasOwnProperty(key)) {
            var currentBlock = dynamicBlocks[key];
            var layer = currentBlock.layer;
            if (typeof(dynamicBlocksPerLayer[layer]) != "undefined") {
                dynamicBlocksPerLayer[layer][currentBlock.id] = currentBlock;
            } else {
                dynamicBlocksPerLayer[layer] = [];
                dynamicBlocksPerLayer[layer][currentBlock.id] = currentBlock;
            }
        }
    }
    for (var layer in dynamicBlocksPerLayer) {
        if (dynamicBlocksPerLayer.hasOwnProperty(layer)) {
            var blocksForLayer = dynamicBlocksPerLayer[layer];
            for (var blockId in blocksForLayer) {
                var dynamicBlock = blocksForLayer[blockId];
                if (parseInt(page.name - 1) == dynamicBlock.page && layer == dynamicLayer) {
                    blocks.push(dynamicBlock.id);
                }
            }
        }
    }
    return blocks;
}

function rgb2CMYK(r, g, b, document) {
    var color = document.colors.add({
        space: ColorSpace.RGB,
        colorValue: [r, g, b]
    });
    color.space = ColorSpace.CMYK;
    var retVal = color.colorValue;
    color.remove();
    return retVal;
}

function CMYK2rgb(c, m, y, k, document) {
    var color = document.colors.add({
        space: ColorSpace.CMYK,
        colorValue: [c, m, y, k]
    });
    color.space = ColorSpace.RGB;
    var retVal = color.colorValue;
    color.remove();
    return retVal;
}

function getJustificationMapped(value) {
    var eq = 'center';
    switch (value) {
        case "LEFT_ALIGN":
            eq = 'left';
            break;
        case 'CENTER_ALIGN':
            eq = 'center';
            break;
        case 'RIGHT_ALIGN':
            eq = 'right';
            break;
        default:
            eq = 'center';
            break;
    }
    return eq;
}

function getColorObject(colorObj, myDoc) {
    var space = colorObj.space.toString(0);
    var colorValue = colorObj.colorValue;
    if (space == "CMYK") {
        var colorSpace = 'DeviceCMYK';
        var cmykValue = Math.round(colorValue[0]) / 100 + ' ' + Math.round(colorValue[1]) / 100 + ' ' + Math.round(colorValue[2]) / 100 + ' ' + Math.round(colorValue[3]) / 100;
        var rgbValueConverted = CMYK2rgb(colorValue[0], colorValue[1], colorValue[2], colorValue[3], myDoc);
        var rgbValue = (Math.round(rgbValueConverted[0]) / 255).toFixed(3) + ' ' + (Math.round(rgbValueConverted[1]) / 255).toFixed(3) + ' ' + (Math.round(rgbValueConverted[2]) / 255).toFixed(3);
        var htmlRgbValue = Math.round(rgbValueConverted[0]) + ',' + Math.round(rgbValueConverted[1]) + ',' + Math.round(rgbValueConverted[2]);
    } else if (space == "RGB") {
        var colorSpace = 'DeviceRGB';
        var htmlRgbValue = colorValue;
        var rgbValue = (Math.round(colorValue[0]) / 255).toFixed(3) + ' ' + (Math.round(colorValue[1]) / 255).toFixed(3) + ' ' + (Math.round(colorValue[2]) / 255).toFixed(3);
        var cmykValueConverted = rgb2CMYK(colorValue[0], colorValue[1], colorValue[2], myDoc);
        var cmykValue = Math.round(cmykValueConverted[0]) / 100 + ' ' + Math.round(cmykValueConverted[1]) / 100 + ' ' + Math.round(cmykValueConverted[2]) / 100 + ' ' + Math.round(cmykValueConverted[3]) / 100;
    }
    return {
        'htmlRGB': htmlRgbValue.toString(),
        'RGB': rgbValue.toString(),
        'CMYK': cmykValue,
        'name': colorObj.name.toString(),
        'colorSpace': colorSpace
    };
}

function getDynamicBlocks(myDoc, dynamicLayers, alternateLayout, options) {
    var blocks = {};
    for (var i = 0; i < dynamicLayers.length; i++) {
        var layer = myDoc.layers.item(dynamicLayers[i]);
        var items = layer.allPageItems;
        var index = 0;
        for (var item = items.length - 1; item >= 0; item--) {
            var obj = items[item];
            var page = obj.parentPage;
            var page_height = page.bounds[2] - page.bounds[0];
            var layout = page.appliedAlternateLayout.alternateLayout;
            if (layout == alternateLayout) {
                var spread = page.parent;
                var backgroundColor = '';
                var borderColor = '';
                var border = '';
				var BlockId = 'Block_' + obj.id;
				if( obj.hasOwnProperty("objectExportOptions") && obj.objectExportOptions.customAltText ) {
					var customOptions = obj.objectExportOptions.customAltText.split(';');
					for (var key in customOptions) {
                        var value = customOptions[key].split('=');
						if( value[0] === "BlockName" ) {
							BlockId = value[1];
							break;
						}
                    }
				}
                
                /*global options*/
                if ( obj instanceof TextFrame || obj instanceof Rectangle || obj instanceof Polygon ) {
                    if ( obj instanceof Image ) {
                        var obj = image.parent;
                    }
                    var position = calculatePositions( obj, myDoc, options );
                    var geometricBounds = obj.geometricBounds;
                    var rules = getRules( obj );

                    if ( obj.fillColor && !(obj.fillColor instanceof Swatch && obj.fillColor.name.toString() == "None") ) {
                        var backgroundColor = getColorObject( obj.fillColor, myDoc );
                    }

                    if ( obj.strokeWeight && obj.strokeWeight > 1 ) {
                        border = obj.strokeWeight.toString();
                        borderColor = getColorObject( obj.strokeColor, myDoc );
                    }

                    blocks[BlockId] = {
                        'id'              : BlockId,
                        'name'            : BlockId,
                        'layer'           : obj.itemLayer.name.toString(),
                        'width'           : position[2] - position[0],
                        'height'          : position[3] - position[1],
                        'left'            : geometricBounds[1],
                        'top'             : geometricBounds[0],
                        'ruleProperties'  : rules,
                        'page'            : parseInt( page.name - 1 ),
                        'opacity'         : obj.transparencySettings.blendingSettings.opacity,
                        'rotateAngle'     : obj.rotationAngle,
                        'customOptions'   : obj.objectExportOptions.customAltText,
                         //'custom'          : customOptionsData,
                        'bgColor'         : backgroundColor,
                        //'backgroundColor'         : backgroundColor,
                        'borderwidth'     : border,
                        'borderColor'     : borderColor,
                    };

                    if (obj instanceof TextFrame) {
                        var story = obj.parentStory;
                        var kerning = false;
                        var underline = false;
                        var textColor = '';
                        if (story.fillColor && !(story.fillColor instanceof Swatch && story.fillColor.name.toString() == "None")) {
                            textColor = getColorObject(story.fillColor, myDoc);
                        }
                        
                        var tracking = (story.tracking / 1000) * story.pointSize;

                        blocks[BlockId]['subType'] = 'textflow';
                        blocks[BlockId]['type'] = 'textbox';
                        blocks[BlockId]['layout'] = layout.replace(/ /g, "_");
                        blocks[BlockId]['index'] = obj.index;
                        
                        blocks[BlockId]['vAlign'] = obj.textFramePreferences.verticalJustification.toString();
                        blocks[BlockId]['text'] = obj.contents;
                        blocks[BlockId]['value'] = obj.contents;
                        blocks[BlockId]['fillColor'] = textColor;
                        blocks[BlockId]['textAlign'] = getJustificationMapped(story.justification.toString());
                        blocks[BlockId]['kerning'] = story.kerningMethod;
                        blocks[BlockId]['underline'] = story.underline;
                        blocks[BlockId]['fontSize'] = story.pointSize;
                        blocks[BlockId]['fontFamily'] = story.appliedFont.fontFamily.toString();
                        blocks[BlockId]['font'] = {
                            'fontSize': story.pointSize,
                            'appliedFont': story.appliedFont.name.toString(),
                            'fontFamily': story.appliedFont.fontFamily.toString(),
                            'fontStyleName': story.appliedFont.fontStyleName.toString(),
                            'fontStyleNameNative': story.appliedFont.fontStyleNameNative.toString(),
                            'fontType': story.appliedFont.fontType.toString(),
                            'postscriptName': story.appliedFont.postscriptName.toString(),
                            'fontType': story.appliedFont.fontType.toString(),
                            'fontStyle': story.fontStyle
                        };
                        blocks[BlockId]['horizontalScale']= story.horizontalScale;
                        blocks[BlockId]['hyphenWeight']= story.hyphenWeight;
                        blocks[BlockId]['hyphenateAcrossColumns']= story.hyphenateAcrossColumns;
                        blocks[BlockId]['hyphenateAfterFirst']= story.hyphenateAfterFirst;
                        blocks[BlockId]['hyphenateBeforeLast']= story.hyphenateBeforeLast;
                        blocks[BlockId]['hyphenateCapitalizedWords']= story.hyphenateCapitalizedWords;
                        blocks[BlockId]['hyphenateLadderLimit']= story.hyphenateLadderLimit;
                        blocks[BlockId]['hyphenateLastWord']= story.hyphenateLastWord;
                        blocks[BlockId]['hyphenateWordsLongerThan']= story.hyphenateWordsLongerThan;
                        blocks[BlockId]['hyphenation']= story.hyphenation;
                        blocks[BlockId]['hyphenationZone']= story.hyphenationZone;
                        blocks[BlockId]['lastLineIndent']= story.lastLineIndent;
                        blocks[BlockId]['autoLeading']= story.autoLeading;
                        blocks[BlockId]['capitalization']= story.capitalization.toString();
                        blocks[BlockId]['paragraphStyle']= story.appliedParagraphStyle.name.toString();
                        blocks[BlockId]['italicAngle']= story.skew;
                        blocks[BlockId]['shearAngle']= obj.shearAngle;
                        blocks[BlockId]['position']= position;
                        blocks[BlockId]['tracking']= story.tracking;
                        blocks[BlockId]['indesign']= 1;
                        
                        var customOptions = obj.objectExportOptions.customAltText.split(';');
                        for (var key in customOptions) {
                            var value = customOptions[key].split('=');
                            blocks[BlockId][value[0]] = value[1];
                        }
                        if (story.fontStyle == 'Bold') {
                            blocks[BlockId]['bold'] = 1;
                        } else if (story.fontStyle == 'Italic') {
                            blocks[BlockId]['italic'] = 1;
                        } else if (story.fontStyle == 'Bold Italic') {
                            blocks[BlockId]['bold'] = 1;
                            blocks[BlockId]['italic'] = 1;
                        }

                    } else if (obj instanceof Rectangle) {
                        if (obj instanceof Rectangle) {
                            var image = '';
                        } else if (obj instanceof Image) {
                            var image = obj;
                            var obj = image.parent;
                        }
                        
                        if (obj instanceof Rectangle) {
                            
                            blocks[BlockId]['subType']= 'rectangle';
                            blocks[BlockId]['type']= 'rectangle';
                            blocks[BlockId]['indesign']= 1;
                            blocks[BlockId]['layout']= layout.replace(/ /g, "_");
                            blocks[BlockId]['index']= obj.index;
                            blocks[BlockId]['shearAngle']= obj.shearAngle;
                            blocks[BlockId]['fillColor']= backgroundColor;
                            blocks[BlockId]['position']= position;                            

                            if (obj.images.length > 0) {
                                var img = obj.images[0];
                                var imageCropData = getImageCropData(obj, img);

                                blocks[BlockId]["type"] = "image";
                                blocks[BlockId]["subType"] = "image";
                                
                                blocks[BlockId]["imageUri"] = obj.graphics[0].itemLink.name;
                                blocks[BlockId]["image_src"] = '/Links/' + obj.graphics[0].itemLink.name;
                                blocks[BlockId]["image_path"] = '/Links/' + obj.graphics[0].itemLink.name;

                                blocks[BlockId]["cropX"] = imageCropData.cropX;
                                blocks[BlockId]["cropY"] = imageCropData.cropY;
                                blocks[BlockId]["cropW"] = imageCropData.cropW;
                                blocks[BlockId]["cropH"] = imageCropData.cropH;

                                blocks[BlockId]["fittingData"] = {
                                    'fittingType': obj.frameFittingOptions.fittingOnEmptyFrame.toString(),
                                    'rightCrop': obj.frameFittingOptions.rightCrop,
                                    'leftCrop': obj.frameFittingOptions.leftCrop,
                                    'bottomCrop': obj.frameFittingOptions.bottomCrop,
                                    'topCrop': obj.frameFittingOptions.topCrop,
                                };

                            }

                            var customOptions = obj.objectExportOptions.customAltText.split(';');
                            for (var key in customOptions) {
                                var value = customOptions[key].split('=');
                                blocks[BlockId][value[0]] = value[1];
                            }
                        }
                    }
                    else if ( obj instanceof Polygon ) {
                        myDoc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
                        myDoc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;
                        obj.parentPage.layoutRule = LayoutRuleOptions.OFF;
                        var width = obj.visibleBounds[3] - obj.visibleBounds[1];
                        var height = obj.visibleBounds[2] - obj.visibleBounds[0];
                        obj.parentPage.marginPreferences.properties = {
                            top    : 0,
                            left   : 0,
                            right  : 0,
                            bottom : 0
                        };
                        var rotationAngle = obj.rotationAngle;
                        var initialAnchorPoint = app.activeWindow.transformReferencePoint;
                        app.activeWindow.transformReferencePoint =AnchorPoint.CENTER_ANCHOR;
                        obj.rotationAngle = 0;
                        app.activeWindow.transformReferencePoint = initialAnchorPoint;
                        obj.parentPage.resize( CoordinateSpaces.INNER_COORDINATES, AnchorPoint.CENTER_ANCHOR, ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, [width, height] );
                        obj.move( [0, 0] );
                        var paths = obj.paths;
                        var page = obj.parentPage;
                        var page_height = page.bounds[2] - page.bounds[0];
                        var topLeftX = geometricBounds[1];
                        var rightLeftY = geometricBounds[2];
                        var translateX = -1 * topLeftX;
                        var translateY = -1 * Math.abs( page_height - rightLeftY );
                        var transform = 'translate(0,0)';
                        var pathColor = '';
                        var pathStrokeColor = '';
                        if ( typeof backgroundColor !== "undefined" && backgroundColor !== "" ) {
                            if ( typeof backgroundColor.RGB !== "undefined" ) {
                                var colorRgb = backgroundColor.RGB.split( ' ' );
                                var pathColor = 'rgb(' + (255 * colorRgb[0]) + ',' + (255 * colorRgb[1]) + ',' + (255 * colorRgb[2]) + ')';
                            }
                        }
                        if ( typeof borderColor !== "undefined" && borderColor !== "" ) {
                            if ( typeof borderColor.RGB !== "undefined" ) {
                                var colorBorderRgb = borderColor.RGB.split( ' ' );
                                var pathStrokeColor = 'rgb(' + (255 * colorBorderRgb[0]) + ',' + (255 * colorBorderRgb[1]) + ',' + (255 * colorBorderRgb[2]) + ')';
                            }
                        }
                        var strokeWidth = 1;
                        if ( typeof border !== "undefined" ) {
                            strokeWidth = border;
                        }
                        var svg = '<?xml version="1.0" standalone="no"?><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + width + '" height="' + height + '">';
                        for ( var p = 0; p < paths.count(); p++ ) {
                            var currentPath = paths[p];
                            var pathPoints = currentPath.pathPoints;
                            svg += '<g tranform="' + transform + '"><path stroke-width="' + strokeWidth + '" fill="' + pathColor + '" stroke="' + pathStrokeColor + '" d="';
                            for ( var pp = 0; pp < pathPoints.count(); pp++ ) {
                                var currentPoint = pathPoints[pp];
                                if ( pp == 0 ) {
                                    svg += 'M ' + currentPoint.anchor.toString().replace( /,/g, ' ' );
                                }
                                var nextPoint = pathPoints[pp + 1];
                                if ( nextPoint.isValid ) {
                                    svg += ' C ' + currentPoint.rightDirection.toString().replace( /,/g, ' ' ) + ' ' + nextPoint.leftDirection.toString().replace( /,/g, ' ' ) + ' ' + nextPoint.anchor.toString().replace( /,/g, ' ' );
                                    if ( (pp + 1) == (pathPoints.count() - 1) ) {
                                        svg += ' C ' + nextPoint.rightDirection.toString().replace( /,/g, ' ' ) + ' ' + pathPoints[0].leftDirection.toString().replace( /,/g, ' ' ) + ' ' + pathPoints[0].anchor.toString().replace( /,/g, ' ' );
                                    }
                                }
                            }
                            svg += ' Z" /></g>';
                        }
                        svg += '</svg>';
                        for ( var action = 0; action < 4; action++ ) {
                            myDoc.undo( action );
                        }
                        var svgFolder = Folder( myDoc.filePath + '/svgs/' );
                        if ( !svgFolder.exists ) {
                            svgFolder.create();
                        }
                        writeSvg( svg, svgFolder, BlockId + '.svg' );
                        if ( File( svgFolder + '/' + BlockId + '.svg' ).exists ) {
                            blocks[BlockId]['fillColor'] = null;
                            blocks[BlockId]['backgroundColor'] = null;
                            blocks[BlockId]['borderColor'] = null;
                            blocks[BlockId]['borderwidth'] = null;
                            blocks[BlockId]["type"] = "graphics";
                            blocks[BlockId]["subType"] = "graphics";

                            blocks[BlockId]["imagePath"] = 'Links/' + BlockId + '.svg';
                            blocks[BlockId]["packageRelative"] = 1;

                            // new
                            var customOptions = obj.objectExportOptions.customAltText.split(';');
                            for (var key in customOptions) {
                                var value = customOptions[key].split('=');
                                blocks[BlockId][value[0]] = value[1];
                            }
                        }
                    }
                }
            }
        }
    }
    return blocks;
}

function getRules(obj) {
    var horizontalRule = {};
    var verticalRule = {};
    var rules = {};
    if (typeof(obj.horizontalLayoutConstraints) != "undefined") {
        horizontalRule = {
            'leftMargin': obj.horizontalLayoutConstraints[0].toString(),
            'width': obj.horizontalLayoutConstraints[1].toString(),
            'rightMargin': obj.horizontalLayoutConstraints[2].toString()
        };
    }
    if (typeof(obj.verticalLayoutConstraints) != "undefined") {
        verticalRule = {
            'topMargin': obj.verticalLayoutConstraints[0].toString(),
            'height': obj.verticalLayoutConstraints[1].toString(),
            'bottomMargin': obj.verticalLayoutConstraints[2].toString()
        };
    }
    var topMarginFixed = 0;
    if (verticalRule.topMargin == DimensionsConstraints.FIXED_DIMENSION.toString()) {
        topMarginFixed = 1;
    }
    var bottomMarginFixed = 0;
    if (verticalRule.bottomMargin == DimensionsConstraints.FIXED_DIMENSION.toString()) {
        bottomMarginFixed = 1;
    }
    var heightResizable = 0;
    if (verticalRule.height == DimensionsConstraints.FLEXIBLE_DIMENSION.toString()) {
        heightResizable = 1;
    }
    var widthResizable = 0;
    if (horizontalRule.width == DimensionsConstraints.FLEXIBLE_DIMENSION.toString()) {
        widthResizable = 1;
    }
    var leftMarginFixed = 0;
    if (horizontalRule.leftMargin == DimensionsConstraints.FIXED_DIMENSION.toString()) {
        leftMarginFixed = 1;
    }
    var rightMarginFixed = 0;
    if (horizontalRule.rightMargin == DimensionsConstraints.FIXED_DIMENSION.toString()) {
        rightMarginFixed = 1;
    }
    rules = {
        'topMarginFixed': topMarginFixed,
        'bottomMarginFixed': bottomMarginFixed,
        'heightResizable': heightResizable,
        'leftMarginFixed': leftMarginFixed,
        'rightMarginFixed': rightMarginFixed,
        'widthResizable': widthResizable,
    }
    return rules;
}

function getImageCropData(parent, image) {
    var parentGeometricBounds = parent.geometricBounds;
    var imageGeometricBounds = image.geometricBounds;
    var scaleImgX = image.absoluteHorizontalScale / 100;
    var scaleImgY = image.absoluteVerticalScale / 100;
    var defaultPpi = 72;
    var imgPpi = image.actualPpi;
    var percent = imgPpi[0] / defaultPpi;
    var cropX, cropY, cropW, cropH, blockWidth, blockHeight;
    var data = {};
    cropX = -1 * (imageGeometricBounds[1] - parentGeometricBounds[1]) / scaleImgX;
    cropY = -1 * (imageGeometricBounds[0] - parentGeometricBounds[0]) / scaleImgY;
    blockWidth = parentGeometricBounds[3] - parentGeometricBounds[1];
    blockHeight = parentGeometricBounds[2] - parentGeometricBounds[0];
    imgWidth = imageGeometricBounds[3] - imageGeometricBounds[1];
    imgHeight = imageGeometricBounds[3] - imageGeometricBounds[1];
    cropW = blockWidth / scaleImgX;
    cropH = blockHeight / scaleImgY;
    data = {
        'cropX': cropX * percent,
        'cropY': cropY * percent,
        'cropW': cropW * percent,
        'cropH': cropH * percent
    }
    return data;
}

function getBlocksData(myDoc, dynamicLayers, alternateLayout, options, additionalLayers) {
    try {
        myDoc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
        myDoc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;
        var data = {};
        data.project = {};
        data['project']['pages'] = {};
        data['project']['pagesOrder'] = [];
        var blocks2 = {};
        var layouts = {};
        for (var p = 0; p < myDoc.pages.length; p++) {
            var page = myDoc.pages[p];
            var layout = page.appliedAlternateLayout.alternateLayout;
            layouts[layout] = [];
        }
        var pagesInformation = {};
        var allPages = myDoc.pages;
        var additionalObjects = {};
        var blocks = getDynamicBlocks(myDoc, dynamicLayers, alternateLayout, options);
        for (var p = 0; p < allPages.length; p++) {
            var page = allPages[p];
            var page_index = page.name;
            var pageLayout = page.appliedAlternateLayout.alternateLayout;
            var objectIds = [];

            if (pageLayout == alternateLayout) {
                var blockStatic = getStaticBlock(myDoc, page, alternateLayout);
                blocks[blockStatic.id] = blockStatic;
                objectIds.push(blockStatic.id);
                for (var d = 0; d < dynamicLayers.length; d++) {
                    var dynamicLayer = dynamicLayers[d];
                    var blocksForPage = getObjectsForPage(page, blocks, dynamicLayer, additionalLayers);
                    for (var block in blocksForPage) {
                        var blockForPage = blocksForPage[block];
                        objectIds.push(blockForPage);
                    }
                    var additionalLayerName = dynamicLayer.replace('dynamic', 'additional');
                    if (inArray(additionalLayers, additionalLayerName)) {
                        var additionalDataName = additionalLayerName.split('additional');
                        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                        var uniqid = randLetter + Date.now() + Math.random().toString(36).substring(2, 5);
                        if (inArray(additionalObjects, uniqid)) {
                            uniqid += Math.random().toString(36).substring(2, 5);
                        }
                        var additionalBlockName = 'Block_' + uniqid;
                        objectIds.push(additionalBlockName);
                        if (typeof(additionalObjects[additionalBlockName]) != "undefined") {
                            additionalObjects[additionalBlockName] = {
                                'page': parseInt(page.name),
                                'layer': additionalLayerName,
                                'additional_index': additionalDataName[1],
                                'width': page.bounds[3] - page.bounds[1],
                                'height': page.bounds[2] - page.bounds[0]
                            };
                        } else {
                            additionalObjects[additionalBlockName] = {};
                            additionalObjects[additionalBlockName] = {
                                'page': parseInt(page.name),
                                'layer': additionalLayerName,
                                'additional_index': additionalDataName[1],
                                'width': page.bounds[3] - page.bounds[1],
                                'height': page.bounds[2] - page.bounds[0]
                            };
                        }
                    }
                }
                var guides = getGuidesForPage(page);
                data['project']['pages']['page_' + parseInt(page.name - 1)] = {
                    'id': 'page_' + parseInt(page.name - 1),
                    'label': page.name,
                    'width': page.bounds[3] - page.bounds[1],
                    'height': page.bounds[2] - page.bounds[0],
                    'objectsIds': objectIds,
                    'layout': pageLayout.replace(/ /g, "_"),
                    'rule': page.layoutRule.toString(),
                    'boxes': {
                        'trimbox': {
                            'top': myDoc.documentPreferences.documentBleedTopOffset,
                            'right': myDoc.documentPreferences.documentBleedOutsideOrRightOffset,
                            'bottom': myDoc.documentPreferences.documentBleedBottomOffset,
                            'left': myDoc.documentPreferences.documentBleedInsideOrLeftOffset,
                        }
                    },
                    'guides': guides,
                }
                data['project']['pagesOrder'].push('page_' + parseInt(page.name - 1));
                if (typeof(pagesInformation[page_index]) != "undefined") {
                    pagesInformation[page_index] = {
                        'layout': pageLayout,
                        'layoutRule': page.layoutRule,
                        'blocks': []
                    }
                } else {
                    pagesInformation[page_index] = {};
                    pagesInformation[page_index] = {
                        'layout': pageLayout,
                        'layoutRule': page.layoutRule,
                        'blocks': []
                    }
                }

            }
        }
        for (var blockId in additionalObjects) {
            var additionalBlock = additionalObjects[blockId];
            if (additionalBlock.page !== 1) {
                var additionalFilePng = 'additional' + additionalBlock.additional_index + additionalBlock.page;
            } else {
                var additionalFilePng = 'additional' + additionalBlock.additional_index;
            }
            var additionalFilePdf = 'additional' + additionalBlock.additional_index;
            blocks[blockId] = {
                'id': blockId,
                'type': 'image',
                'width': additionalBlock.width,
                'height': additionalBlock.height,
                'left': 0,
                'top': 0,
                'subType': 'pdf',
                'ignoreOnRest': 0,
                'indesign': 1,
                'image_src': '/additional/' + additionalFilePng + '.png',
                'image_path': '/additional/' + additionalFilePdf + '.pdf',
                'cropX': 0,
                'cropY': 0,
                'cropW': 0,
                'cropH': 0
            }
        }
        data['project']['objects'] = {};
        data['project']['objects'] = blocks;
        return data;
    } catch (err) {
        alert(err + ' :' + err.line);
        $.writeln(err + ' :' + err.line);
    }

}

function getGuidesForPage(page) {
    var guides = page.guides;
    var guidesObject = {};
    for (var g = 0; g < guides.length; g++) {
        var guide = guides[g];
        if (guide.guideType == GuideTypeOptions.LIQUID) {
            if (guide.orientation == HorizontalOrVertical.HORIZONTAL) {
                var guideType = 'horizontal';
            } else {
                var guideType = 'vertical';
            }
            guidesObject[g] = {
                'type': guideType,
                'offset': guide.location
            }
        }
    }
    return guidesObject;
}

function getStaticBlock(myDoc, page, alternateLayout) {
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniqid = randLetter + Date.now() + Math.random().toString(36).substring(2, 5);
    var block_name = 'Block_' + uniqid;
    var width = page.bounds[3] - page.bounds[1];
    var height = page.bounds[2] - page.bounds[0];
    if (parseInt(page.name) !== 1) {
        var staticFilePng = '/thumbnails/page_' + parseInt(page.name) + '.png';
    } else {
        var staticFilePng = '/thumbnails/page_' + '.png';
    }
    var filename = GetNameWithoutExtension(myDoc);
    var staticFilePdf = alternateLayout.replace(/ /g, "_") + '/thumbnails/' + filename + '.pdf';
    var block = {
        'id': block_name,
        'type': 'image',
        'width': width,
        'height': height,
        'left': 0,
        'top': 0,
        'subType': 'pdf',
        'ignoreOnRest': 0,
        'indesign': 1,
        'image_src': staticFilePng,
        'image_path': staticFilePdf,
        'cropX': 0,
        'cropY': 0,
        'cropW': 0,
        'cropH': 0
    }
    return block;
}

function calculatePositions(obj, myDoc, options) {
    var objectBounds = obj.geometricBounds;
    var x1, x2, y1, y2;
    x1 = objectBounds[1];
    y1 = objectBounds[0];
    x2 = objectBounds[3];
    y2 = objectBounds[2];
    if (options.showBleedMarks) {
        var bleedTop = myDoc.documentPreferences.documentBleedTopOffset;
        var bleedRight = myDoc.documentPreferences.documentBleedOutsideOrRightOffset;
        var bleedBottom = myDoc.documentPreferences.documentBleedBottomOffset;
        var bleedLeft = myDoc.documentPreferences.documentBleedInsideOrLeftOffset;
        x1 += bleedLeft;
        y1 += bleedBottom;
        x2 += bleedRight;
        y2 += bleedTop;
    }
    return Array(x1, y1, x2, y2);
}
// Converts from degrees to radians.
function radians(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
function degrees(radians) {
    return radians * 180 / Math.PI;
};

function createThumbnails(myDoc, thumbnailsFolder, thumbs, layout) {
    app.pngExportPreferences.pngExportRange = PNGExportRangeEnum.EXPORT_RANGE;
    app.pngExportPreferences.pageString = layout;
    if (options.useTransparency) {
        app.pngExportPreferences.transparentBackground = true;
    } else {
        app.pngExportPreferences.transparentBackground = false;
    }
    if (options.imageResolution) {
        app.pngExportPreferences.exportResolution = parseInt(options.imageResolution);
    }
    if (options.showBleedMarks) {
        app.pngExportPreferences.useDocumentBleeds = true;
    } else {
        app.pngExportPreferences.useDocumentBleeds = false;
    }
    if (thumbs) {
        enableAllLayers(myDoc);
        var thumbPath = thumbnailsFolder + "/thumb.png";
    } else {
        var thumbPath = thumbnailsFolder + "/page_.png";
        app.pngExportPreferences.transparentBackground = false;
    }
    // for (var s=0; s < myDoc.sections.length;s++){
    //  var section = myDoc.sections[s];
    //  var sectionLayout = section.alternateLayout;
    //   if(layout == sectionLayout ){
    //section.continueNumbering = false;
    // var pageStart = section.pageNumberStart;
    //  var noPages = section.alternateLayoutLength;
    // for (var p = pageStart; p<=noPages; p++ ){

    thumb = new File(thumbPath);
    try {
        myDoc.exportFile(ExportFormat.pngFormat, thumb, false);
    } catch (err) {
        WriteToFile("\r Unable to create thumbnail for page -- " + myCounter + ' for file ' + myDoc.name + " ---------------------\n");
    }
    //   }

    // }


    // }
    //  for (var myCounter = 0; myCounter < myDoc.pages.length; myCounter++) {
    // thumb = new File(thumbPath);
    try {
        myDoc.exportFile(ExportFormat.pngFormat, thumb, false);
    } catch (err) {
        WriteToFile("\r Unable to create thumbnail for page -- " + myCounter + ' for file ' + myDoc.name + " ---------------------\n");
    }
    //}
}

function exportStaticPdf(myDoc, myStaticFile, presets, thumbnailFolder, tempPreset, staticLayers, layout) {
    hideAllLayers(myDoc);
    for (var l = 0; l < myDoc.layers.length; l++) {
        var layerName = myDoc.layers[l].name;
        if (inArray(staticLayers, layerName)) {
            myDoc.layers[l].visible = true;
        }
    }
    try {
        myDoc.exportFile(ExportFormat.pdfType, myStaticFile, false, tempPreset);
        createThumbnails(myDoc, thumbnailFolder, false, layout);
    } catch (err) {
        WriteToFile("\r An error has occured when trying to create the static pdf " + err + "\n");
    }
}

function exportAdditionalPdf(myDoc, layer_index, folder, tempPreset, layerName) {
    enableAllLayers(myDoc);
    hideAllLayers(myDoc);
    myDoc.layers.item(layerName).visible = true;
    var myAdditionalPdfPath = folder + "/additional" + layer_index + ".pdf";
    var myAdditionalImagePath = folder + "/additional" + layer_index + ".png";
    var myAdditionalPdf = new File(myAdditionalPdfPath);
    var myAdditionalImage = new File(myAdditionalImagePath);
    // export additional layer as pdf (PDF/X-4 preset)
    try {
        myDoc.exportFile(ExportFormat.pdfType, myAdditionalPdf, false, tempPreset);
    } catch (err) {
        WriteToFile("\r An error has occured when trying to create the additional pdf " + err + "\n");
    }
    // export additional layer as png
    try {
        if (options.imageResolution) {
            app.pngExportPreferences.exportResolution = parseInt(options.imageResolution);
        }
        if (options.showBleedMarks) {
            app.pngExportPreferences.useDocumentBleeds = true;
        } else {
            app.pngExportPreferences.useDocumentBleeds = false;
        }
        if (options.useTransparency) {
            app.pngExportPreferences.transparentBackground = true;
        } else {
            app.pngExportPreferences.transparentBackground = false;
        }
        myDoc.exportFile(ExportFormat.pngFormat, myAdditionalImage, false);
    } catch (err) {
        WriteToFile("\r An error has occured when trying to create the additional images " + err + "\n");
    }
}

function enableAllLayers(myDoc) {
    for (i = 0; i < myDoc.layers.length; i++) {
        var currentLayer = myDoc.layers[i];
        currentLayer.visible = true;
    }
}

function hideAllLayers(myDoc) {
    for (i = 0; i < myDoc.layers.length; i++) {
        var currentLayer = myDoc.layers[i];
        currentLayer.visible = false;
    }
}

function updateLinks(myDoc) {
    var links = myDoc.links;
    var newPathLinks = myDoc.filePath + "/Links/";
    if (Folder(newPathLinks).exists) {
        for (var link_index = 0; link_index < links.length; link_index++) {
            var current_link = links[link_index];
            var newFile = new File(newPathLinks + current_link.name);
            if (newFile.exists) {
                current_link.relink(newFile);
                current_link.update();
            } else {
                WriteToFile("\r Unable to relink file -- " + current_link.name + " for " + myDoc.name + "\n");
            }
        }
    } else {
        WriteToFile("\r Links were not updated!! The Links folder does not exist for the file " + myDoc.name + "\n");
    }
}

function GetNameWithoutExtension(myFile) {
    var myFileName = myFile.name;
    var myIndex = myFileName.lastIndexOf(".");
    if (myIndex > -1) {
        myFileName = myFileName.substr(0, myIndex);
    }
    return myFileName;
}

function createPackage(myDoc, destination_folder) {
    for (i = 0; i < myDoc.layers.length; i++) {
        var currentLayer = myDoc.layers[i];
        if (currentLayer.name.indexOf("dynamic") == -1) {
            //currentLayer.remove();
        }
    }
    try {
        myDoc.packageForPrint(destination_folder, true, true, true, true, true, true, true, true);

    } catch (err) {
        WriteToFile("\r Unable to package-- " + myDoc.name + " ---------------------\n");
    }
}

function WriteToFile(myText) {
    if (options.writeErrors) {
        var reportFolder = Folder(options.output);
        myFile = new File(reportFolder + "/Package Report.txt");
        if (myFile.exists) {
            myFile.open("e");
            myFile.seek(0, 2);
        } else {
            myFile.open("w");
        }
        myFile.write(myText);
        myFile.close();
    }
}

function writeJson(jsonData, location, file_name) {
    if (typeof(file_name) == "undefined") {
        file_name = 'data.json';
    }
    myFile = new File(location + "/" + file_name);
    myFile.encoding = "UTF-8";
    if (myFile.exists) {
        myFile.open("e");
        myFile.seek(0, 2);
    } else {
        myFile.open("w");
    }
    myFile.write(jsonData);
    myFile.close();
}

function writeSvg ( svg, location, file_name ) {
    myFile = new File( location + "/" + file_name );
    myFile.encoding = "UTF-8";
    if ( myFile.exists ) {
        myFile.open( "e" );
        myFile.seek( 0, 2 );
    }
    else {
        myFile.open( "w" );
    }
    myFile.write( svg );
    myFile.close();
}


function GetDate() {
    var myDate = new Date();
    return myDate.toLocaleString();
}

function copyFolder(sourceFolder, destinationFolder) {
    if (sourceFolder instanceof Folder) {
        var sourceChildrenArr = sourceFolder.getFiles();
        for (var i = 0; i < sourceChildrenArr.length; i++) {
            var sourceChild = sourceChildrenArr[i];
            var destinationChildStr = destinationFolder.fsName + "/" + sourceChild.name;
            if (sourceChild instanceof File) {
                copyFile(sourceChild, new File(destinationChildStr));
            } else {
                copyFolder(sourceChild, new Folder(destinationChildStr));
            }
        }
    }
}


function copyFile(sourceFile, destinationFile) {
    createFolder(destinationFile.parent);
    sourceFile.copy(destinationFile);
}

function createFolder(folder) {
    if (folder.parent !== null && !folder.parent.exists) {
        createFolder(folder.parent);
    }
    folder.create();
}

function getPreflightErrors() {
    try {
        var doc = app.activeDocument;
        for (i = 0; i < doc.layers.length; i++) {
            var currentLayer = doc.layers[i];
            if (i == 0) {
                currentLayer.name = 'static';
            } else if (i % 2 !== 0) {
                currentLayer.name = 'dynamic' + (i - 1);
            } else {
                currentLayer.name = 'additional' + (i - 1);
            }
        }
        return;
        var docPages = doc.pages;
        var errorsByPage = {};
        var onPageObjects = [];
        errorsByPage['fatal'] = [];
        errorsByPage['fatal'] = getFontError(doc);
        if (doc.documentPreferences.facingPages) {
            errorsByPage['fatal'].push({
                'type': 'error',
                'msg': 'Facing Pages are not supported.'
            });
        }
        var layers = doc.layers;
        var dynamicLayers = [];
        for (var l = 0; l <= layers.length; l++) {
            var layer = layers[l];
            if (layer.isValid && layer.name.indexOf('dynamic') !== -1) {
                var dname = layer.name;
                dynamicLayers.push(dname);
            }
        }
        for (var l = 0; l <= layers.length; l++) {
            var layer = layers[l];
            if (layer.isValid && layer.name.indexOf('additional') !== -1) {
                var dname = layer.name;
                if (!dynamicLayerExists(doc, dname)) {
                    errorsByPage['fatal'].push({
                        'type': 'error',
                        'msg': 'Dynamic layer ' + dname.replace('additional', 'dynamic') + ' is missing'
                    });
                }
            }
        }
        if (dynamicLayers.length == 0) {
            errorsByPage['fatal'].push({
                'type': 'error',
                'msg': 'No dynamic layers found in document.'
            })
        }
        for (var i = 0; i < docPages.length; i++) {
            errorsByPage['page_' + i] = [];
            var pageObjects = docPages[i].allPageItems;
            var polygonObjects = 0;
            var ovalObjects = 0;
            var groupObjects = 0;
            var unsupportedTypes = 0;
            var currentPage = docPages[i];
            var pageRotationAngle = GetSpreadRotation(currentPage);
            if (pageRotationAngle != 0) {
                errorsByPage['page_' + i].push({
                    'type': 'error',
                    'msg': 'Page ' + parseInt(currentPage.index + 1) + ' is rotated with: ' + pageRotationAngle
                });
            }
            for (var o = 0; o < pageObjects.length; o++) {
                var obj = pageObjects[o];
                onPageObjects.push(obj.id);
                var objLayer = obj.itemLayer;
                if (objLayer.name.indexOf("dynamic") != -1) {
                    if (obj instanceof Polygon) {
                        polygonObjects++;
                    } else if (obj instanceof Oval) {
                        ovalObjects++;
                    } else if (obj instanceof Rectangle) {
                        errorsByPage['page_' + i] = getRectangleErrors(obj, errorsByPage['page_' + i]);
                    } else if (obj instanceof TextFrame) {
                        errorsByPage['page_' + i] = getTextFrameErrors(obj, errorsByPage['page_' + i]);
                    } else if (obj instanceof Image) {} else {
                        if (obj instanceof Group) {
                            groupObjects++;
                        } else {
                            unsupportedTypes++;
                        }
                    }
                }
            }
            if (groupObjects > 0) {
                if (groupObjects == 1) {
                    var gMsg = '1 group found.';
                } else {
                    var gMsg = groupObjects + 'groups  found. ';
                }
                errorsByPage['page_' + i].push({
                    'type': 'error',
                    'msg': gMsg
                });
            }
            if (polygonObjects > 0) {
                if (polygonObjects == 1) {
                    var pMsg = '1 polygon object  found.';
                } else {
                    var pMsg = polygonObjects + ' polygon objects found. ';
                }
                errorsByPage['page_' + i].push({
                    'type': 'error',
                    'msg': pMsg
                });
            }
            if (ovalObjects > 0) {
                if (ovalObjects == 1) {
                    var oMsg = '1 oval object  found.';
                } else {
                    var oMsg = ovalObjects + ' oval objects found. ';
                }
                errorsByPage['page_' + i].push({
                    'type': 'error',
                    'msg': oMsg
                });
            }
            if (unsupportedTypes > 0) {
                if (unsupportedTypes == 1) {
                    var uMsg = '1 unsupported object  found.';
                } else {
                    var uMsg = unsupportedTypes + '  unsupported objects found. ';
                }
                errorsByPage['page_' + i].push({
                    'type': 'error',
                    'msg': uMsg
                });
            }
        }
        var allObjects = doc.allPageItems;
        var outsideObjects = 0;
        for (var so = 0; so < allObjects.length; so++) {
            var spreadObj = allObjects[so];
            if (spreadObj.isValid) {
                if (!inArray(onPageObjects, spreadObj.id)) {
                    var spreadObjjLayer = spreadObj.itemLayer;
                    if (spreadObjjLayer.name.indexOf("dynamic") != -1) {
                        outsideObjects++;
                    }
                }
            }
        }
        if (outsideObjects > 0) {
            if (outsideObjects == 1) {
                errorsByPage['fatal'].push({
                    'type': 'error',
                    'msg': outsideObjects + ' object  found outside the page.'
                });
            } else {
                errorsByPage['fatal'].push({
                    'type': 'error',
                    'msg': outsideObjects + ' objects  found outside the page.'
                });
            }
        }
        return errorsByPage;
    } catch (err) {}
}

function additionalExists(doc, dynamicLayer) {
    var layers = doc.layers;
    for (var l = 0; l <= layers.length; l++) {
        var layer = layers[l];
        if (layer.isValid && layer.name == dynamicLayer.replace("dynamic", "additional")) {
            return true;
        }
    }
    return false;
}

function dynamicLayerExists(doc, additionalLayer) {
    var layers = doc.layers;
    for (var l = 0; l <= layers.length; l++) {
        var layer = layers[l];
        if (layer.isValid && layer.name == additionalLayer.replace("additional", "dynamic")) {
            return true;
        }
    }
    return false;
}

function preflightDocument(list) {
    var errorsByPage = getPreflightErrors();
    var string = [];
    for (var pageKey in errorsByPage) {
        if (pageKey.indexOf('fatal') !== -1) {
            var errorsPage = errorsByPage[pageKey];
            for (var errorKey in errorsPage) {
                var errorObj = errorsPage[errorKey];
                var errType = errorObj.type;
                var errMsg = errorObj.msg;
                string.push(errType.toUpperCase() + ',' + errMsg + ',' + 'Document');
            }
        } else {
            var errorsPage = errorsByPage[pageKey];
            for (var errorKey in errorsPage) {
                var errorObj = errorsPage[errorKey];
                var errType = errorObj.type;
                var errMsg = errorObj.msg;
                var pag = pageKey.split('_');
                var pagNo = parseInt(pag[1]) + 1;
                string.push(errType.toUpperCase() + ',' + errMsg + ',' + 'Page ' + pagNo);
            }
        }
    }

    var i, j, list_item, parts;
    list.removeAll();
    if (string.length) {
        for (i = 0; i < string.length; i++) {
            parts = string[i].split(',');
            list_item = list.add('item', parts[0]);
            for (j = 1; j < parts.length; j++) {
                list_item.subItems[j - 1].text = parts[j];
            }
        }
    } else {
        list.add('item', 'No errors found');
    }
}

function getTextFrameErrors(obj, errors) {
    var fontsUsedInFrame = [];
    var hasKerning = 0;
    var hasTextStroke = 0;
    var fontSizes = [];
    var horizonatalAlignements = [];
    var pColors = [];
    var colorsUsed = [];
    var allowedParagraphStyles = ['[Basic Paragraph]', '[No Paragraph Style]', '[Einf. Abs.]'];
    if (typeof(obj.contents != "undefined")) {
        var str = obj.contents;
        if (str.indexOf('\t') !== -1) {
            errors.push({
                'type': 'error',
                'msg': 'You have tabs in you content.'
            });
        }
    }
    if (typeof(obj.textWrapPreferences.textWrapMode) != "undefined" && obj.textWrapPreferences.textWrapMode !== TextWrapModes.NONE) {
        errors.push({
            'type': 'error',
            'msg': 'Text wrap used on text frame'
        });
    }
    if (typeof(obj.textFramePreferences.textColumnCount) != "undefined" && obj.textFramePreferences.textColumnCount > 1) {
        errors.push({
            'type': 'error',
            'msg': 'Columns found inside text frame'
        });
    }
    for (var p = 0; p <= obj.paragraphs.length; p++) {
        var pr = obj.paragraphs[p];
        if (pr.isValid) {
            if (!inArray(allowedParagraphStyles, pr.appliedParagraphStyle.name.toString())) {
                errors.push({
                    'type': 'error',
                    'msg': 'Paragraph styles used in text frame.'
                });
            }
            if (pr.textStyleRanges.length) {
                for (var t = 0; t <= pr.textStyleRanges.length; t++) {
                    var ts = pr.textStyleRanges[t];
                    if (ts.isValid) {
                        if (typeof(ts.appliedFont) == 'object' && ts.appliedFont instanceof Font) {
                            if (!inArray(fontsUsedInFrame, ts.appliedFont.name)) {
                                fontsUsedInFrame.push(ts.appliedFont.name);
                            }
                        } else if (typeof ts.appliedFont == 'string') {
                            if (fontsUsedInFrame.join(",").indexOf(ts.appliedFont) == -1) {
                                fontsUsedInFrame.push(ts.appliedFont);
                            }
                        }
                        if (ts.justification) {
                            if (horizonatalAlignements.join(",").indexOf(ts.justification) == -1) {
                                horizonatalAlignements.push(ts.justification);
                            }
                        }
                        if (typeof(ts.kerningMethod) != 'undefined' && ts.kerningMethod == 'Manual') {
                            hasKerning++;
                        }
                        if (typeof(ts.strokeColor) != 'undefined' && ts.strokeColor instanceof Color) {
                            hasTextStroke++;
                        }
                        if (typeof(ts.pointSize) != "undefined") {
                            if (!inArray(fontSizes, ts.pointSize)) {
                                fontSizes.push(ts.pointSize);
                            }
                        }
                        if (typeof(ts.fillColor) !== "undefined" && ts.fillColor.isValid) {
                            if (!inArray(pColors, ts.fillColor.name)) {
                                pColors.push(ts.fillColor.name);
                                colorsUsed.push({
                                    'name': ts.fillColor.name,
                                    'space': ts.fillColor.space
                                });
                            }
                        }
                    }
                }
            }
            if (typeof(pr.strokeColor) != 'undefined' && pr.strokeColor instanceof Color) {
                hasTextStroke++;
            }

            if (pr.fillColor instanceof Color && typeof(pr.fillColor) !== "undefined" && pr.fillColor.isValid) {
                if (!inArray(pColors, pr.fillColor.name)) {
                    pColors.push(pr.fillColor.name);
                    colorsUsed.push({
                        'name': ts.fillColor.name,
                        'space': ts.fillColor.space
                    });
                }
            }
            if (!inArray(horizonatalAlignements, pr.justification)) {
                horizonatalAlignements.push(pr.justification);
            }
            if (typeof(pr.pointSize) != "undefined") {
                if (!inArray(fontSizes, pr.pointSize)) {
                    fontSizes.push(pr.pointSize);
                }
            }
            if (typeof(pr.appliedFont) == 'object' && pr.appliedFont instanceof Font) {
                var fontUsed = pr.appliedFont.name;
            } else if (typeof pr.appliedFont == 'string') {
                var fontUsed = pr.appliedFont;
            }
            if (!inArray(fontsUsedInFrame, fontUsed)) {
                fontsUsedInFrame.push(fontUsed);
            }
        }
    }
    if (pColors.length > 1) {
        errors.push({
            'type': 'error',
            'msg': 'Multiple colors found in text frame.'
        });
    } else if (pColors.length == 1) {
        for (var c = 0; c <= colorsUsed.length; c++) {
            var colorU = colorsUsed[c];
            if (typeof colorU == 'object' && typeof(colorU.space) != 'undefined' && colorU.space.toString() == 'LAB') {
                errors.push({
                    'type': 'error',
                    'msg': 'LAB space color used in text frame.'
                });
            }
        }
    }
    var borderType = obj.strokeType;
    if (borderType.name.toString() !== 'Solid' && borderType.name.toString() !== 'Durchgezogen') {
        errors.push({
            'type': 'error',
            'msg': borderType.name.toString() + ' border type is not supported.'
        });
    }
    var borderWeight = obj.strokeWeight;
    if (obj.strokeWeight > 10) {
        errors.push({
            'type': 'error',
            'msg': 'Border weigth is bigger than the supported 10 pt value: ' + borderWeight
        });
    }
    if (obj.hasOwnProperty('textFramePreferences')) {
        var allowedVerticalAlignements = ['CENTER_ALIGN', 'TOP_ALIGN', 'BOTTOM_ALIGN'];
        if (!inArray(allowedVerticalAlignements, obj.textFramePreferences.verticalJustification.toString())) {
            errors.push({
                'type': 'error',
                'msg': 'Vertical alignement ' + obj.textFramePreferences.verticalJustification.toString() + ' not supported.'
            });
        }
    }
    var borderColor = obj.strokeColor;
    if (borderColor instanceof Color && borderColor.space.toString() == "LAB") {
        errors.push({
            'type': 'error',
            'msg': 'LAB space color used as border color.'
        });
    }
    var frameColor = obj.fillColor;
    if (frameColor instanceof Color && frameColor.space.toString() == "LAB") {
        errors.push({
            'type': 'error',
            'msg': 'LAB space color used as background color.'
        });
    }
    var scaleRecY = obj.absoluteVerticalScale;
    var scaleRecX = obj.absoluteHorizontalScale;
    if (scaleRecX < 0) {
        errors.push({
            'type': 'error',
            'msg': 'Text frame has a negative horizontal scale of ' + scaleRecX + '.'
        });
    }
    if (scaleRecY < 0) {
        errors.push({
            'type': 'error',
            'msg': 'Text frame has a negative vertical scale of ' + scaleRecY + '.'
        });
    }
    if (obj.shearAngle != 0) {
        errors.push({
            'type': 'error',
            'msg': 'Text frame ' + obj.id + ' is skewed'
        });
    }
    if (obj.overflows) {
        errors.push({
            'type': 'error',
            'msg': 'Overset text found  in text frame.'
        });
    }
    if (obj.rectangles.length > 0 || obj.ovals.length > 0 || obj.polygons.length) {
        errors.push({
            'type': 'error',
            'msg': 'Objects used in text frame.'
        });
    }
    if (typeof(obj.textColumns) != "undefined" && obj.textColumns.length > 1) {
        errors.push({
            'type': 'error',
            'msg': 'Columns used in textframe.'
        });
    }
    if (hasKerning >= 1) {
        errors.push({
            'type': 'error',
            'msg': 'Kerning used in text frame.'
        });
    }
    if (hasTextStroke >= 1) {
        errors.push({
            'type': 'error',
            'msg': 'Stroked text  in text frame.'
        });
    }
    if (fontSizes.length > 1) {
        errors.push({
            'type': 'error',
            'msg': 'Multiple font sizes applied in text frame .'
        });
    }
    if (fontsUsedInFrame.length > 1) {
        errors.push({
            'type': 'error',
            'msg': fontsUsedInFrame.length + ' fonts used in text frame. '
        });
    }
    if (horizonatalAlignements.length > 1) {
        errors.push({
            'type': 'error',
            'msg': 'Multiple horizontal alignements used in text frame.'
        });
    } else if (horizonatalAlignements.length == 1) {
        var currentAlignement = horizonatalAlignements[0];
        var allowedAlignements = ['CENTER_ALIGN', 'LEFT_ALIGN', 'RIGHT_ALIGN'];
        if (!inArray(allowedAlignements, currentAlignement.toString())) {
            errors.push({
                'type': 'error',
                'msg': currentAlignement.toString() + ' alignement is not supported.'
            });
        }
    }
    return errors;
}

function getRectangleErrors(obj, errors) {
    var frameColor = obj.fillColor;
    if (frameColor instanceof Color && frameColor.space.toString() == "LAB") {
        errors.push({
            'type': 'error',
            'msg': 'LAB space color used as background color for  rectangle '
        });
    }
    var borderColor = obj.strokeColor;
    if (borderColor instanceof Color && borderColor.space.toString() == "LAB") {
        errors.push({
            'type': 'error',
            'msg': 'LAB space color used as border color for  rectangle '
        });
    }
    var borderType = obj.strokeType;
    if (borderType.name.toString() !== 'Solid' && borderType.name.toString() !== 'Durchgezogen' || ((borderType.name.toString() == 'Solid' || borderType.name.toString() == 'Durchgezogen') && obj.strokeWeight > 0)) {
        errors.push({
            'type': 'error',
            'msg': 'Border is not supported for image blocks'
        });
    }
    var borderWeight = obj.strokeWeight;
    if (obj.strokeWeight > 10) {
        errors.push({
            'type': 'error',
            'msg': 'Border weigth is bigger than the supported 10 pt value: ' + borderWeight
        });
    }
    var scaleRecY = obj.absoluteVerticalScale;
    var scaleRecX = obj.absoluteHorizontalScale;
    if (scaleRecX < 0) {
        errors.push({
            'type': 'error',
            'msg': 'Rectangle has a negative horizontal scale of ' + scaleRecX + '.'
        });
    }
    if (scaleRecY < 0) {
        errors.push({
            'type': 'error',
            'msg': 'Rectangle has a negative vertical scale of ' + scaleRecY + '.'
        });
    }
    if (typeof(obj.textWrapPreferences.textWrapMode) != "undefined" && obj.textWrapPreferences.textWrapMode !== TextWrapModes.NONE) {
        errors.push({
            'type': 'error',
            'msg': 'Text wrapped used on rectangle'
        });
    }
    if (obj.graphics.length == 0) {
        errors.push({
            'type': 'error',
            'msg': 'Rectangle without image found.'
        });
    } else if (typeof obj.graphics[0] !== "undefined") {
        if (obj.graphics[0].itemLink.parent instanceof Image == false) {
            errors.push({
                'type': 'error',
                'msg': 'Only Image graphic type allowed in a rectangle.'
            });
        } else {
            if (obj.graphics[0].itemLink.parent.absoluteRotationAngle !== 0) {
                errors.push({
                    'type': 'error',
                    'msg': 'Image is rotated inside the rectangle.'
                });
            }
            if (obj.frameFittingOptions.rightCrop !== 0 || obj.frameFittingOptions.leftCrop !== 0 || obj.frameFittingOptions.bottomCrop !== 0 || obj.frameFittingOptions.topCrop !== 0) {
                errors.push({
                    'type': 'error',
                    'msg': 'Resized image found inside rectangle.'
                });
            }
            if (obj.frameFittingOptions.fittingOnEmptyFrame !== EmptyFrameFittingOptions.FILL_PROPORTIONALLY) {
                var fitType = '';
                if (obj.frameFittingOptions.fittingOnEmptyFrame == "1668575078") {
                    fitType = "Content To Frame";
                } else if (obj.frameFittingOptions.fittingOnEmptyFrame == "1852796517") {
                    fitType = "None";
                } else if (obj.frameFittingOptions.fittingOnEmptyFrame == "1668247152") {
                    fitType = "Fit Content Proportionally";
                }
                errors.push({
                    'type': 'error',
                    'msg': 'Fitting ' + fitType + ' not supported'
                });
            }
            var scaleImgY = obj.graphics[0].itemLink.parent.absoluteVerticalScale;
            var scaleImgX = obj.graphics[0].itemLink.parent.absoluteHorizontalScale;
            if (scaleImgX < 0) {
                errors.push({
                    'type': 'error',
                    'msg': 'Image has a negative horizontal scale of ' + scaleImgX + '.'
                });
            }
            if (scaleImgY < 0) {
                errors.push({
                    'type': 'error',
                    'msg': 'Image has a negative vertical scale of ' + scaleImgY + '.'
                });
            }
            if (obj.graphics[0].itemLink.parent.shearAngle !== 0 || obj.graphics[0].itemLink.parent.parent.shearAngle !== 0) {
                errors.push({
                    'type': 'error',
                    'msg': 'Image or parent rectangle is skewed'
                });
            }

        }
    }
    return errors;
}

function inArray(array, value) {
    if (array.length) {
        for (var i = 0; i <= array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }
}

function getFontError(doc) {
    var otf = 0;
    var notInstalled = [];
    var errors = [];
    if (doc.fonts.length) {
        var fonts = doc.fonts;
        for (var i = 0; i <= fonts.length; fonts++) {
            var font = fonts[i];
            if (font.status.toString() != "INSTALLED") {
                notInstalled.push(font.name);
            } else {
                if (font.fontType.toString() == 'OPENTYPE_CFF') {
                    otf++;
                }
            }
        }
        if (notInstalled.length) {
            errors.push({
                'type': 'warning',
                'msg': 'Folowing fonts are not installed: ' + notInstalled.join(', ')
            });
        }
    }
    if (otf > 0) {
        if (otf == 1) {
            errors.push({
                'type': 'error',
                'msg': otf + ' otf font used in document'
            });
        } else {
            errors.push({
                'type': 'error',
                'msg': otf + ' otf fonts used in document'
            });
        }

    }
    return errors;
}

function GetSpreadRotation(pageOrSpread) {
    var doc = pageOrSpread.parent;
    if (pageOrSpread instanceof Page) {
        doc = doc.parent
    }

    var origRulerOrigin = doc.viewPreferences.rulerOrigin;
    var origZP = doc.zeroPoint;
    var page = pageOrSpread;
    if (!(page instanceof Page)) {
        page = pageOrSpread.pages[0];
    }
    var pageBounds = page.bounds;
    var retAngle = 0;
    if (pageBounds[0] == 0 && pageBounds[1] == 0) {
        retAngle = 0;
    } else if (pageBounds[0] == 0 && pageBounds[3] == 0) {
        retAngle = 90;
    } else if (pageBounds[2] == 0 && pageBounds[3] == 0) {
        retAngle = 180;
    } else if (pageBounds[1] == 0 && pageBounds[2] == 0) {
        retAngle = 270;
    }
    return retAngle;
}