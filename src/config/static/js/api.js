"use strict"; //<-----garantiza prácticas de codificación más seguras y consistentes, por lo que se recomienda mantenerla en el proyecto para asegurar un comportamiento predecible y evitar errores potenciales.

//¡SI VAS A ELIMIMAR UN COMENTARIO, RECUERDA QUE PUEDE PERJUDICAR LA COMUNICACIÓN DE CÓDIGOS A TU OTROS COMPAÑEROS!

/**
 * API.JS
 * Proporciona credenciales únicas (clave de acceso) para acceder a la API de TMDb y establece una URL base para las imágenes de las películas. 
 * Además, define una función (fetchDataFromServer) que facilita la obtención de datos del servidor, 
 * permitiendo que un callback procese la respuesta JSON, y opcionalmente se le pueda pasar un parámetro adicional. 
 */


//------------------------------------------------------------------------------------------------------------------

// Clave de acceso única para TMDb, MEJOR DICHO LAS CREDENCIALES DEL SALM FREE
const api_key = "b57a7ab19ef652645e22e9e69e681448";

// URL base para imágenes de películas, IMPORTANTISIMO ESTO
const imageBaseURL = "https://image.tmdb.org/t/p/";

/**
 * fetch data from a server using the `url` and passes
 * the result in JSON data to a `callback` function,
 * along with an optional parameter if has `optionalParam`.
 * ESTOS ES UNOS EJEMPLOS
 */

const fetchDataFromServer = function(url, callback, optionalParam) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => callback(data, optionalParam));
};

// Exportamos nuestras herramientas para que otros archivos las utilicen
export { imageBaseURL, api_key, fetchDataFromServer };

//console(imageBaseURL, api_key) -----> FUNCIONANDOOOOO