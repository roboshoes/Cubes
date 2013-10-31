define( function() {

	var RatioHelper = {};

	// Given original size and bonding container,
	// return new dimensions and position to fill

	RatioHelper.scaleToFill = function( original, container ) {
		var originalRatio = original.w / original.h;
		var containerRatio = container.w / container.h;

		var _left, _top, _width, _height;

		if (originalRatio > containerRatio) {
			_height = container.h;
			_width = Math.round( container.w * (originalRatio) );
			_left = Math.round( (container.w - _width) / 2 );
			_top = 0;
		} else {
			_width = container.w;
			_height = Math.round( container.h * originalRatio );
			_left = 0;
			_top = Math.round( (container.h - _height) / 2 );
		}

		return { left: _left, top: _top, width: _width, height: _height };
	}

	/*
		RationHelper.cover covers an entire area.  Will try to match the width of the area first.  If the resulting height isn't enough to cover, then it re-scales to match height.
		To be used as an alternative to css background-size: cover on an image element

		Usage: 
		RatioHelper.cover({
			objectDimensions: {
				width: 1366,
				height: 960
			},
			bounds: {
				width: 1920,
				height: 1080
			}
		});
	*/

	RatioHelper.cover = function( p ) {

		var ratio = p.objectDimensions.width / p.objectDimensions.height;
		var dim = {};

		dim.width = p.bounds.width;
		dim.height = Math.round(p.bounds.width / ratio);
		dim.top = Math.round((p.bounds.height - dim.height) / 2);
		dim.left = 0;

		if(dim.height < p.bounds.height) {
			dim.top = 0;
			dim.width = Math.round(p.bounds.height * ratio);
			dim.height = p.bounds.height;
			dim.left = Math.round((p.bounds.width - dim.width) / 2);
		}

		return dim;
	};

	return RatioHelper;

} );