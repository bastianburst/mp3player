$(document).ready(function () {
    initPlayer();
    getSongs();
});

var audio = document.getElementById('player');
var music;
var animation = document.getElementById('propphoto');

function getSongs() {
    //buscamos nuestro archivo json
    $.getJSON("./assets/json/main.json", function (json) {
        //lo asigamos a nuestro arreglo music
        //y los pasamos a la función getList
        music = json;
        getList(music);
        //console.log(json);
    });
}


function getList(music) {
    //Mostramos la lista de reproducción
    $.each(music.songs, function (i, song) {
        $('#playlist').append('<li class="list-group-item" id="' + i + '">' + song.nombre + ' - ' + song.artist + '</li>');
    });
    //Cuando seleccione un elemento lo mande a reproducir
    $('#playlist li').click(function () {
        var selected = $(this).attr('id');
        //console.log(selected);
        playSong(selected);
    });
}
//Funcion para reproducir canción
function playSong(song) {
    //console.log(song);
    //validamos si el id de la canción actual es mayor o igual
    //a la longitud del arreglo de canciones
    //Si ya pasó el limite significa que no hay más canciones
    //el audio dejará de reproducirse
    var long = music.songs;
    if (song >= long.length) {
        //console.log('No hay más canciones');
        audio.pause();
        //si no es asi ejecutará el resto del codigo donde
        //buscará la canción e imagen para reproducir
    } else {
        //con .attr asignamos un atributo a scr, que en este caso es la suta de la canción
        //la cual esta en los valores del json
        //a los que accedemos mediante el array music que ya tenemos capturado
        $('#img-album').attr('src', music.songs[song].image);
        $('#player').attr('src', music.songs[song].song);
        //Como ya tenemos el elemento por su ID con getElementById
        //Ahora accedemos al elemento y con el metodo play() que es
        //propio del reproductor o etiqueta audio
        audio.play();
        //una vez termina ejecutará la función nextSong y le enviará el id
        //de la canción en reproducción
        nextSong(song);
    }
}
//Funcion para seguir a la proxima canción automaticamente
function nextSong(id) {
    //Aplicar animación a imagen mientras se reproduce una canción
    //console.log(animation);
    audio.onplaying = function () {
        animation.classList.add('animate__animated');
        animation.classList.add('animate__infinite');
        animation.classList.add('animate__bounce');
    }
    //Al pausar para la animación
    audio.onpause = function () {
        animation.classList.remove('animate__infinite');
        animation.classList.remove('animate__animated');
        animation.classList.remove('animate__bounce');
    }
    //Al reanudar reproducción volver a animar
    audio.onplay = function () {
        animation.classList.add('animate__animated');
        animation.classList.add('animate__infinite');
        animation.classList.add('animate__bounce');
    }

    //Esta funcion se ejecuta despues de que el audio ha empezado
    //cuando el audio termina, se activa una función
    audio.onended = function () {
        //Al terminar una canción termina la animación
        animation.classList.remove('animate__animated');
        animation.classList.remove('animate__infinite');
        animation.classList.remove('animate__bounce');
        //console.log(id);
        //Llamamos a la función playSong pero esta vez con el 
        //Id aumentado en uno para que reproduzca la siguiente canción
        playSong(parseInt(id) + 1);
    }
}
//Funciona para reproducir de forma aleatoria
function shuffle(array) {
    for (var random, temp, position = array.length; position; random = Math.floor(Math.random() * position), temp = array[--position], array[position] = array[random], array[random] = temp);
    return array;
}

function initPlayer() {
    $('#shuffle').click(function () {
        $('#playlist').empty();
        shuffle(music.songs);
        getList(music);
        playSong(0);

    });
}