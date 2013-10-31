define( [

	"suds/events/Dispatcher",

	"mout/function/bind"

], function( Dispatcher, bind ) {

	var View = Dispatcher.extend( {

		parent: null,
		element: null,
		children: null,
		animateInDelay: 0,
		animateOutDelay: 0,

		initialize: function( node ) {
			this._super();

			this.element = node || $( "<div>" );
			this.children = [];
		},

		parse: function( template, values ) {
			return template.replace( /{{(\w*)}}/g, function( match, key ) {
				return ( key in values ) ? values[ key ] : "";
			} );
		},

		appendView: function( view, prepend ) {
			if ( view.parent ) {
				throw new Error( "View can only be child of one View" );
			}

			prepend = typeof prepend === "undefined" ? false : !!prepend;

			view.parent = this;

			if ( prepend ) {
				this.children.unshift( view );
				this.element.prepend( view.element );
			} else {
				this.children.push( view );
				this.element.append( view.element );
			}

			view.dispatch( View.ADDED );
		},

		prependView: function ( view ) {
			this.appendView( view, true );
		},

		removeView: function( view ) {

			var index = -1;
			for(var i=0; i<this.children.length; i++) {
				if(view == this.children[i]) {
					index = i;
					break;
				}
			}

			if ( index > -1 ) {
				this.children.splice( index, 1 );
				view.parent = null;
			}

			view.element.remove();
			this.dispatch( View.REMOVED );

		},

		contains: function( view ) {
			return this.children.indexOf( view ) > -1;
		},

		dispatch: function( name, event ) {
			this._super( name, event );

			if ( event && event.bubbles === true ) {

				if ( this.parent ) {
					this.parent.dispatch( name, event );
				}

			}
		},

		animateIn: function() {
			if ( this.animateInDelay > 0 ) {

				setTimeout( bind( this.executeAnimateIn, this ), this.animateInDelay );

			} else this.executeAnimateIn();
		},

		executeAnimateIn: function() {
			var i, length = this.children.length, child;

			for ( i = 0; i < length; i++ ) {
				child = this.children[ i ];
				child.animateIn.call( child );
			}
		},

		animateOut: function() {
			if ( this.animateOutDelay > 0 ) {

				setTimeout( bind( this.executeAnimateOut, this ), this.animateOutDelay );

			} else this.executeAnimateOut();
		},

		executeAnimateOut: function() {
			var i, length = this.children.length, child;

			for ( i = 0; i < length; i++ ) {
				child = this.children[ i ];
				child.animateOut.call( child );
			}
		}

	} );

	View.ADDED = "View.ADDED";
	View.REMOVED = "View.REMOVED";

	return View;

} )