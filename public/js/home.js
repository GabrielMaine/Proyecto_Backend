/* global document, io */

const socket = io()
socket.emit('message', 'Comunicacion desde websocket')

const prevPage = () => {
    let currentPage = parseInt(document.getElementById('currentPage').innerHTML)
    console.log(currentPage)
    let previousPage = currentPage - 1
    console.log(previousPage)
    socket.emit('change-page', previousPage)
    return false
}

const nextPage = () => {
    let currentPage = parseInt(document.getElementById('currentPage').innerHTML)
    console.log(currentPage)
    let nextPage = currentPage + 1
    console.log(nextPage)
    socket.emit('change-page', nextPage)
    return false
}

//Funcion para volver a renderizar los productos cuando obtenemos respuesta del servidor
socket.on('reRender-page', data => {
    console.log('Re render')
    let render = document.getElementById('pageRender')
    let page = `<h2>Página <span id='currentPage'>${data.page}</span> de ${data.totalPages}</h2>`
    data.payload.forEach(element => {
        page =
            page +
            `<div>
            <span>Producto:${element.title}</span><br>
            <span>ID:${element._id}</span><br>
            <span>Precio:${element.price}</span><br>
            <span>Descripcion:${element.description}</span><br>
            <button>Agregar al carrito</button><hr>
            </div>`
    })
    if (data.hasPrevPage) {
        page = page + '<button onclick=\'return prevPage(this)\'>Pagina anterior</button>'
    }
    if (data.hasNextPage) {
        page = page + '<button onclick=\'return nextPage(this)\'>Pagina siguiente</button>'
    }
    render.innerHTML = page
})
