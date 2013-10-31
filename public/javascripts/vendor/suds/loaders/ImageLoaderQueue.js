define( [

	"suds/events/Dispatcher"

], function( Dispatcher ) {

	var ImageLoaderQueue = Dispatcher.extend( {

		lock: false,

		queue: null,
		cache: null,

		loaded: 0,

		initialize: function() {
			this._super();

			this.queue = [];
			this.cache = {};
		},

		onLoaded: function() {
			this.loaded++;

			if ( this.loaded === this.queue.length ) {
				this.dispatch( ImageLoaderQueue.COMPLETE );
			}
		},

		onError: function() {
			this.dispatch( ImageLoaderQueue.ERROR );
		},

		add: function( path ) {

			if ( this.lock ) throw new Error( "Queue started loading. No Items can be added" );

			this.queue.push( path );
		},

		get: function( path ) {

			if ( !this.lock ) throw new Error( "Queue hasn't loaded" );

			return this.cache[ path ];

		},

		load: function() {
			this.lock = true;

			var item, image;

			for ( var i = 0, length = this.queue.length; i < length; i++ ) {
				var path = this.queue[ i ];

				image = new Image();
				image.onload = this.onLoaded.bind( this );
				image.onerror = this.onError.bind( this );
				image.src = path;

				this.cache[ path ] = image;
			}
		}

	} );

	ImageLoaderQueue.COMPLETE = "complete";
	ImageLoaderQueue.ERROR = "error";

	return ImageLoaderQueue;

} )