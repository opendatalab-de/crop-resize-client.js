var fs = require('fs'), gm = require('gm'), path = require('path');
var argv = require('optimist').usage('Crop and resize images as defined in an json-file\nUsage: $0 [jsonfile]').describe('o',
		'output path (with trailing slash). Default: path of jsonfile').describe('i', 'ignore too small images').demand(1).argv;

var outputPath = argv.o ? argv.o : path.dirname(argv._[0]);
var inputPath = path.dirname(argv._[0]);
var input = JSON.parse(fs.readFileSync(argv._[0], {
	encoding: 'UTF-8'
}));

var Image = function(def, size, imgPath, targetSizes, outputPath) {
	var cropX = def.cropAreaX1 / 100 * size.width;
	var cropY = def.cropAreaY1 / 100 * size.height;
	var cropWidth = (def.cropAreaX2 / 100 * size.width) - cropX;
	var cropHeight = (def.cropAreaY2 / 100 * size.height) - cropY;
	var destName = def.name && def.name.length > 0 ? def.name + '.jpg' : def.source;

	var isTooSmall = function() {
		var tooSmall = false;
		targetSizes.forEach(function(targetSize) {
			if (targetSize.width > cropWidth) {
				tooSmall = true;
			}
		});
		return tooSmall;
	};

	var cropAndResizeTo = function(targetSize) {
		var dest = outputPath + path.sep + targetSize.name + path.sep + destName;

		gm(imgPath).profile('sRGB.icc').crop(cropWidth, cropHeight, cropX, cropY).resize(targetSize.width).quality(80).noProfile().write(dest, function(err) {
			if (!err) {
				console.log(dest + ' written');
			} else {
				console.error('error converting ' + destName);
			}
		});
	};

	this.cropAndResize = function() {
		if (!argv.i && isTooSmall(cropWidth)) {
			console.warn(destName + ' is too small');
		} else {
			targetSizes.forEach(function(targetSize) {
				cropAndResizeTo(targetSize);
			});
		}
	};
};

try {
	input.targetSizes.forEach(function(targetSize) {
		fs.mkdirSync(outputPath + path.sep + targetSize.name);
	});
} catch (e) {
	if (e.code !== 'EEXIST') {
		console.log(e);
	}
}

input.images.forEach(function(imgDef) {
	var imgPath = inputPath + path.sep + imgDef.source;

	gm(imgPath).size(function(err, imgSize) {
		if (!err) {
			var image = new Image(imgDef, imgSize, imgPath, input.targetSizes, outputPath);
			image.cropAndResize();
		}
	});
});