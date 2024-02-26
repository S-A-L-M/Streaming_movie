"use strict"; //<-----garantiza prácticas de codificación más seguras y consistentes, por lo que se recomienda mantenerla en el proyecto para asegurar un comportamiento predecible y evitar errores potenciales.

//¡SI VAS A ELIMIMAR UN COMENTARIO, RECUERDA QUE PUEDE PERJUDICAR LA COMUNICACIÓN DE CÓDIGOS A TU OTROS COMPAÑEROS!



/**
 * Movier-card.js
 * Este código se encarga de crear tarjetas de películas (movie-card). Comienza importando una herramienta esencial desde un archivo externo (api.js) 
 * y utiliza la URL base de imágenes. Luego, exporta una función llamada createMovieCard que toma un objeto de película como parámetro. 
 * La función crea dinámicamente la estructura HTML de una tarjeta de película, utilizando la información proporcionada, como la ruta del póster, el título, la calificación, la fecha de lanzamiento y el ID de la película. 
 * La tarjeta resultante contiene la imagen del póster, el título, la calificación, el año de lanzamiento y un enlace a la página de detalles de la película. 
 * Esta función es útil para generar tarjetas de películas de manera eficiente y consistente en la interfaz de usuario.
 */

//-----------------------------------------------------------------------------------------------------------------------

// Importa herramientas esenciales desde archivos externos
import { imageBaseURL } from "/static/js/api.js";

// movie card
// Función para crear tarjetas de películas
export function createMovieCard(movie) {
    // Extraer información importante de la película
    const { poster_path, title, vote_average, release_date, id } = movie; //---> puedes imprimirlo con un  console o verlo en el postman

    // Crear un elemento div para la tarjeta de la película
    const card = document.createElement("div");
    card.classList.add("movie-card");


    // Estructura HTML de la tarjeta de la película
    card.innerHTML = `
    <figure class="poster-box card-banner">
      <img src="${imageBaseURL}w342${poster_path}" alt="${title}" class="img-cover" loading="lazy">
    </figure>
    
    <h4 class="title">${title}</h4>
    
    <div class="meta-list">
      <div class="meta-item">
        <img src="/static/assets/image/star.png" width="20" height="20" loading="lazy" alt="rating">
    
        <span class="span">${vote_average.toFixed(1)}</span>
      </div>
    
      <div class="card-badge">${release_date.split("-")[0]}</div>
    </div>
    
    <a href="/fronted/indexdetails" class="card-btn" title="${title}" onclick="getMovieDetail(${id})"></a>
  `;

    return card;
}