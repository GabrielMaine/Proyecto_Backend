/* global document, io */

function addToCart(e, productId) {
    e.preventDefault()

    // Obtener el formulario y la URL de la acción
    let form = document.getElementById('addToCartForm_' + productId)
    let action = form.getAttribute('action')
    let formResult = document.getElementById('info_' + productId)
    formResult.innerHTML = ''

    // Enviar la solicitud utilizando fetch
    fetch(action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
        .then(response => {
            if (response.ok) {
                formResult.innerHTML = 'Se ha añadido una unidad con éxito a su carrito'
            } else {
                formResult.innerHTML = 'Ocurrio un error, por favor intentelo mas tarde'
            }
        })
        .catch(error => {
            formResult.innerHTML = 'Ocurrio un error, por favor intentelo mas tarde'
        })
}
