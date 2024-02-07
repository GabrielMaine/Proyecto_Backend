/* global document, window */

const form = document.getElementById('resetPassword')
const warning = document.getElementById('validatePassword')

form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => (obj[key] = value))
    console.log(obj)
    fetch('/api/users/apiResetPassword', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/login')
        }
        if (result.status === 400) {
            warning.innerText = 'La contraseña no puede ser igual a la anterior'
        }
    })
})
