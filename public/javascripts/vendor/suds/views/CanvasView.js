define( [

	"suds/views/View"

], function( View ) {

	var Canvas = View.extend( {

		context: null,
		stage: null,

		width: 1,
		height: 1,

		initialize: function() {

			this._super( this.initCanvas() );

		},

		initCanvas: function() {
			var canvas = document.createElement( "canvas" );

			this.context = canvas.getContext( "2d" );

			return canvas;
		},

		clear: function() {
			this.canvas.width = this.width;
		},

		setSize: function( width, height ) {
			this.element.width = this.width = width;
			this.element.height = this.height = height;
		}

	} );

	return Canvas;

} );
