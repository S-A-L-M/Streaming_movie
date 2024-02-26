"use strict"; //<-----garantiza prácticas de codificación más seguras y consistentes, por lo que se recomienda mantenerla en el proyecto para asegurar un comportamiento predecible y evitar errores potenciales.

//¡SI VAS A ELIMIMAR UN COMENTARIO, RECUERDA QUE PUEDE PERJUDICAR LA COMUNICACIÓN DE CÓDIGOS A TU OTROS COMPAÑEROS!

/** DETAILS
 * utiliza la API de TMDb para mostrar detalles de una película, incluyendo su póster, calificación, géneros, reparto, directores, trailers y películas sugeridas. 
 * También permite realizar búsquedas y almacena información localmente para mejorar la experiencia del usuario en la página web.
 */

//------------------------------------------------------------------------------------------------------------------

// Importa herramientas esenciales desde archivos externos
import { api_key, imageBaseURL, fetchDataFromServer } from "/static/js/api.js";
import { sidebar } from "/static/js/sidebar.js";
import { createMovieCard } from "/static/js/movie-card.js";
import { search } from "/static/js/search.js";


// Obtiene el ID de la película almacenado localmente y selecciona el elemento de contenido de la página
/**
 * Depuración FINO
 * console.log("movieId") --->TESTADA Y FUNCIONANDO
 * console.log("page-content") --->TESTADA Y FUNCIONANDO
 */
const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

// Llama a la función que crea y muestra la barra lateral
sidebar();

// Función para obtener una lista de géneros formateada
const getGenres = function(genreList) {
    const newGenreList = [];

    for (const { name }
        of genreList) newGenreList.push(name);

    return newGenreList.join(", ");
};

// Función para obtener una lista de actores formateada
const getCasts = function(castList) {
    const newCastList = [];

    for (let i = 0, len = castList.length; i < len && i < 10; i++) {
        const { name } = castList[i];
        newCastList.push(name);
    }

    return newCastList.join(", ");
};

// Función para obtener una lista de directores formateada
const getDirectors = function(crewList) {
    const directors = crewList.filter(({ job }) => job === "Director");

    const directorList = [];
    for (const { name }
        of directors) directorList.push(name);

    return directorList.join(", ");
};

// returns only trailers and teasers as array // Función para filtrar solo videos de tipo "Trailer" o "Teaser" desde YouTube // Función para filtrar solo videos de tipo "Trailer" o "Teaser" desde YouTube
const filterVideos = function(videoList) {
    return videoList.filter(
        ({ type, site }) =>
        (type === "Trailer" || type === "Teaser") && site === "YouTube"
    );
};

