define( [

    "three",
    "app/config/scene",
    "app/config/camera",
    "app/config/renderer",
    "app/formation/swarm",
    "app/formation/sun",
    "app/utils/color",
    "animitter"

], function( THREE, scene, camera, renderer, swarm, sun, color, animitter ){

    function setTag() {
        var tag = document.getElementById( "tag" );

        tag.className = "before in";

        setTimeout( function() {
            tag.className = "";
        }, 300 );
    }

    return function app() {

        setTag();

        var container = document.getElementById( "container" );
        container.appendChild( renderer.domElement );

        scene.add( camera );

        swarm( color() );
        sun();

        var loop = animitter( function() {

            renderer.render( scene, camera );

        } ).start();

    };

} );
