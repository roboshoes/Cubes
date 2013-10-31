define( [ "three" ], function( THREE ) {

    var renderer = new THREE.WebGLRenderer();

    window.addEventListener( "resize", onResize );

    function onResize() {
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    onResize();

    return renderer;

} );