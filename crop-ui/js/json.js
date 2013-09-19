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

	var init = function() {
		$(crc).on('update', updateOutput);
		$('#json').on('change', onJsonChange);
		updateOutput();
	};

	crc.json = {
		'init': init
	};
})(crc, jQuery);
