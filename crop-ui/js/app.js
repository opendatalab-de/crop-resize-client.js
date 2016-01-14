var crc = {};

(function(crc) {
	'use strict';

	crc.data = {
		aspectRatio: '1:1',
 		targetSizes: [
    	{
      		name: "box",
      		width: 250
    	} ],
		names: [],
		images: []
	};

	crc.init = function() {
		crc.json.init();
		crc.fileInput.init();
		crc.crop.init();
		crc.form.init();
	};
})(crc);
