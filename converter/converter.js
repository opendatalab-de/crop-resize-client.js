var fs = require('fs'), gm = require('gm');

var path = '/Users/felix/Pictures/HP24/Sonstige/Gäste/Kinder/';

var input = {
	"aspectRatio": "1:1",
	"names": [],
	"images": [{
		"source": "Fotolia_4174651_Subscription_XL.jpg",
		"name": "",
		"cropAreaX1": 19.71,
		"cropAreaY1": 12.98,
		"cropAreaX2": 86.54,
		"cropAreaY2": 57.53
	}, {
		"source": "Fotolia_4441326_Subscription_XL_2.jpg",
		"name": "",
		"cropAreaX1": 1.5,
		"cropAreaY1": 3.69,
		"cropAreaX2": 58.97,
		"cropAreaY2": 89.9
	}]
};

var targetSizes = [{
	name: 'xhdpi',
	width: 550
}, {
	name: 'hdpi',
	width: 250
}];

var writeDone = function(err) {
	if (!err)
		console.log('done');
};

targetSizes.forEach(function(targetSize) {
	fs.mkdir(targetSize.name, function() {
		input.images.forEach(function(img) {
			var imgPath = path + img.source;
			var dest = targetSize.name + '/' + img.name + '.jpg';

			gm(imgPath).size(function(err, value) {
				var cropX = img.cropAreaX1 / 100 * value.width;
				var cropY = img.cropAreaY1 / 100 * value.height;
				var cropWidth = (img.cropAreaX2 / 100 * value.width) - cropX;
				var cropHeight = (img.cropAreaY2 / 100 * value.height) - cropY;

				gm(imgPath).crop(cropWidth, cropHeight, cropX, cropY).resize(targetSize.width).noProfile().write(dest, writeDone);
			});
		});
	});
});

// resize and remove EXIF profile data
