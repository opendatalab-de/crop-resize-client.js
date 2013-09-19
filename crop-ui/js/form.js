(function(crc, $) {
	'use strict';

	var updateForm = function() {
		var html = '<option value="">Bitte wählen ...</option>';
		$.each(crc.data.names, function(index, name) {
			html += '<option value="' + name + '">' + name + '</option>';
		});
		$('#name-select').html(html);
	};

	var init = function() {
		$(crc).on('update', updateForm);
	};

	crc.form = {
		'init': init
	};
})(crc, jQuery);
