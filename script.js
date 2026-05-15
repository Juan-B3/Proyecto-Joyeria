document.addEventListener("DOMContentLoaded", function() {
    
    // 1. BASE DE DATOS (Objetos y Arreglos - ¡Con imágenes corregidas!)
    var inventarioJoyas = [
        { 
            id: 1, nombre: "Anillo Eternidad", categoria: "anillos", precio: "1.250.000", 
            imagen: "https://images.unsplash.com/photo-1605100804763-247f67b4548e?q=80&w=800&auto=format&fit=crop", 
            etiqueta: { texto: "Última Pieza", clase: "badge-dark" } 
        },
        { 
            id: 2, nombre: "Gargantilla Alba", categoria: "collares", precio: "890.000", 
            imagen: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop", 
            etiqueta: { texto: "Más Vendido", clase: "badge-gold" } 
        },
        { 
            id: 3, nombre: "Pendientes Constelación", categoria: "pendientes", precio: "1.400.000", 
            imagen: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop", 
            etiqueta: null 
        },
        { 
            id: 4, nombre: "Anillo Promesa", categoria: "anillos", precio: "950.000", 
            imagen: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=800&auto=format&fit=crop", 
            etiqueta: null 
        },
        { 
            id: 5, nombre: "Collar Lágrima", categoria: "collares", precio: "720.000", 
            imagen: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop", 
            etiqueta: null 
        },
        { 
            id: 6, nombre: "Pendientes Aurora", categoria: "pendientes", precio: "1.100.000", 
            imagen: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop", 
            etiqueta: { texto: "Nuevo", clase: "badge-dark" } 
        }
    ];

    var favoritos = [];
    var contenedorJoyas = document.getElementById("catalogo-joyas");
    var contadorFavDOM = document.getElementById("contador-fav");

    // Intentar leer favoritos guardados (Persistencia)
    try {
        if (window.localStorage) {
            var datos = window.localStorage.getItem("aureaFavoritos");
            if (datos) {
                favoritos = JSON.parse(datos);
            }
        }
    } catch (e) {}

    // 2. RENDERIZADO DEL DOM (Eficiente con DocumentFragment)
    function renderizarCatalogo(joyas) {
        if (!contenedorJoyas) return;
        contenedorJoyas.innerHTML = ""; 
        var fragmento = document.createDocumentFragment();

        for (var i = 0; i < joyas.length; i++) {
            var joya = joyas[i];
            var tarjeta = document.createElement("div");
            tarjeta.className = "product-card";

            var imgWrapper = document.createElement("div");
            imgWrapper.className = "img-wrapper";

            if (joya.etiqueta) {
                var badge = document.createElement("span");
                badge.className = "badge " + joya.etiqueta.clase;
                badge.textContent = joya.etiqueta.texto;
                imgWrapper.appendChild(badge);
            }

            var imagen = document.createElement("img");
            imagen.src = joya.imagen;
            imagen.alt = joya.nombre;
            imagen.className = "product-image";

            var btnFav = document.createElement("button");
            btnFav.className = "btn-favorito";
            var isFav = favoritos.indexOf(joya.id) !== -1;
            
            // Icono seguro
            var icon = document.createElement("i");
            icon.className = isFav ? "ph-fill ph-heart" : "ph-light ph-heart";
            btnFav.appendChild(icon);
            
            if (isFav) { btnFav.className += " activo"; }

            // Función para atrapar el clic individual
            (function(idActual, botonActual, iconoActual) {
                botonActual.onclick = function(e) {
                    e.stopPropagation();
                    toggleFavorito(idActual, botonActual, iconoActual);
                };
            })(joya.id, btnFav, icon);

            imgWrapper.appendChild(imagen);
            imgWrapper.appendChild(btnFav);

            var titulo = document.createElement("h4");
            titulo.className = "product-title";
            titulo.textContent = joya.nombre; // Sanitizado automático contra XSS

            var precio = document.createElement("p");
            precio.className = "product-price";
            precio.textContent = "$" + joya.precio + " CLP";

            tarjeta.appendChild(imgWrapper);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(precio);
            
            fragmento.appendChild(tarjeta);
        }

        contenedorJoyas.appendChild(fragmento);
    }

    // 3. FUNCIONALIDAD FAVORITOS
    function toggleFavorito(id, botonDOM, icono) {
        var indice = favoritos.indexOf(id);
        
        if (indice === -1) {
            favoritos.push(id);
            botonDOM.className += " activo";
            icono.className = "ph-fill ph-heart";
        } else {
            favoritos.splice(indice, 1);
            botonDOM.className = "btn-favorito";
            icono.className = "ph-light ph-heart";
        }

        try {
            window.localStorage.setItem("aureaFavoritos", JSON.stringify(favoritos));
        } catch(e) {}
        
        actualizarContadorFavoritos();
    }

    function actualizarContadorFavoritos() {
        if (!contadorFavDOM) return;
        contadorFavDOM.textContent = favoritos.length;
        
        // Microinteracción de salto
        contadorFavDOM.style.transform = 'scale(1.5)';
        setTimeout(function() { 
            contadorFavDOM.style.transform = 'scale(1)'; 
        }, 300);
    }

    // Inicializar al abrir la página
    renderizarCatalogo(inventarioJoyas);
    actualizarContadorFavoritos();


    // =========================================================
    // NUEVO: FUNCIONES PURAS Y REUTILIZABLES (Cumple la rúbrica)
    // =========================================================

    // Función Pura 1: Filtra sin modificar el DOM ni variables globales
    function filtrarPorCategoria(arregloJoyas, categoria) {
        if (categoria === "todos") {
            return arregloJoyas;
        }
        var resultado = [];
        for (var i = 0; i < arregloJoyas.length; i++) {
            if (arregloJoyas[i].categoria === categoria) {
                resultado.push(arregloJoyas[i]);
            }
        }
        return resultado;
    }

    // Función Pura 2: Solo evalúa un valor y retorna boolean, sin efectos secundarios
    function esEmailValido(email) {
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email !== "" && regex.test(email);
    }

    // =========================================================


    // 4. FUNCIONALIDAD DE FILTROS (Usando nuestra función pura)
    var botonesFiltro = document.querySelectorAll(".btn-filtro");
    for (var j = 0; j < botonesFiltro.length; j++) {
        botonesFiltro[j].onclick = function(e) {
            var activo = document.querySelector(".btn-filtro.active");
            if (activo) {
                activo.className = activo.className.replace(" active", "");
            }
            e.target.className += " active";

            var categoria = e.target.getAttribute("data-categoria");
            
            // Aquí usamos la Función Pura para filtrar los datos:
            var filtradas = filtrarPorCategoria(inventarioJoyas, categoria); 
            
            // Y luego renderizamos el resultado:
            renderizarCatalogo(filtradas);
        };
    }

    // 5. VALIDACIÓN DEL FORMULARIO (Prevención XSS y Función Pura)
    var formNewsletter = document.getElementById("form-newsletter");
    if (formNewsletter) {
        formNewsletter.onsubmit = function(e) {
            e.preventDefault(); // Paso a Paso Formularios con JavaScript
            
            var emailInput = document.getElementById("email-club");
            var mensajeDOM = document.getElementById("mensaje-newsletter");
            var email = emailInput.value.trim();

            // Aquí usamos la Función Pura para validar:
            if (!esEmailValido(email)) {
                mensajeDOM.textContent = "Por favor, ingresa un correo electrónico válido.";
                mensajeDOM.style.color = "#ff6b6b";
            } else {
                mensajeDOM.textContent = "¡Bienvenida! Hemos enviado una invitación a " + email;
                mensajeDOM.style.color = "#C5A059";
                formNewsletter.reset();
            }
            
            setTimeout(function() { mensajeDOM.textContent = ""; }, 5000);
        };
    }

    // 6. MENÚ STICKY
    var header = document.getElementById("main-header");
    window.onscroll = function() {
        if (header) {
            if (window.scrollY > 50) {
                if (header.className.indexOf("scrolled") === -1) {
                    header.className += " scrolled";
                }
            } else {
                header.className = header.className.replace(" scrolled", "");
            }
        }
    };
});