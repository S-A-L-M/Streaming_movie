"use strict"; //<-----garantiza prácticas de codificación más seguras y consistentes, por lo que se recomienda mantenerla en el proyecto para asegurar un comportamiento predecible y evitar errores potenciales.

//¡SI VAS A ELIMIMAR UN COMENTARIO, RECUERDA QUE PUEDE PERJUDICAR LA COMUNICACIÓN DE CÓDIGOS A TU OTROS COMPAÑEROS!


/**
 * Search.JS
 * implementa la funcionalidad de búsqueda en la página web. Al escribir en el campo de búsqueda, se envían solicitudes a la API de TMDb para obtener resultados de películas que coincidan con la consulta. 
 * Los resultados se muestran en un modal en la página. La estructura modular del código facilita su mantenimiento y comprensión.
 * 
 */

//-------------------------------------------------------------------------------------------------------------

// Importa herramientas esenciales desde archivos externos
import { api_key, fetchDataFromServer } from "/static/js/api.js";
import { createMovieCard } from "/static/js/movie-card.js";


// Elementos del DOM relacionados con la búsqueda
export function search() {
    const searchWrapper = document.querySelector("[search-wrapper]");
    const searchField = document.querySelector("[search-field]");

    // Modal para mostrar los resultados de la búsqueda
    const searchResultModal = document.createElement("div");
    searchResultModal.classList.add("search-modal");
    document.querySelector("main").appendChild(searchResultModal);

    // Variable para controlar el tiempo de espera antes de realizar la búsqueda
    let searchTimeout;

    // Evento que se activa cada vez que el usuario escribe en el campo de búsqueda
    searchField.addEventListener("input", function() {
        // Si el campo de búsqueda está vacío, oculta el modal y sale de la función
        if (!searchField.value.trim()) {
            searchResultModal.classList.remove("active"); // console.log("searching") --->TESTEADOOOOOOO
            searchWrapper.classList.remove("searching"); // console.log("searching") --->TESTEADOOOOOOO
            clearTimeout(searchTimeout);
            return;
        }

        // Muestra un indicador de búsqueda activa
        searchWrapper.classList.add("searching");

        // Espera 500ms antes de realizar la búsqueda
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(function() {
            // Realiza la búsqueda en la API de TMDb
            fetchDataFromServer(
                `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${searchField.value}&page=1&include_adult=false`,
                function({ results: movieList }) {
                    // Elimina el indicador de búsqueda activa
                    searchWrapper.classList.remove("searching");
                    // Elimina el indicador de búsqueda activa
                    searchResultModal.classList.add("active");
                    // Limpia los resultados antiguos
                    searchResultModal.innerHTML = ""; // remove old results

                    // Crea la estructura de resultados en el modal
                    searchResultModal.innerHTML = `
            <p class="label">Results for</p>
            
            <h1 class="heading">${searchField.value}</h1>
            
            <div class="movie-list">
              <div class="grid-list"></div>
            </div>
          `;
                    // Crea tarjetas de películas y las agrega al modal
                    for (const movie of movieList) {
                        const movieCard = createMovieCard(movie);
                        // console.log(movie) --->TESTEADOOOOOOO

                        searchResultModal
                            .querySelector(".grid-list")
                            .appendChild(movieCard);
                        // console.log(movieCard) --->TESTEADOOOOOOO
                    }
                }
            );
        }, 500);
    });
}