/* 
group 1 - Walls
N-Wall
S-Wall
E-Wall
W-Wall

group 2 - Doors
N-Door
S-Door
E-Door
W-Door

group 3 - Open

N-Open
S-Open
E-Open
W-Open
 */

/* 
0000
0001
0002
0010
0011
0012
0020
0021
0022
0100
0101
0102
0110
0111
0112
0120
0121
0122
0200
0201
0202
0210
0211
0212
0220
0221
0222 
*/

var tiles = [ 
    'oooo',
    'ooow',
    'oood',
    'oowo',
    'ooww',
    'oowd',
    'oodo',
    'oodw',
    'oodd',
    'owoo',
    'owow',
    'owod',
    'owwo',
    'owww',
    'owwd',
    'owdo',
    'owdw',
    'owdd',
    'odoo',
    'odow',
    'odod',
    'odwo',
    'odww',
    'odwd',
    'oddo',
    'oddw',
    'oddd',
    'wooo',
    'woow',
    'wood',
    'wowo',
    'woww',
    'wowd',
    'wodo',
    'wodw',
    'wodd',
    'wwoo',
    'wwow',
    'wwod',
    'wwwo',
    'wwww',
    'wwwd',
    'wwdo',
    'wwdw',
    'wwdd',
    'wdoo',
    'wdow',
    'wdod',
    'wdwo',
    'wdww',
    'wdwd',
    'wddo',
    'wddw',
    'wddd',
    'dooo',
    'doow',
    'dood',
    'dowo',
    'doww',
    'dowd',
    'dodo',
    'dodw',
    'dodd',
    'dwoo',
    'dwow',
    'dwod',
    'dwwo',
    'dwww',
    'dwwd',
    'dwdo',
    'dwdw',
    'dwdd',
    'ddoo',
    'ddow',
    'ddod',
    'ddwo',
    'ddww',
    'ddwd',
    'dddo',
    'dddw',
    'dddd' 
]


// Get the destination to save the files

destFolder = Folder.selectDialog("Select the folder where you want to save the converted PNG files.", "~");

var tile;
var tileDoc = app.activeDocument;

var paths = app.activeDocument.pathItems;

var sides = ["N", "E", "S", "W"];

illustratorDo(tiles);

// alert("Files are saved as PNG in " + destFolder);

function illustratorDo(tiles) {
    for(var i = 0; i<tiles.length; i++) {
        //! Reset all layers to off
        for (var p = 0; p < paths.length; p++) {
            if (paths[p].locked != true) {
                paths[p].hidden = true;
            }
        }
        tile = tiles[i];        
        //! CODE to turn off/on layers
        //! Create tileDoc
        for(var s = 0; s < tile.length; s++ ) {
            if (tile[s] === "d") {
                for (var p = 0; p < paths.length; p++) {
                    if (paths[p].name[0] === sides[s] && paths[p].name[2] === "D") {
                        paths[p].hidden = false;
                    }
				}

            } else if (tile[s] === "w") {
                for (var p = 0; p < paths.length; p++) {
                    if (paths[p].name[0] === sides[s] && paths[p].name[2] === "W") {
                        paths[p].hidden = false;
                    }
                }
            }
        }
        // Call function getNewName to get the name and file to save the pdf
        var targetFile = getNewName(tile);
        
        var pngExportOpts = getPNGOptions();
        // Call function getPNGOptions get the PNGExportOptions for the files
        // Export as PNG
        tileDoc.exportFile(targetFile, ExportType.PNG24, pngExportOpts);
    }


	/*********************************************************

    getNewName: Function to get the new file name. The primary
    name is the same as the source file.

    **********************************************************/

	function getNewName(tile) {
		var ext, docName, newName, saveInFile, docName;
		ext = ".png";
		tile += ext;

		// Create a file object to save the png
		saveInFile = new File(destFolder + "/" + tile);

		return saveInFile;
	}

	/*********************************************************

    getPNGOptions: Function to set the PNG saving options of the
    files using the PDFSaveOptions object.

    **********************************************************/

	function getPNGOptions() {
		// Create the PDFSaveOptions object to set the PDF options
		var pngExportOpts = new ExportOptionsPNG24();

		// Setting PNGExportOptions properties. Please see the JavaScript Reference
		// for a description of these properties.
		// Add more properties here if you like
		pngExportOpts.antiAliasing = true;
		pngExportOpts.artBoardClipping = false;
		// pngExportOpts.horizontalScale = 100.0;
		//pngExportOpts.matte = true;
		//pngExportOpts.matteColor = 0, 0, 0;
		pngExportOpts.saveAsHTML = false;
		pngExportOpts.transparency = true;
		// pngExportOpts.verticalScale = 100.0;

		return pngExportOpts;
	}
}
