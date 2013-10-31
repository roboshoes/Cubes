define( [

	"suds/events/Dispatcher"

], function( Dispatcher ) {

	var CanvasElement = Dispatcher.extend( {

		children: null,

		initialize: function() {
			this.children = [];
		},

		addChild: function( child ) {
			this.children.push( child );
		},

		update: function() {
			this.loop( "update" );
		},

		draw: function( context ) {
			this.loop( "draw", context );
		},

		loop: function() {
			var parameters = Array.prototype.slice.call( arguments );
			var child, length = this.children.length;
			var functionName = parameters.shift();

			for ( var i = 0; i < length; i++ ) {
				child = this.children[ i ];
				child[ functionName ].apply( child, parameters );
			}
		}

	} );

	return CanvasElement;

} );
