class Carrito {

  
    comprarProducto(e){
        e.preventDefault();

        if(e.target.classList.contains('agregar-carrito')){
            const producto = e.target.parentElement.parentElement;
  
            this.leerDatosProducto(producto);
        }
    }

    
    leerDatosProducto(producto){
        const infoProducto = {
            imagen : producto.querySelector('img').src,
            titulo: producto.querySelector('h3').textContent,
            precio: producto.querySelector('.precio span').textContent,
            id: producto.querySelector('button').getAttribute('data-id'),
            cantidad: 1
        }
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (productoLS){
            if(productoLS.id === infoProducto.id){
                productosLS = productoLS.id;
            }
        });

        if(productosLS === infoProducto.id){
            Swal.fire({

            })
        }
        else {
            this.insertarCarrito(infoProducto);
        }
        
    }

   
    insertarCarrito(producto){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=80>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <button href="#" class="borrar-producto fas fa-times-circle button2" data-id="${producto.id}"></button>
            </td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);

    }

   
    eliminarProducto(e){
        e.preventDefault();
        let producto, productoID;
        if(e.target.classList.contains('borrar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('button').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();

    }

   
    vaciarCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLocalStorage();

        return false;
    }

     
    guardarProductosLocalStorage(producto){
        let productos;

        productos = this.obtenerProductosLocalStorage();
       
        productos.push(producto);
        
        localStorage.setItem('productos', JSON.stringify(productos));
    }

  
    obtenerProductosLocalStorage(){
        let productoLS;

      
        if(localStorage.getItem('productos') === null){
            productoLS = [];
        }
        else {
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }

   
    leerLocalStorage(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
           
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
                </td>
            `;
            listaProductos.appendChild(row);
        });
    }

   
    eliminarProductoLocalStorage(productoID){
        let productosLS;
    
        productosLS = this.obtenerProductosLocalStorage();

        productosLS.forEach(function(productoLS, index){
            if(productoLS.id === productoID){
                productosLS.splice(index, 1);
            }
        });

        //Añadimos el arreglo actual al LS
        localStorage.setItem('productos', JSON.stringify(productosLS));
    }

    compraCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLocalStorage();

        return false;
    }

    vaciarLocalStorage(){
        localStorage.clear();
    }


    calcularTotal(){
        let productosLS;
        let total = 0;
        productosLS = this.obtenerProductosLocalStorage();
        for(let i = 0; i < productosLS.length; i++){
            let element = Number(productosLS[i].precio * productosLS[i].cantidad);
            total = total + element;
            
        }

        document.getElementById('total').value = "$ " + total.toFixed(2);
 
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, producto, productosLS;
        if (e.target.classList.contains('cantidad')) {
            producto = e.target.parentElement.parentElement;
            id = producto.querySelector('a').getAttribute('data-id');
            cantidad = producto.querySelector('input').value;
            let actualizarMontos = document.querySelectorAll('#subtotales');
            productosLS = this.obtenerProductosLocalStorage();
            productosLS.forEach(function (productoLS, index) {
                if (productoLS.id === id) {
                    productoLS.cantidad = cantidad;                    
                    actualizarMontos[index].innerHTML = Number(cantidad * productosLS[index].precio);
                }    
            });
            localStorage.setItem('productos', JSON.stringify(productosLS));
            
        }
        else {
            console.log("click afuera");
        }
    }
}

const carro = new Carrito();
const carrito = document.getElementById('carrito');
const productos = document.getElementById('lista-productos');
const listaProductos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const procesarPedidoBtn = document.getElementById('procesar-pedido');
const compraCarritoBtn = document.getElementById('compraCarrito');
const pagarCarritoBtn = document.getElementById('pagar-carrito');

cargarEventos();

function cargarEventos(){
    if (productos != null){
        productos.addEventListener('click', (e)=>{carro.comprarProducto(e)});
    }
    //Se ejecuta cuando se presionar agregar carrito
    // productos.addEventListener('click', (e)=>{carro.comprarProducto(e)});
    if (carrito != null){
        carrito.addEventListener('click', (e)=>{carro.eliminarProducto(e)});
    }
    //Cuando se elimina productos del carrito
    // carrito.addEventListener('click', (e)=>{carro.eliminarProducto(e)});
    if (vaciarCarritoBtn != null){
        vaciarCarritoBtn.addEventListener('click', (e)=>{carro.vaciarCarrito(e)});
    }
    //Al vaciar carrito
    // vaciarCarritoBtn.addEventListener('click', (e)=>{carro.vaciarCarrito(e)});
    if (pagarCarritoBtn != null){
        pagarCarritoBtn.addEventListener('click', ()=>{carro.vaciarLocalStorage()});
    }
    //Al cargar documento se muestra lo almacenado en LS
    document.addEventListener('DOMContentLoaded', carro.leerLocalStorage());

    // //Enviar pedido a otra pagina
    // procesarPedidoBtn.addEventListener('click', (e)=>{carro.eliminarProducto(e)});
    if (compraCarritoBtn != null){
        compraCarritoBtn.addEventListener('click', (e)=>{carro.vaciarCarrito(e)});
    }
    // compraCarritoBtn.addEventListener('click', (e)=>{carro.vaciarCarrito(e)});
}
