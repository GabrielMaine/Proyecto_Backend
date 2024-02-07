/* global document, window */

const form = document.getElementById('restorePassword')

form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    console.log(data)
    const obj = {}
    data.forEach((value, key) => (obj[key] = value))
    console.log(obj)
    fetch('/api/users/apiRestorePassword', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/login')
        }
    })
})
