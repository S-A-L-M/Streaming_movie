"use strict"; //<-----garantiza prácticas de codificación más seguras y consistentes, por lo que se recomienda mantenerla en el proyecto para asegurar un comportamiento predecible y evitar errores potenciales.

//¡SI VAS A ELIMIMAR UN COMENTARIO, RECUERDA QUE PUEDE PERJUDICAR LA COMUNICACIÓN DE CÓDIGOS A TU OTROS COMPAÑEROS!


/**
 * Global.js
 * También implementa funciones para agregar eventos, 
 * gestionar la visibilidad de la caja de búsqueda en dispositivos móviles 
 * y almacenar información en el Local Storage al hacer clic en una tarjeta de película. 
 */

//Depurando Al mondongo
// console("GLOBAL READY") ----> No te recomienda depurar con console, mejor depura con el alert
// alert("Depurando") ----> Funcionadooo


//------------------------------------------------------------------------------------------------------------------


// Add event on multiple elements // Función para agregar un evento a varios elementos
const addEventOnElements = function(elements, eventType, callback) {
    for (const elem of elements) elem.addEventListener(eventType, callback);
};

// Toggle search box in mobile device || small screen // // Toggle para mostrar/ocultar la caja de búsqueda en dispositivos móviles o pantallas pequeñas

const searchBox = document.querySelector("[search-box]");
const searchTogglers = document.querySelectorAll("[search-toggler]");

// Almacena el ID de la película en `LocalStorage` cuando haces clic en cualquier tarjeta
addEventOnElements(searchTogglers, "click", function() {
    searchBox.classList.toggle("active");
});

// store movieID in `LocalStorage` when you click any card // Almacena los parámetros de la URL y el nombre del género en `LocalStorage` al obtener la lista de películas
const getMovieDetail = function(movieId) {
    window.localStorage.setItem("movieId", String(movieId));
};
// Almacena los parámetros de la URL y el nombre del género en `LocalStorage` al obtener la lista de películas, si quieres puede ir probando usando console
const getMovieList = function(urlParam, genreName) {
    window.localStorage.setItem("urlParam", urlParam);
    window.localStorage.setItem("genreName", genreName);


    /**
     *  console.log("LocalStorage - urlParam:", window.localStorage.getItem("urlParam")); --->LINDOOOOOOO
    console.log("LocalStorage - genreName:", window.localStorage.getItem("genreName")); ---> TESTEADO Y FUNCIONANDO
     */
};