define( [

    "three",
    "animitter",
    "mout/function/times",
    "mout/random/rand",
    "app/shapes/cube"

], function( THREE, animitter, times, rand, cube ) {

    return function( color ) {

        var cubes;
        var swarmAPI = {};
        var points;
        var latestQuadrant;

        function init() {

            initPoints();
            initCubes();

        }

        function initCubes() {
            cubes = [];

            times( 50, function( index ) {
                setTimeout( function() {
                    cubes.push( cube( swarmAPI, points[ 0 ], points[ 1 ], points[ 2 ], color ) );
                }, 30 * index );
            } );
        }

        function initPoints() {
            var timestamp = Date.now();

            points = [];

            times( 3, function( index ) {

                points.unshift( {
                    id: timestamp - index,
                    point: randomPoint()
                } );

            } );
        }

        function generateSignedPoint() {
            return {
                id: Date.now(),
                point: randomPoint()
            };
        }

        function randomPoint() {
            return {
                x: rand( -400, 400 ),
                y: rand( -200, 200 ),
                z: rand( -400, 400 )
            };
        }

        function getQuadrant( point ) {
            if ( point.x < 0 ) {
                return point.y < 0 ? 3 : 2;
            } else {
                return point.y < 0 ? 4 : 1;
            }
        }

        swarmAPI.getNextPoint = function( latest ) {

            var point, newPoint;

            for ( var i = 0, length = points.length; i < length; i++ ) {
                point = points[ i ];

                if ( latest < point.id ) {
                    return point;
                }
            }

            do {
                newPoint = generateSignedPoint();
            } while ( getQuadrant( newPoint.point ) === latestQuadrant );

            points.push( newPoint );

            latestQuadrant = getQuadrant( newPoint.point );

            return newPoint;

        };

        init();

        return swarmAPI;
    };

} );