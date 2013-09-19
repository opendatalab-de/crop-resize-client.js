(function(crc, $) {
	'use strict';

	var updateForm = function() {

		var names = {
			taken: [],
			free: []
		};
		$.each(crc.data.names, function(index, name) {
			var img = _.find(crc.data.images, function(img) {
				return img.name === name;
			});
			var status = img === undefined ? 'free' : 'taken';
			names[status].push(name);
		});

		var html = '<option value="">Bitte wählen ...</option>';
		html += '<optgroup label="frei">';
		$.each(names.free, function(index, name) {
			html += '<option value="' + name + '">' + name + '</option>';
		});

		html += '</optgroup><optgroup label="zugewiesen">';
		$.each(names.taken, function(index, name) {
			html += '<option value="' + name + '">' + name + '</option>';
		});
		html += '</optgroup>';
		$('#name-select').html(html);
	};

	var init = function() {
		$(crc).on('update', updateForm);
	};

	crc.form = {
		'init': init
	};
})(crc, jQuery);
