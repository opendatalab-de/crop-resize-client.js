(function(crc, $, _) {
	'use strict';

	var currentImage = 0;
	var imgAreaSelect = null;
	var images = 0;

	var reset = function() {
		currentImage = 0;
		images = $('#images img').length;
	};

	var close = function() {
		$('#crop-actions, #images img').hide();
		$('#drop-zone').show();
		if (imgAreaSelect) {
			imgAreaSelect.cancelSelection();
		}
	};

	var next = function() {
		currentImage++;
		if (currentImage >= images) {
			currentImage = 0;
		}
		displayCurrentImage();
	};

	var prev = function() {
		currentImage--;
		if (currentImage < 0) {
			currentImage = images - 1;
		}
		displayCurrentImage();
	};

	var remove = function() {
		var imgToRemove = $('#images img:visible');
		close();

		crc.data.images = _.reject(crc.data.images, function(img) {
			return img.source === imgToRemove.attr('title');
		});
		imgToRemove.remove();

		images--;
		if (images > 0) {
			currentImage--;
			next();
		}

		$(crc).triggerHandler('update');
	};

	var rotate = function() {
		imgAreaSelect.getOptions().aspectRatio = invertAspectRatio(imgAreaSelect.getOptions().aspectRatio);
		var selection = guessSelection($('#images img:visible'), imgAreaSelect.getOptions().aspectRatio);
		imgAreaSelect.setSelection(selection.x1, selection.y1, selection.x2, selection.y2);
		imgAreaSelect.update();
	};

	var displayCurrentImage = function() {
		if (imgAreaSelect) {
			imgAreaSelect.cancelSelection();
		}
		$('#drop-zone').hide();
		$('#crop-actions').show();
		$('#images img').hide();
		$('#images img').eq(currentImage).show();
		enableAreaSelect();
	};

	var recalculateSelection = function(img, currentElement) {
		if (img.cropAreaX1 === null || img.cropAreaX1 === undefined) {
			return null;
		}

		var imgWidth = currentElement.width();
		var imgHeight = currentElement.height();

		return {
			x1: imgWidth * img.cropAreaX1 / 100,
			y1: imgHeight * img.cropAreaY1 / 100,
			x2: imgWidth * img.cropAreaX2 / 100,
			y2: imgHeight * img.cropAreaY2 / 100
		};
	};

	var getAspectRatioAdjustedToImageOrientation = function(imageElement) {
		if (imageElement.height() > imageElement.width()) {
			return invertAspectRatio(crc.data.aspectRatio);
		}
		return crc.data.aspectRatio;
	};

	var invertAspectRatio = function(aspectRatio) {
		var splittedAspectRatio = aspectRatio.split(':');
		return splittedAspectRatio[1] + ':' + splittedAspectRatio[0];
	};

	var guessSelection = function(imageElement, aspectRatioString) {
		var imgWidth = imageElement.width();
		var imgHeight = imageElement.height();

		var splittedAspectRatio = aspectRatioString.split(':');
		var aspectRatio = splittedAspectRatio[0] / splittedAspectRatio[1];

		var selection = {
			x1: 0,
			y1: 0,
			x2: imgWidth,
			y2: imgHeight
		};

		var selectionWidth = imgHeight * aspectRatio;
		var selectionHeight = imgWidth / aspectRatio;

		if (selectionWidth > imgWidth) {
			selectionWidth = imgWidth;
			selection.y1 = (imgHeight - selectionHeight) / 2;
			selection.y2 = selection.y1 + selectionHeight;
		}
		if (selectionHeight > imgHeight) {
			selectionHeight = imgHeight;
			selection.x1 = (imgWidth - selectionWidth) / 2;
			selection.x2 = selection.x1 + selectionWidth;
		}

		return selection;
	};

	var enableAreaSelect = function() {
		if ($('#images img').eq(currentImage).is(':visible')) {
			var currentElement = $('#images img').eq(currentImage);
			var aspectRatio = getAspectRatioAdjustedToImageOrientation(currentElement);

			imgAreaSelect = currentElement.imgAreaSelect({
				'handles': true,
				'aspectRatio': aspectRatio,
				'instance': true,
				'show': true,
				'keys': true
			});

			var img = _.find(crc.data.images, function(img) {
				return img.source === currentElement.attr('title');
			});

			var selection = null;
			if (img) {
				$('#name-select').val(img.name);
				selection = recalculateSelection(img, currentElement);
			}

			if (selection === null) {
				selection = guessSelection(currentElement, aspectRatio);
			}

			imgAreaSelect.setSelection(selection.x1, selection.y1, selection.x2, selection.y2);
			imgAreaSelect.update();
		} else
			setTimeout(crc.select.enableAreaSelect, 50);
	};

	var save = function() {
		var currentElement = $('#images img').eq(currentImage);
		var currentSource = currentElement.attr('title');

		var img = _.find(crc.data.images, function(img) {
			return img.source === currentSource;
		});
		if (!img) {
			img = {
				source: currentSource,
			};
			crc.data.images.push(img);
		}

		img.name = $('#name-select').val();

		var currentSelection = imgAreaSelect.getSelection();
		var imgWidth = currentElement.width();
		var imgHeight = currentElement.height();
		img.cropAreaX1 = Math.round(currentSelection.x1 / imgWidth * 10000) / 100;
		img.cropAreaY1 = Math.round(currentSelection.y1 / imgHeight * 10000) / 100;
		img.cropAreaX2 = Math.round(currentSelection.x2 / imgWidth * 10000) / 100;
		img.cropAreaY2 = Math.round(currentSelection.y2 / imgHeight * 10000) / 100;

		$(crc).triggerHandler('update');
	};

	var init = function() {
		$(crc).on('newImages', reset).on('newImages', displayCurrentImage);
		$('.close-img, .next-img, .prev-img').on('click', save);
		$('.close-img').on('click', close);
		$('.next-img').on('click', next);
		$('.prev-img').on('click', prev);
		$('.delete-img').on('click', remove);
		$('.rotate-area').on('click', rotate);
	};

	crc.crop = {
		'init': init,
		'enableAreaSelect': enableAreaSelect
	};
})(crc, jQuery, _);
