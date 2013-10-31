define( function() {

	var BrowserHelper = {};

	function onResize() {
		BrowserHelper.width = window.innerWidth || document.documentElement.clientWidth;
		BrowserHelper.height = window.innerHeight || document.documentElement.clientHeight;
	}

	if ( window.addEventListener ) {
		window.addEventListener( "resize", onResize );
	} else {
		window.attachEvent( "resize", onResize );
	}

	onResize();

	BrowserHelper.webgl = ( function() {
		try { return !! window.WebGLRenderingContext && !! document.createElement( "canvas" ).getContext( "experimental-webgl" ); }
		catch( e ) { return false; };
	} )();

	BrowserHelper.canvas = ( function() {
		var element = document.createElement( "canvas" );
		return !!( element.getContext && element.getContext( "2d" ) );
	} )();

	BrowserHelper.pushstate = ( function() {
		return window.history && window.history.pushState;
	} )();

	BrowserHelper.css3D = ( function() {
		return 'WebkitPerspective' in document.body.style || 'MozPerspective' in document.body.style || 'msPerspective' in document.body.style || 'OPerspective' in document.body.style || 'perspective' in document.body.style;
	} )();

	BrowserHelper.touchEvents = ( function() {
		return "ontouchstart" in window;
	} )();

	BrowserHelper.isMobile = {
	    Android: function() {
	        return navigator.userAgent.match(/Android/i) ? true : false;
	    },
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i) ? true : false;
	    },
	    any: function() {
	        return (this.Android() || this.BlackBerry() || this.iOS() || this.Windows());
	    }
	};

	return BrowserHelper;

} );