define( [

    "three",
    "app/config/scene",
    "app/shapes/bubble",
    "mout/function/times"

], function( THREE, scene, bubble, times ) {

    return function() {

        var loop;

        function init() {
            createLights();
            createBubbles();
        }

        function createLights() {
            buildLight( 0, 0, 30 );
            buildLight( 100, 0, 100 );
            buildLight( -100, 0, 100 );
            buildLight( 0, 0, 0 );
        }

        function createBubbles() {
            times( 10, bubble );
        }

        function buildLight( x, y, z) {
            var light = new THREE.PointLight( 0xffffff );

            light.position.x = x;
            light.position.y = y;
            light.position.z = z;

            scene.add( light );
        }

        init();
    };

} );