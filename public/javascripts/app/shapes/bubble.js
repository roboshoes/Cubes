define( [

    "three",
    "app/config/scene",
    "animitter",
    "suds/motion/Wave",
    "mout/random/rand"

], function( THREE, scene, animitter, Wave, rand ) {

    return function() {

        var TWO_PI = Math.PI * 2;
        var phi = Math.random() * TWO_PI;
        var theta = Math.random() * TWO_PI;
        var radius = new Wave( 0, 10, rand( 0.05, 0.2 ) );
        var mesh;

        function init() {
            var geometry = new THREE.CubeGeometry( 10, 10, 10 );
            var material = new THREE.MeshPhongMaterial( { color: "#ffffff" } );

            mesh = new THREE.Mesh( geometry, material );

            setPosition();

            scene.add( mesh );

            animitter( onUpdate ).start();

            mesh.rotation.x = Math.random() * TWO_PI;
            mesh.rotation.y = Math.random() * TWO_PI;
        }

        function onUpdate() {
            phi = ( phi + 0.05 ) % TWO_PI;
            theta = ( theta + 0.05 ) % TWO_PI;
            radius.update();

            mesh.rotation.x += rand( 0.01, 0.03);
            mesh.rotation.y += rand( 0.01, 0.03);

            setPosition();
        }

        function setPosition() {
            var value = radius.getValue();

            mesh.position.x = value * Math.sin( theta ) * Math.sin( phi );
            mesh.position.y = value * Math.sin( theta ) * Math.cos( phi );
            mesh.position.y = value * Math.cos( theta );
        }

        init();

    };

} );