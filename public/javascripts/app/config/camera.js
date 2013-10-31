define( [ "three" ], function( THREE ) {

    var VIEW_ANGLE = 45;
    var NEAR = 0.1;
    var FAR = 10000;

    var aspect = window.innerWidth / window.innerHeight;
    var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, aspect, NEAR, FAR );

    camera.position.z = 500;

    window.addEventListener( "resize", function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    } );

    return camera;

} );