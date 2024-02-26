"use strict"; //<-----garantiza prácticas de codificación más seguras y consistentes, por lo que se recomienda mantenerla en el proyecto para asegurar un comportamiento predecible y evitar errores potenciales.


//¡SI VAS A ELIMIMAR UN COMENTARIO, RECUERDA QUE PUEDE PERJUDICAR LA COMUNICACIÓN DE CÓDIGOS A TU OTROS COMPAÑEROS!


/**
 * Search.JS
 * define una función sidebar que crea y gestiona la barra lateral de un sitio web, obteniendo los géneros de películas desde la API de TMDb y generando enlaces correspondientes. 
 * También incluye lógica para alternar la barra lateral en dispositivos móviles.
 */



//-------------------------------------------------------------------------------------------------------------

// Importa herramientas esenciales desde archivos externos
import { api_key, fetchDataFromServer } from "/static/js/api.js";

// Objeto que almacenará los géneros de películas obtenidos de la API
export function sidebar() {
    const genreList = {};



    // Obtiene la lista de géneros desde la API de TMDb
    fetchDataFromServer(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
        function({ genres }) {
            // Almacena los géneros en el objeto genreList
            for (const { id, name }
                of genres) {
                genreList[id] = name;
            }
            // Llama a la función que crea los enlaces de géneros en la barra lateral
            genreLink();
        }
    );

    // Crea un elemento div para la barra lateral
    const sidebarInner = document.createElement("div");
    sidebarInner.classList.add("sidebar-inner");

    // Estructura HTML de la barra lateral
    sidebarInner.innerHTML = `
    <div class="sidebar-list">
      <p class="title">Genre</p>
    </div>
    <div class="sidebar-list">
      <p class="title">Language</p>

      <a href="/fronted/indexmovielist" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=en", "English")'>English</a>
      <a href="/fronted/indexmovielist" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=zh", "Mandarin")'>Mandarin</a>
      <a href="/fronted/indexmovielist" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=ms", "Malay")'>Malay</a>
      <a href="/fronted/indexmovielist" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=hi", "Hindi")'>Hindi</a>
      <a href="/fronted/indexmovielist" menu-close class="sidebar-link"
        onclick='getMovieList("with_original_language=es", "Spanish")'>Spanish</a>
    </div>



    <div class="sidebar-footer">
      <p class="copyright">
      Copyright © 2023 MondongoCorporation. Todos los derechos reservados.
        <a href="https://chat.whatsapp.com/JvMZHJN0ArB8Zt28npqomn" target="_blank">MondongoTEAM</a>
      </p>
      <img src="/static/assets/image/Cine-logo.png" width="130" height="17" alt="the movie database logo" />
    </div>
  `;

    // Función que crea los enlaces de géneros en la barra lateral
    const genreLink = function() {
        for (const [genreId, genreName] of Object.entries(genreList)) {
            const link = document.createElement("a");
            link.classList.add("sidebar-link");
            link.setAttribute("href", "/fronted/indexmovielist");
            link.setAttribute("menu-close", "");
            link.setAttribute(
                "onclick",
                `getMovieList("with_genres=${genreId}", "${genreName}")`
            );
            link.textContent = genreName;

            sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
        }
        // Agrega la barra lateral al documento y activa su funcionalidad de alternar
        const sidebar = document.querySelector("[sidebar]");
        sidebar.appendChild(sidebarInner);
        toggleSidebar(sidebar);
    };

    // Función que maneja la lógica de alternar la barra lateral en dispositivos móviles
    const toggleSidebar = function(sidebar) {
        // toggle sidebar in mobile screen // Elementos relacionados con la alternancia de la barra lateral en pantalla móvil
        const sidebarBtn = document.querySelector("[menu-btn]");
        const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
        const sidebarClose = document.querySelectorAll("[menu-close]");
        const overlay = document.querySelector("[overlay]");

        // Agrega eventos a los elementos de alternancia de la barra lateral
        addEventOnElements(sidebarTogglers, "click", function() {
            sidebar.classList.toggle("active");
            sidebarBtn.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        addEventOnElements(sidebarClose, "click", function() {
            sidebar.classList.remove("active");
            sidebarBtn.classList.remove("active");
            overlay.classList.remove("active");
        });
    };
}