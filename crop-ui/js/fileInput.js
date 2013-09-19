(function(crc, $) {
	'use strict';

	var handleFileSelect = function(evt) {
		evt.stopPropagation();
		evt.preventDefault();

		var files = evt.dataTransfer.files;

		var inserted = 0;
		var triggerNewImages = function() {
			if (inserted >= files.length) {
				$(crc).triggerHandler('newImages');
			}
		};

		document.getElementById('images').innerHTML = '';
		for ( var i = 0, f; f = files[i]; i++) {
			if (!f.type.match('image.*')) {
				continue;
			}

			var reader = new FileReader();
			reader.onload = (function(theFile) {
				return function(e) {
					var container = document.createElement('div');
					container.innerHTML = ['<img class="crop-selection" src="', e.target.result, '" title="', escape(theFile.name),
						'" style="display:none;" />'].join('');
					document.getElementById('images').insertBefore(container, null);
					inserted++;
					triggerNewImages();
				};
			})(f);

			reader.readAsDataURL(f);
		}
	};

	var handleDragOver = function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'copy';
	};

	var init = function() {
		var dropZone = document.getElementById('drop-zone');
		dropZone.addEventListener('dragover', handleDragOver, false);
		dropZone.addEventListener('drop', handleFileSelect, false);
	};

	crc.fileInput = {
		'init': init
	};
})(crc, jQuery);
