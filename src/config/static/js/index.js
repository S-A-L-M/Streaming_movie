"use strict"; //<-----garantiza prácticas de codificación más seguras y consistentes, por lo que se recomienda mantenerla en el proyecto para asegurar un comportamiento predecible y evitar errores potenciales.

//¡SI VAS A ELIMIMAR UN COMENTARIO, RECUERDA QUE PUEDE PERJUDICAR LA COMUNICACIÓN DE CÓDIGOS A TU OTROS COMPAÑEROS!

/**
 * INDEX.JS
 * Este código establece prácticas seguras con "use strict", facilita la manipulación de eventos, permite alternar la visibilidad de la caja de búsqueda en dispositivos móviles 
 * y gestiona el almacenamiento local de datos, como el ID de película y parámetros de URL. 
 * Incluye comentarios para depuración y pruebas.
 */


//Importamos funciones y variables desde otros archivos

import { sidebar } from "/static/js/sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "/static/js/api.js";
import { createMovieCard } from "/static/js/movie-card.js";
import { search } from "/static/js/search.js";


// alert("WORKIN") AL FIN FUNCIONA ESA TRASH
/*
/*Seleccionamos el elemento del contenido de la página
*/
const pageContent = document.querySelector("[page-content]");


/*
/*Llamamos la fución para crear la berra lateral
*/
sidebar();


/*
/* Define las secciones de la página de inicio (Películas mejor calificadas, Próximas, Películas de tendencia semanal)
*/
// Home page sections (Top rated, Upcoming, Trending movies)
const homePageSections = [{
        title: "Upcoming Movies",
        path: "/movie/upcoming",
    },
    {
        title: "Weekly Trending Movies",
        path: "/trending/movie/week",
    },
    {
        title: "Top Rated Movies",
        path: "/movie/top_rated",
    },
    {
        title: "Now Playing",
        path: "/movie/now_playing",
    },
    {
        title: "Popular Movies",
        path: "/movie/popular",
    },


    // Puedes seguir agregando más secciones según las categorías disponibles en la API
];


/*
/* D Convierte la lista de IDs de género en una cadena de géneros, aquí un ejemplo abajo
*/
// fetch all genre then change genre format
// [ { "id": "123", "name": "Action" } ] --> { 123: "Action" }

const genreList = {
    // create genre string from genre_id eg: [23, 43] -> "Action, Romance".
    asString(genreIdList) {
        let newGenreList = [];

        for (const genreId of genreIdList) {
            this[genreId] && newGenreList.push(this[genreId]); // this == genreList;
        }

        return newGenreList.join(", ");
    },
};

