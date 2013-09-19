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

	var enableAreaSelect = function() {
		if ($('#images img').eq(currentImage).is(':visible')) {
			imgAreaSelect = $('#images img').eq(currentImage).imgAreaSelect({
				handles: true,
				aspectRatio: crc.data.aspectRatio,
				instance: true
			});
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
	};

	crc.crop = {
		'init': init,
		'enableAreaSelect': enableAreaSelect
	};
})(crc, jQuery, _);
