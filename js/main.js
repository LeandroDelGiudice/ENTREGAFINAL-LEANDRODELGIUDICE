let productos = [];
let productosEnCarrito = [];

// Elementos del DOM

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
const numerito = document.querySelector("#numero");
const openMenu = document.querySelector("#open-menu");
const closeMenu = document.querySelector("#close-menu");
const aside = document.querySelector("aside");

// Función para cargar productos desde un archivo JSON, uso de fetch (api local)

function cargarProductosDesdeJSON() {
    fetch("./js/productos.json")
        .then(response => response.json())
        .then(data => {
            productos = data;
            cargarProductos(productos);
        });
}

// Función para cargar productos en la página

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" data-id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.appendChild(div);
    });

    actualizarBotonesAgregar();
}

// Función para actualizar botones "Agregar" en productos

function actualizarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

// Función para agregar un producto al carrito

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.getAttribute("data-id");
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    mostrarMensajeToast("Repuesto agregado");
    actualizarNumero();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Función para mostrar un mensaje de Toastify

function mostrarMensajeToast(mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function () { }
    }).showToast();
}

// Función para actualizar el número en el carrito

function actualizarNumero() {
    let nuevoNumero = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumero;
}

// Evento para abrir el menú lateral

openMenu.addEventListener("click", () => {
    aside.classList.add("aside-visible");
});

// Evento para cerrar el menú lateral

closeMenu.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
});

// Evento para filtrar productos por categoría

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id !== "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = e.currentTarget.textContent;
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

// Cargar productos desde el archivo JSON al cargar la página

cargarProductosDesdeJSON();

// Cargar productos del carrito almacenados en localStorage

function cargarProductosEnCarrito() {
    const productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
    if (productosEnCarritoLS) {
        productosEnCarrito = JSON.parse(productosEnCarritoLS);
        actualizarNumero();
    }
}

cargarProductosEnCarrito();

// se uso togglemenu y eventlistener para el menu 

const toggleMenu = document.querySelector("#toggle-menu");
toggleMenu.addEventListener("click", () => {
    aside.classList.toggle("aside-visible");
});