/*
/* O Obtiene la lista de géneros desde el servidor y luego llama a la función heroBanner
*/
fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
    function({ genres }) {
        for (const { id, name }
            of genres) {
            genreList[id] = name;
        }

        fetchDataFromServer(
            `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
            heroBanner
        );
    }
);

/*
/*  F unción para manejar la sección del banner principal
*/
// HERO BANNER
const heroBanner = function({ results: movieList }) {
    // cc Crea un elemento de sección para el banner 
    const banner = document.createElement("section");
    banner.classList.add("banner");
    banner.ariaLabel = "Popular Movies";
    // e Estructura HTML del banner
    banner.innerHTML = `
      <div class="banner-slider"></div>
      
      <div class="slider-control">
        <div class="control-inner"></div>
      </div>
    `;

    let controlItemIndex = 0;

    /*
    /*  Itera sobre la lista de películas para crear elementos de diapositivas y controles
    */

    for (const [index, movie] of movieList.entries()) {
        const {
            backdrop_path,
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id,
        } = movie;


        /*
        /*  Crea un elemento de diapositiva
        */
        const sliderItem = document.createElement("div");
        sliderItem.classList.add("slider-item");
        sliderItem.setAttribute("slider-item", "");


        /*
        /*  Estructura HTML de la diapositiva
        */

        sliderItem.innerHTML = `
        <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" loading=${
      index === 0 ? "eager" : "lazy"
    }>
        
        <div class="banner-content">
        
          <h2 class="heading">${title}</h2>
        
          <div class="meta-list">
            <div class="meta-item">${
              release_date?.split("-")[0] ?? "Not Released"
            }</div>
        
            <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
          </div>
        
          <p class="genre">${genreList.asString(genre_ids)}</p>
        
          <p class="banner-text">${overview}</p>
        
          <a href="/fronted/indexdetails" class="btn" onclick="getMovieDetail(${id})">
            <img src="/static/assets/image/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
        
            <span class="span">Watch Now</span>
          </a>
        
        </div>
      `;

        /*
        /*  Agrega la diapositiva al banner
        */


        banner.querySelector(".banner-slider").appendChild(sliderItem);


        /*
        /*  Crea un elemento de control
        */

        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box", "slider-item");
        controlItem.setAttribute("slider-control", `${controlItemIndex}`);

        controlItemIndex++;


        /*
        /*  Estructura HTML del control
        */

        controlItem.innerHTML = `
        <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
      `;

        /*
        /*  Agrega el control al banner
        */

        banner.querySelector(".control-inner").appendChild(controlItem);
    }

    /*
    /*  Agrega el banner al contenido de la página
    */
    pageContent.appendChild(banner);

    /*
    /*  Inicia la funcionalidad del deslizador
    */
    addHeroSlide();


   

    /*
    /*  Obtiene datos para las secciones de la página de inicio (mejor calificadas, próximas, de tendencia)
    for (const { title, path } of homePageSections) {
    */
    // fetch data for home page sections (top rated, upcoming, trending)
    for (const { title, path }
        of homePageSections) {
        fetchDataFromServer(
            `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`,
            createMovieList,
            title
        );
    }
};


/*
/*  Función para agregar funcionalidad al deslizador del banner principal
*/
// HERO SLIDER
const addHeroSlide = function() {
    const sliderItems = document.querySelectorAll("[slider-item]");
    const sliderControls = document.querySelectorAll("[slider-control]");

    let lastSliderItem = sliderItems[0];
    let lastSliderControl = sliderControls[0];

    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");
    //Activa la primera diapositiva
    //activating the first movie slide

    const sliderStart = function() {
        lastSliderItem.classList.remove("active");
        lastSliderControl.classList.remove("active");

        // `this` == slider-control se refiere al control del deslizador
        sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
            "active"
        );
        this.classList.add("active");

        lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
        lastSliderControl = this;
    };
    // Agrega eventos a los controles del deslizador
    addEventOnElements(sliderControls, "click", sliderStart);
};
/*
/*  Función para crear una lista de películas y agregarla al contenido de la página
*/
const createMovieList = function({ results: movieList }, title) {
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.ariaLabel = `${title}`;

    movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
    </div>
    
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>
  `;


    /*
    /*  Itera sobre la lista de películas para crear tarjetas de películas y agregarlas al deslizador
    */
    for (const movie of movieList) {
        const movieCard = createMovieCard(movie); // called from movie_card.js

        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    }
    // Agrega la lista de películas al contenido de la página 
    pageContent.appendChild(movieListElem);
};
// Llama a la función de búsqueda para configurar la funcionalidad de búsqueda
search();


document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('logout-btn').addEventListener('click', function(event) {
      event.preventDefault();
      
      // Obtener el token del almacenamiento local
      const token = localStorage.getItem('token');
      
      // Verificar si se encontró un token
      if (token) {
          axios.post('logout', {}, {
              headers: {
                  Authorization: `Bearer ${token}` // Adjuntar el token en el encabezado de autorización
              }
          })
          .then(function(response) {
              // Eliminar el token del almacenamiento local
              localStorage.removeItem('token');
              // Eliminar el username del almacenamiento local
              localStorage.removeItem('user_id');
              // Redirigir al usuario a la página principal
              window.location.href = '/fronted/indexregistromain';
          })
          .catch(function(error) {
              // Manejar errores aquí
              console.error('Error al cerrar sesión:', error);
          });
      } else {
          console.error('No se encontró un token en el almacenamiento local');
      }
  });
});