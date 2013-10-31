define( [

	"suds/oop/Class"

], function( Class ) {

	var Sinuous = Class.extend( {

		tau: 0,

		initialize: function( min, max, speed ) {
			this.speed = speed;
			this.min = min;
			this.max = max;
			this.range = max - min;
		},

		update: function() {
			this.tau += this.speed;

			while ( this.tau > Math.PI ) this.tau -= Math.PI;

			this.calculate();
		},

		calculate: function() {
			this.value = this.min + Math.sin( this.tau ) * this.range;
		},

		getValue: function() {
			return this.value;
		}

	} );

	return Sinuous;

} );
