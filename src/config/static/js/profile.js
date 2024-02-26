document.getElementById('profileImageInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        document.getElementById('profileImage').src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// 
// *Procedimiento para llevar a cabo el adaptador de textos*
//
// *Procedimiento para llevar a cabo el adaptador de textos*
document.addEventListener("DOMContentLoaded", function() {
    const tabContents = document.querySelectorAll(".tab-content .tab-pane");
    const tabLinks = document.querySelectorAll(".tab-link");

    // Mostrar solo el contenido de la primera pestaña al cargar la página
    tabContents.forEach(function(content, index) {
        if (index === 0) {
            content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    });

    tabLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const tabId = this.getAttribute("href");

            // Ocultar todos los contenidos
            tabContents.forEach(function(content) {
                content.style.display = "none";
            });

            // Mostrar el contenido correspondiente a la pestaña
            const tabContent = document.querySelector(tabId);
            if (tabContent) {
                tabContent.style.display = "block";
            }

            // Cambiar la clase 'active' a la pestaña clicada y removerla de las otras
            tabLinks.forEach(function(otherLink) {
                if (otherLink === link) {
                    otherLink.classList.add("active");
                } else {
                    otherLink.classList.remove("active");
                }
            });
        });
    });
});


function Mondongo() {
    alert("Funcionando el boton")
}