// Realiza una solicitud a la API de TMDb para obtener detalles de la película
fetchDataFromServer(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
    // eSTAS Son respuestas que obtengo del Postman y luego las extraemos
    function(movie) {
        const {
            backdrop_path,
            poster_path,
            title,
            release_date,
            runtime,
            vote_average,
            releases: {
                countries: [{ certification } = { certification: "N/A" }],
            },
            genres,
            overview,
            casts: { cast, crew },
            videos: { results: videos },
        } = movie;
        // título de la página
        document.title = `${title} - Tvflix`;

        // nuevo elemento para mostrar los detalles de la película
        const movieDetail = document.createElement("div");
        movieDetail.classList.add("movie-detail");

        // Estructura de la información de la película dentro del elemento creado(Igual al ejemplo de william con la pokeAPI)
        movieDetail.innerHTML = `
       
    <div class="backdrop-image" style="background-image: url('${imageBaseURL}${
      "w1280" || "original"
    }${backdrop_path || poster_path}')"></div>
    
    <figure class="poster-box movie-poster">
    
      <img src="${imageBaseURL}w342${poster_path}" alt="${title} poster" class="img-cover">
    </figure>
    <button id="Play" class="Play" onclick="" style="display: none;"> 
    <i class="fas fa-circle-play"></i> 
</button>
   
    <div id="Loading" class="detail-box">
    
    
      <div class="detail-content">
        <h1 class="heading">${title}</h1>
    
        <div class="meta-list">
    
          <div class="meta-item">
            <img src="/static/assets/image/star.png" width="20" height="20" alt="rating">
    
            <span class="span">${vote_average.toFixed(1)}</span>
          </div>
    
          <div class="separator"></div>
    
          <div class="meta-item">${runtime}m</div>
    
          <div class="separator"></div>
    
          <div class="meta-item">${
            release_date?.split("-")[0] ?? "Not Released"
          }</div>
    
          <div class="meta-item card-badge">${certification}</div>
    
        </div>
    
        <p class="genre">${getGenres(genres)}</p>
    
        <p class="overview">${overview}</p>
    
        <ul class="detail-list">
    
          <div class="list-item">
            <p class="list-name">Starring</p>
    
            <p>${getCasts(cast)}</p>
          </div>
    
          <div class="list-item">
            <p class="list-name">Directed By</p>
    
            <p>${getDirectors(crew)}</p>
          </div>

          <button href="/fronted/indexlogin" class="sign-in-btn">Watch Preview</button>
          <div id="alert-content" class="alert-content" style="display: none;">
            <h4>Oops! The movie is not available yet, we will let you know. We hope you enjoy it soon!</h1>
            </div>
       
          
      </div>
      <div class="title-wrapper">
        <h3 class="title-large">Trailers and Clips</h3>
      </div>
    
      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    
    </div>
  `;



        /***
         * Método del Axios para Cargar la pelicula, de lo contrario una carga y un mensaje
         */
        function checkMovieIdAndUpdateButton() {
            const movieId = window.localStorage.getItem("movieId");
            const button = document.getElementById("Play");
            const alertcontent = document.getElementById("alert-content");

            if (movieId && button && alertcontent) {
                try {
                    axios.post('/fronted/getmovieurl', { moviid: movieId })
                        .then(response => {
                            const { status, url, exists } = response.data;

                            if (status === 'success' && url && exists) {
                                // Si el movieId existe en la base de datos, muestra el botón
                                showButton(button, alertcontent);
                            } else {
                                // Si el movieId no existe, oculta el botón
                                hideButton(button);
                            }
                        })
                        .catch(error => {
                            // Si hay un error, oculta el botón
                            hideButton(button, alertcontent);
                            console.error('Error al verificar el movieId', error);
                        });
                } catch (error) {
                    // Si hay un error, oculta el botón
                    hideButton(button, alertcontent);
                    // console.error('Error al verificar el movieId', error);
                }
            } else if (button && alertcontent) {
                // Si no hay un movieId en el localStorage, oculta el botón
                hideButton(button, alertcontent);
            }

            // Obtener el tipo de conexión
            const connectionType = navigator.connection.effectiveType || '4g';

            // Ajustar el tiempo de espera según el tipo de conexión
            let timeoutDuration;

            switch (connectionType) {
                case 'slow-2g':
                case '2g':
                    timeoutDuration = 5000; // 5 segundos para conexiones 2G
                    break;
                case '3g':
                    timeoutDuration = 3000; // 3 segundos para conexiones 3G
                    break;
                case '4g':
                case '5g':
                    timeoutDuration = 2000; // 2 segundos para conexiones 4G y 5G
                    break;
                default:
                    timeoutDuration = 100; // Valor predeterminado
            }

            // Vuelve a llamar a la función en el próximo ciclo de animación
            setTimeout(() => requestAnimationFrame(checkMovieIdAndUpdateButton), timeoutDuration);
        }

        // Llama a la función por primera vez
        checkMovieIdAndUpdateButton();



        // Función para mostrar el botón
        function showButton(button, alertcontent) {
            button.style.display = "block";
            alertcontent.style.display = "none";

            // console.log('Mostrar botón');<---TESTEADO

            // Agrega un evento de clic al botón
            button.addEventListener("click", function() {
                const movieId = window.localStorage.getItem("movieId");

                // Llama a la función para obtener la URL de la película desde el servidor
                getMovieUrl(movieId);
            });
        }

        // Función para ocultar el botón
        function hideButton(button, alertcontent) {
            button.style.display = "none";
            alertcontent.style.display = "block";
        }
        // console.log('Ocultar botón');<---TESTEADO

        // Función para obtener la URL de la película desde el servidor
        function getMovieUrl(movieId) {
            // Realiza la solicitud al servidor para obtener la URL
            axios.post('/fronted/getmovieurl', { moviid: movieId })
                .then(function(response) {
                    // Si la respuesta del servidor es exitosa, obtenemos la URL
                    const { url } = response.data;

                    if (url) {
                        // Abre una nueva pestaña con la URL
                        window.open(url, '_blank');
                    } else {
                        // Log de error en la consola
                        console.error('No se encontró la URL de la película');
                    }
                })
                .catch(function(error) {
                    // Manejar errores de la solicitud al servidor
                    console.error('Error al obtener la URL de la película', error);
                });
        }



        // Añade los elementos de video al detalle de la película
        for (const { key, name }
            of filterVideos(videos)) {
            const videoCard = document.createElement("div");
            videoCard.classList.add("video-card");

            videoCard.innerHTML = `
      <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
        frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
    `;

            movieDetail.querySelector(".slider-inner").appendChild(videoCard);
        }

        // Añade el detalle de la película a la página
        pageContent.appendChild(movieDetail);

        // Realiza una solicitud para obtener recomendaciones de películas
        fetchDataFromServer(
            `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
            addSuggestedMovies
        );
    }
);

// Función para agregar películas sugeridas a la página
const addSuggestedMovies = function({ results: movieList }, title) {
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.ariaLabel = "You May Also Like"; //Aquí un texto pero se modificaaaaa

    movieListElem.innerHTML = `
      <div class="title-wrapper">
        <h3 class="title-large">You May Also Like</h3>
      </div>
      
      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    `;
    // Añade películas sugeridas a la lista
    for (const movie of movieList) {
        const movieCard = createMovieCard(movie); // called from movie_card.js

        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);
};

search();