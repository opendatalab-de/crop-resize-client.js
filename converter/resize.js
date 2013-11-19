var fs = require('fs'), gm = require('gm'), path = require('path'), async = require('async');
var argv = require('optimist').usage('Resize images inside a folder\nUsage: $0 [path]').describe('o', 'output path (with trailing slash). Default: inputPath')
		.demand(1).argv;

var targetSizes = [{
	name: 'preview',
	width: 1200
}];
var outputPath = argv.o ? argv.o : argv._[0];
var inputPath = argv._[0];

var Image = function(imgName, size, imgPath, targetSizes, outputPath) {
	var destName = imgName;

	var cropAndResizeTo = function(targetSize, callback) {
		var dest = outputPath + path.sep + targetSize.name + path.sep + destName;
		var resizeWidth = targetSize.width;
		var resizeHeight = null;
		if (size.height > size.width) {
			resizeWidth = null;
			resizeHeight = targetSize.width;
		}

		gm(imgPath).profile('sRGB.icc').resize(resizeWidth, resizeHeight).quality(80).noProfile().write(dest, function(err) {
			if (!err) {
				console.log(dest + ' written');
			} else {
				console.error('error converting ' + destName);
				console.error(err);
			}
			callback(err);
		});
	};

	this.cropAndResize = function(callback) {
		async.each(targetSizes, cropAndResizeTo, function(err) {
			callback(err);
		});
	};
};

try {
	targetSizes.forEach(function(targetSize) {
		fs.mkdirSync(outputPath + path.sep + targetSize.name);
	});
} catch (e) {
	if (e.code !== 'EEXIST') {
		console.log(e);
	}
}

fs.readdir(inputPath, function(err, files) {
	files = files.filter(function(filename) {
		return filename.toLowerCase().indexOf('.jpg') > 0;
	});

	var q = async.queue(function(imgDef, callback) {
		var imgPath = inputPath + path.sep + imgDef;

		gm(imgPath).size(function(err, imgSize) {
			if (!err) {
				var image = new Image(imgDef, imgSize, imgPath, targetSizes, outputPath);
				image.cropAndResize(callback);
			} else {
				callback(err);
			}
		});
	}, 10);
	q.push(files);
});
