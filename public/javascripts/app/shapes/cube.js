define( [

    "three",
    "animitter",
    "app/config/scene",
    "suds/math/Bezier",
    "suds/math/Point",
    "suds/motion/Wave",
    "mout/lang/deepClone",
    "mout/random/rand"

], function( THREE, animitter, scene, Bezier, Point, Wave, deepClone, rand ) {

    return function( swarm, pointA, pointB, pointC, color ) {

        var mesh;
        var loop;
        var bezier;
        var rotation;
        var from, to;
        var scaleFactor;

        function init() {

            pointA = deepClone( pointA );
            pointB = deepClone( pointB );
            pointC = deepClone( pointC );

            shufflePoint( pointA );
            shufflePoint( pointB );
            shufflePoint( pointC );

            rotation = {
                x: rand( 0.01, 0.05 ),
                y: rand( 0.01, 0.05 )
            };

            scaleFactor = new Wave( 0.5, 1, 0.03 );

            var geometry = new THREE.CubeGeometry( 50, 50, 50 );
            var material = new THREE.MeshLambertMaterial( { color: color } );

            mesh = new THREE.Mesh( geometry, material );
            mesh.scale.x = mesh.scale.y = mesh.scale.z = rand( 0.5, 1 );
            loop = animitter( onUpdate );
            bezier = makeBezier();
            bezier.time = rand( 0, 0.9 );

            scene.add( mesh );
            loop.start();
        }

        function onUpdate() {
            if ( bezier.isComplete() ) recalculateBezier();
            else bezier.update();

            scaleFactor.update();

            mesh.position.x = bezier.x;
            mesh.position.y = bezier.y;
            mesh.position.z = from.z + ( to.z - from.z ) * bezier.time;

            mesh.rotation.x += rotation.x;
            mesh.rotation.y += rotation.y;

            mesh.scale.x = mesh.scale.y = mesh.scale.z = scaleFactor.getValue();
        }

        function makeBezier() {
            var a = new Point().set( pointA.point );
            var b = new Point().set( pointB.point );
            var c = new Point().set( pointC.point );

            from = a.clone().add( b ).divide( 2 );
            to = b.clone().add( c ).divide( 2 );

            from.z = to.z || ( pointA.point.z + pointB.point.z ) / 2;
            to.z = ( pointB.point.z + pointC.point.z ) / 2;

            bezier = new Bezier( 3, true, 20 );
            bezier.addAnchor( from );
            bezier.addAnchor( b );
            bezier.addAnchor( to );

            bezier.calculate();

            return bezier;
        }

        function recalculateBezier() {
            pointA = pointB;
            pointB = pointC;
            pointC = deepClone( swarm.getNextPoint( pointC.id ) );

            shufflePoint( pointC );

            makeBezier();
        }

        function shufflePoint( point ) {
            var offset = 20;

            point.point.x += rand( -offset, offset);
            point.point.y += rand( -offset, offset);
            point.point.z += rand( -offset, offset);
        }

        init();
    };

} );