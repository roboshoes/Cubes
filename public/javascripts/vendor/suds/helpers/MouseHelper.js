define( [

	"suds/events/Dispatcher",
	"suds/events/Interval"

], function( Dispatcher, Interval ) {

	var MouseHelper =  {};
	var dispatcher = new Dispatcher();
	var storeX = -1;
	var storeY = -1;
	var tracking = false;
	var lastEvent = null;

	MouseHelper.x = -1;
	MouseHelper.y = -1;


	MouseHelper.startTracking = function() {
		if ( ! tracking ) {
			
			if ( window.addEventListener ) {
				window.addEventListener( "mousemove", onMouseMove, false );
			} else {
				window.attachEvent( "onmousemove", onMouseMove );
			}
			tracking = true;
		}
	};

	MouseHelper.stopTracking = function() {
		
		if( window.removeEventListener ) {
			window.removeEventListener( "mousemove", onMouseMove, false );
		} else {
			window.detachEvent( "onmousemove", onMouseMove );
		}

		MouseHelper.x = -1;
		MouseHelper.y = -1;

		tracking = false;
	};

	MouseHelper.addListener = function( name, closure ) {

		if ( name === MouseHelper.MOUSE_MOVE ) {
			MouseHelper.startTracking();
			Interval.addListener( Interval.FRAME, onFrame );
		}

		dispatcher.addListener( name, closure );
	};

	MouseHelper.removeListener = function( name, closure ) {
		dispatcher.removeListener( name, closure );

		if ( ! dispatcher.hasListenerFor( MouseHelper.MOUSE_MOVE ) ) {
			//MouseHelper.stopTracking();
			Interval.removeListener( Interval.FRAME, onFrame );
		}
	};

	var onMouseMove = function( event ) {
		MouseHelper.x = event.pageX;
		MouseHelper.y = event.pageY;

		lastEvent = event;
	};

	var onFrame = function( event ) {
		if ( MouseHelper.x !== storeX || MouseHelper.y !== storeY ) {
			dispatcher.dispatch( MouseHelper.MOUSE_MOVE, event );
		}

		storeX = MouseHelper.x;
		storeY = MouseHelper.y;
	};

	MouseHelper.MOUSE_MOVE = "MouseHelper.MOUSE_MOVE";

	return MouseHelper;
} );