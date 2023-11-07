'use strict'
/* global document, io */

const socket = io()
socket.emit('message', 'Comunicacion desde websocket')

const getMessage = () => {
    let message = {
        user: document.getElementById('e-mail').value,
        message: document.getElementById('message').value,
    }
    console.log(message)
    socket.emit('new-message', message)
    return false
}

socket.on('reRender-chat', data => {
    let render = document.getElementById('chat')
    render.innerHTML = '<span>Mensaje enviado!</span>'
})
