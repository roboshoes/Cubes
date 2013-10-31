var sharedConfigs = {
    shim: {
        'three': {
            exports: 'THREE'
        }
    },

    paths: {
        'mout': 'vendor/mout',
        'cane': 'vendor/cane',
        'animitter': 'vendor/animitter',
        'three': 'vendor/three',
        'suds': 'vendor/suds'
    }
};

var devConfig = {
    baseUrl: 'javascripts'
};

for ( var key in sharedConfigs ) {
	devConfig[ key ] = sharedConfigs[ key ];
}


if ( typeof module !== 'undefined' && module.exports ) {

	module.exports = sharedConfigs;

} else {

    requirejs.config( devConfig );

    require(['app/main'],function( app ) {
        app();
    });
}

