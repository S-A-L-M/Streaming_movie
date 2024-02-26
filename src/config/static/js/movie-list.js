"use strict"; //<-----garantiza prácticas de codificación más seguras y consistentes, por lo que se recomienda mantenerla en el proyecto para asegurar un comportamiento predecible y evitar errores potenciales.

//¡SI VAS A ELIMIMAR UN COMENTARIO, RECUERDA QUE PUEDE PERJUDICAR LA COMUNICACIÓN DE CÓDIGOS A TU OTROS COMPAÑEROS!

/**
 * MOVIE-LIST
 * crea una página web que muestra películas de un género específico. Permite cargar más películas con un botón "Load More". 
 * También incluye funciones de búsqueda. La organización modular facilita el desarrollo y la colaboración en el proyecto.
 */




//-----------------------------------------------------------------------------------------------------------------------

// Importa herramientas esenciales desde archivos externos
import { api_key, fetchDataFromServer } from "/static/js/api.js";
import { sidebar } from "/static/js/sidebar.js";
import { createMovieCard } from "/static/js/movie-card.js";
import { search } from "/static/js/search.js";

// Obtiene el nombre del género y el parámetro de URL almacenados en el LocalStorage
const genreName = window.localStorage.getItem("genreName"); //console.log("genreName")<-------FUNCIONANDO
const urlParam = window.localStorage.getItem("urlParam"); //console.log("urlParam")<-------FUNCIONANDO

// Selecciona el contenedor de contenido de la página
const pageContent = document.querySelector("[page-content]");

sidebar();

// Inicialización de variables para paginación
let currentPage = 1;
let totalPages = 0;

// Obtener datos iniciales de películas desde el servidor
fetchDataFromServer(
    `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`,
    function({ results: movieList, total_pages }) {
        totalPages = total_pages;
        // Configura el título de la página
        document.title = `${genreName} Movies - Tvflix`; //AQUI LAS PERSONALIZAS CÓMO SE TE LA GANA

        // Crea un elemento de lista de películas y configura su estructura HTML
        const movieListElem = document.createElement("section");
        movieListElem.classList.add("movie-list", "genre-list");
        movieListElem.ariaLabel = `${genreName} Movies`;

        movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h1 class="heading">All ${genreName} Movies</h1>
    </div>
    
    <div class="grid-list"></div>
    
    <button class="btn load-more" load-more>Load More</button>
  `;

        // add movie card based on fetched item // Agrega tarjetas de películas basadas en los resultados obtenidos
        for (const movie of movieList) {
            const movieCard = createMovieCard(movie);

            movieListElem.querySelector(".grid-list").appendChild(movieCard);
        }

        // Agrega la lista de películas al contenido de la página
        pageContent.appendChild(movieListElem);

        // load more button // Configura el evento del botón "Load More" para cargar más películas
        document
            .querySelector("[load-more]")

        .addEventListener("click", function() {
            if (currentPage >= totalPages) {
                this.style.display = "none"; // this == loading-btn
                return;
            }

            currentPage++;
            this.classList.add("loading"); // this == loading-btn

            // Obtiene más datos de películas y agrega las tarjetas al elemento de lista
            fetchDataFromServer(
                `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`,
                ({ results: movieList }) => {
                    this.classList.remove("loading"); // this == loading-btn

                    for (const movie of movieList) {
                        const movieCard = createMovieCard(movie);

                        movieListElem.querySelector(".grid-list").appendChild(movieCard);
                    }
                }
            );
        });
    }
);
// Inicializa la funcionalidad de búsqueda
search();