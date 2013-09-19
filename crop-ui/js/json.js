(function(crc, $) {
	'use strict';

	var updateOutput = function() {
		$('#json').val(JSON.stringify(crc.data, null, '  '));
	};

	var onJsonChange = function() {
		var data = JSON.parse($('#json').val());
		crc.data = data;
		$(crc).triggerHandler('update');
	};

	var exportJson = function() {
		var blob = new Blob([$('#json').val()], {
			type: "text/plain;charset=utf-8"
		});
		saveAs(blob, 'images.json');
	};

	var init = function() {
		$(crc).on('update', updateOutput);
		$('#json').on('change', onJsonChange);
		$('.btn-export-json').on('click', exportJson);
		updateOutput();
	};

	crc.json = {
		'init': init
	};
})(crc, jQuery);
