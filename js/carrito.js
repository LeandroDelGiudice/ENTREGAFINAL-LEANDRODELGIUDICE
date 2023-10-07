//evento que comienza cuando se carga la pagina html y declara las variables

document.addEventListener("DOMContentLoaded", function () {
    const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
    const contenedorCarritoProductos = document.querySelector("#carrito-productos");
    const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
    const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
    const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
    const contenedorTotal = document.querySelector("#total");
    const botonComprar = document.querySelector("#carrito-acciones-comprar");

    let productosEnCarrito = obtenerProductosEnCarrito();

    // funciones que obtienen y cargan los productos al carrito

    function obtenerProductosEnCarrito() {
        const productosGuardados = localStorage.getItem("productos-en-carrito");
        return productosGuardados ? JSON.parse(productosGuardados) : [];
    }

    function guardarProductosEnCarrito(productos) {
        localStorage.setItem("productos-en-carrito", JSON.stringify(productos));
    }

    // uso de Libreria Toastify

    function mostrarMensajeToast(mensaje) {
        Toastify({
            text: mensaje,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
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
        }).sho
        wToast();
    }
    // carga los productos al carrito y calcula los totales

    function cargarProductosCarrito() {
        if (productosEnCarrito.length > 0) {
            contenedorCarritoVacio.classList.add("disabled");
            contenedorCarritoProductos.classList.remove("disabled");
            contenedorCarritoAcciones.classList.remove("disabled");
            contenedorCarritoComprado.classList.add("disabled");

            contenedorCarritoProductos.innerHTML = "";

            productosEnCarrito.forEach(producto => {
                const div = document.createElement("div");
                div.classList.add("carrito-producto");
                div.innerHTML = `
                    
                    <div class="carrito-producto-titulo">
                        <small>Título</small>
                        <h3>${producto.titulo}</h3>
                    </div>
                    <div class="carrito-producto-cantidad">
                        <small>Cantidad</small>
                        <p>${producto.cantidad}</p>
                    </div>
                    <div class="carrito-producto-precio">
                        <small>Precio</small>
                        <p>$${producto.precio}</p>
                    </div>
                    <div class="carrito-producto-subtotal">
                        <small>Subtotal</small>
                        <p>$${producto.precio * producto.cantidad}</p>
                    </div>
                    <button class="carrito-producto-eliminar" data-id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
                `;

                contenedorCarritoProductos.appendChild(div);
            });

            actualizarBotonesEliminar();
            actualizarTotal();
        } else {
            contenedorCarritoVacio.classList.remove("disabled");
            contenedorCarritoProductos.classList.add("disabled");
            contenedorCarritoAcciones.classList.add("disabled");
            contenedorCarritoComprado.classList.add("disabled");
        }
    }

    // espera el evento click para quitar del carrito

    function actualizarBotonesEliminar() {
        const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

        botonesEliminar.forEach(boton => {
            boton.addEventListener("click", eliminarDelCarrito);
        });
    }
    // elimina el producto y actualiza el localStorage
    function eliminarDelCarrito(e) {
        const idBoton = e.currentTarget.getAttribute("data-id");
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

        if (index !== -1) {
            productosEnCarrito.splice(index, 1);
            guardarProductosEnCarrito(productosEnCarrito);
            cargarProductosCarrito();
            mostrarMensajeToast("Repuesto eliminado");
        }
    }
    botonVaciar.addEventListener("click", vaciarCarrito);

    // solicita confirmacion al vaciar el carrito, usa sweet alert

    function vaciarCarrito() {
        Swal.fire({
            title: '¿Confirma vaciar el carrito',
            icon: 'question',
            html: `Se eliminaran ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} repuestos`,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                productosEnCarrito.length = 0;
                guardarProductosEnCarrito(productosEnCarrito);
                cargarProductosCarrito();
            }
        });
    }

    //funcion que actualiza el total y lo muestra en el html

    function actualizarTotal() {
        const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        contenedorTotal.innerText = `$${totalCalculado}`;
    }

    botonComprar.addEventListener("click", comprarCarrito);

    // funcion que se ejecuta luego de hacer click en el boton comprar simula la compra y vacia el carrito

    function comprarCarrito() {
        productosEnCarrito.length = 0;
        guardarProductosEnCarrito(productosEnCarrito);

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.remove("disabled");
    }
    
    // llama a la funcion de carga de productos al carrito
    cargarProductosCarrito();
});