/* global document, window, location */

function purchase(e, cartId) {
    e.preventDefault()

    // Obtener el formulario y la URL de la acción
    let form = document.getElementById('purchase_' + cartId)
    let action = form.getAttribute('action')
    let prePurchase = document.getElementById('prePurchase')
    let postPurchase = document.getElementById('postPurchase')

    // Enviar la solicitud utilizando fetch
    fetch(action, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.status === 200) {
                return response.json() // Parse the JSON in the response
            } else {
                if (response.status === 400)
                    throw new Error(
                        'De momento no tenemos suficiente stock para cubrir su compra, por favor intentelo mas tarde'
                    )
                throw new Error('Ocurrio un error, por favor intentelo mas tarde')
            }
        })
        .then(data => {
            let ticket = data.payload.ticket
            let boughtItems = data.payload.boughtItems
            let cart = data.payload.cart
            let info = '<h2>Compra finalizada</h2>'

            if (cart.products.length > 0) {
                info += '<hr><h3>Los siguientes items no pudieron comprarse por falta de stock</h3>'
                cart.products.forEach(e => {
                    info += `<span>${e.product.title} x ${e.quantity}</span><br>`
                })
            }

            info += '<hr><h3>Usted compro los siguientes productos</h3>'
            boughtItems.forEach(e => {
                info += `<span>${e.title} x ${e.quantity}</span><br>`
            })

            info += `<hr>
        <span>Su total a pagar es $${ticket.amount}</span><br>
        <span>Su codigo de seguimiento es ${ticket.code}</span><br>
        <a href='/products'><button>Ver catalogo</button></a>
        <a href='/'><button>Ver perfil</button></a>`

            prePurchase.innerHTML = ''
            postPurchase.innerHTML = info
        })
        .catch(error => {
            postPurchase.innerHTML = error.message
        })
}

function deleteFromCart(e, productId) {
    e.preventDefault()

    // Obtener el formulario y la URL de la acción
    let form = document.getElementById('deleteFromCart_' + productId)
    let action = form.getAttribute('action')
    let formResult = document.getElementById('info_' + productId)
    formResult.innerHTML = ''

    // Enviar la solicitud utilizando fetch
    fetch(action, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                form.innerHTML = '<span>Se elimino el producto de su carrito exitosamente</span>'
                location.reload()
            } else {
                formResult.innerHTML = 'Ocurrio un error, por favor intentelo mas tarde'
            }
        })
        .catch(error => {
            formResult.innerHTML = 'Ocurrio un error, por favor intentelo mas tarde'
        })
}

function setQuantity(e, productId) {
    e.preventDefault()

    // Obtener el formulario y la URL de la acción
    let form = document.getElementById('setQuantity_' + productId)
    let action = form.getAttribute('action')
    let formValue = document.getElementById('quantityInput_' + productId).value
    let formResult = document.getElementById('info_' + productId)
    formResult.innerHTML = ''

    // Enviar la solicitud utilizando fetch
    fetch(action, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: formValue }),
    })
        .then(response => {
            if (response.ok) {
                form.innerHTML = '<span>Se actualizo la cantidad exitosamente</span>'
                location.reload()
            } else {
                formResult.innerHTML = 'Ocurrio un error, por favor intentelo mas tarde'
            }
        })
        .catch(error => {
            formResult.innerHTML = 'Ocurrio un error, por favor intentelo mas tarde'
        })
}
