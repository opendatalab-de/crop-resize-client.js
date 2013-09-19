var fs = require('fs'), gm = require('gm');

if (process.argv.length < 3) {
	process.exit(1);
}
var inputPath = process.argv[2];
var outputPath = process.argv.length >= 4 ? process.argv[3] : inputPath;

var readFileOptions = {
	encoding: 'UTF-8'
};
var input = JSON.parse(fs.readFileSync(inputPath + 'images.json', readFileOptions));
var targetSizes = JSON.parse(fs.readFileSync(inputPath + 'targetSizes.json', readFileOptions));

try {
	targetSizes.forEach(function(targetSize) {
		fs.mkdirSync(outputPath + targetSize.name);
	});
} catch (e) {
	if (e.code !== 'EEXIST') {
		console.log(e);
	}
}

var cropAndResize = function(img, currentSize, imgPath) {
	var cropX = img.cropAreaX1 / 100 * currentSize.width;
	var cropY = img.cropAreaY1 / 100 * currentSize.height;
	var cropWidth = (img.cropAreaX2 / 100 * currentSize.width) - cropX;
	var cropHeight = (img.cropAreaY2 / 100 * currentSize.height) - cropY;

	targetSizes.forEach(function(targetSize) {
		var dest = outputPath + targetSize.name + '/' + img.name + '.jpg';

		gm(imgPath).profile('sRGB.icc').crop(cropWidth, cropHeight, cropX, cropY).resize(targetSize.width).quality(80).noProfile().write(dest, function(err) {
			if (!err) {
				console.log(img.name + '.jpg ' + targetSize.name + ' written');
			} else {
				console.error('error converting ' + img.name);
			}
		});
	});
};

input.images.forEach(function(img) {
	var imgPath = inputPath + img.source;

	gm(imgPath).size(function(err, value) {
		if (!err) {
			cropAndResize(img, value, imgPath);
		}
	});
});
