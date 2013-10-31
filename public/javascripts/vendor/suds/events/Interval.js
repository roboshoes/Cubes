define( [

	"suds/events/Dispatcher",

	"mout/function/bind"

], function( Dispatcher, bind ) {

	"use strict";

	var FRAME = "Interval.FRAME";
	var ONCE = "Interval.ONCE";

	var animationFrame = ( function() {
		return  window.requestAnimationFrame       ||
		        window.webkitRequestAnimationFrame ||
		        window.mozRequestAnimationFrame    ||
		        window.oRequestAnimationFrame      ||
		        window.msRequestAnimationFrame     ||
		        function( callback ){
		        	window.setTimeout(callback, 1000 / 60);
		        };
	} )();

	var Interval = Dispatcher.extend( {

		initialize: function() {
			this._super();
			this.loop();
		},

		loop: function() {

			var listeners = [];
			var length = this.listeners.length;
			var listener;
			var i;

			for ( i = 0; i < length; i++ ) {
				listener = this.listeners[ i ];
				if ( listener.name === ONCE ) listeners.push( listener.closure );
			}

			this.dispatch( FRAME );
			this.removeListenerFor( ONCE );

			length = listeners.length;
			for ( i = 0; i < length; i++ ) {
				listeners[ i ]();
			}

			animationFrame( bind( this.loop, this ) );
		},

		once: function( closure ) {
			this.addListener( ONCE, closure );
		}

	} );

	var interval = new Interval();

	interval.FRAME = FRAME;
	interval.ONCE = ONCE;

	return interval;

} );