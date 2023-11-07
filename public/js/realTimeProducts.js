/* global document, io */

const socket = io()
socket.emit('message', 'Comunicacion desde websocket')

//Funcion para captar el nuevo producto y enviarlo al servidor
const addProduct = () => {
    let product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        code: document.getElementById('code').value,
        stock: document.getElementById('stock').value,
        thumbnail: document.getElementById('thumbnail').value,
    }
    console.log(product)
    socket.emit('new-product', product)
    return false
}
//Funcion para borrar un producto segun su ID
const deleteProduct = () => {
    let id = document.getElementById('id2').value
    console.log(id)
    socket.emit('delete-product', id)
    return false
}

//Funcion para volver a renderizar los productos cuando obtenemos respuesta del servidor
socket.on('reRender-products', data => {
    console.log('Re render')
    let render = document.getElementById('realTimeProducts')
    let products = ''
    data.forEach(element => {
        products =
            products +
            `<div><span>Nombre: ${element.title} <span></br>
        <span>Descripcion: ${element.description}</span><br> 
        <span>ID: ${element._id}</span><hr></div>`
    })
    render.innerHTML = products
})
