var fs = require('fs'), gm = require('gm'), path = require('path');
var argv = require('optimist').usage('Crop and resize images as defined in an json-file\nUsage: $0 [jsonfile]').describe('o',
		'output path (with trailing slash). Default: path of jsonfile').describe('i', 'ignore too small images').demand(1).argv;

var outputPath = argv.o ? argv.o : path.dirname(argv._[0]);
var inputPath = path.dirname(argv._[0]);
var input = JSON.parse(fs.readFileSync(argv._[0], {
	encoding: 'UTF-8'
}));

var cropAndResize = function(img, currentSize, imgPath) {
	var cropX = img.cropAreaX1 / 100 * currentSize.width;
	var cropY = img.cropAreaY1 / 100 * currentSize.height;
	var cropWidth = (img.cropAreaX2 / 100 * currentSize.width) - cropX;
	var cropHeight = (img.cropAreaY2 / 100 * currentSize.height) - cropY;
	var destName = img.name && img.name.length > 0 ? img.name + '.jpg' : img.source;

	var imgToSmall = false;
	if (!argv.i) {
		input.targetSizes.forEach(function(targetSize) {
			if (targetSize.width > cropWidth) {
				imgToSmall = true;
			}
		});
	}

	if (imgToSmall) {
		console.warn(destName + ' is too small');
	} else {
		input.targetSizes.forEach(function(targetSize) {
			var dest = outputPath + path.sep + targetSize.name + path.sep + destName;

			gm(imgPath).profile('sRGB.icc').crop(cropWidth, cropHeight, cropX, cropY).resize(targetSize.width).quality(80).noProfile().write(dest,
					function(err) {
						if (!err) {
							console.log(dest + ' written');
						} else {
							console.error('error converting ' + destName);
						}
					});
		});
	}
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

input.images.forEach(function(img) {
	var imgPath = inputPath + path.sep + img.source;

	gm(imgPath).size(function(err, value) {
		if (!err) {
			cropAndResize(img, value, imgPath);
		}
	});
});