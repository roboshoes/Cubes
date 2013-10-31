define( [

	"suds/canvas/CanvasElement",
	"suds/events/Interval",

	"mout/function/bind"

], function( CanvasElement, Interval, bind ) {

	var Stage = CanvasElement.extend( {

		context: null,
		frameClosure: null,

		initialize: function( context ) {
			this._super();

			this.context = context;
			this.frameClosure = bind( this.onFrame, this );
		},

		setAutoRender: function( value ) {
			this.autoRender = value;

			if ( value ) Interval.addListener( Interval.FRAME, this.frameClosure );
			else Interval.removeListener( Interval.FRAME, this.frameClosure );
		},

		onFrame: function() {
			this.update();
			this.draw( this.context );
		}

	} );

	return Stage;

} );
