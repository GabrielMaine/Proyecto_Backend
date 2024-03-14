/* global document, window */
const loadUsers = () => {
    fetch('/api/users/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.status === 200) {
                return response.json() // Parse the JSON in the response
            } else {
                throw new Error('Failed to fetch users')
            }
        })
        .then(data => {
            let userData = document.getElementById('userData')
            let users = ''
            data.payload.forEach(e => {
                users =
                    users +
                    `<span>ID: ${e.id}</span><br><span>Nombre: ${e.first_name} ${e.last_name}</span><br>
            <span>Email: ${e.email}</span><br><span>Rol: ${e.role}</span><hr>`
            })
            userData.innerHTML = users
        })
        .catch(error => {
            console.error('Error:', error)
        })

    return false
}

const deleteUnused = () => {
    fetch('/api/users/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.status === 200) {
                return response.json() // Parse the JSON in the response
            } else {
                throw new Error('Failed to fetch users')
            }
        })
        .then(data => {
            let deletedData = document.getElementById('deletedData')
            let users = ''
            if (data.payload.length > 0) {
                data.payload.forEach(e => {
                    users =
                        users +
                        `<span>ID: ${e.id}</span><br><span>Nombre: ${e.first_name} ${e.last_name}</span><br>
                <span>Email: ${e.email}</span><br><span>Rol: ${e.role}</span><hr>`
                })
                deletedData.innerHTML = users
            } else {
                deletedData.innerHTML = '<span>No habia usuarios inactivos en la base de datos</span>'
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })

    return false
}

const roleForm = document.getElementById('roleForm')

if (roleForm) {
    roleForm.addEventListener('submit', e => {
        e.preventDefault()
        let roleInfo = document.getElementById('roleInfo')
        roleInfo.innerHTML = ''
        const data = new FormData(roleForm)
        const obj = {}
        data.forEach((value, key) => (obj[key] = value))
        fetch(`/api/users/premium/${obj.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                switch (response.status) {
                    case 200:
                        return 'Rol cambiado exitosamente'
                    case 404:
                        return 'No se encontro usuario con ese ID'
                    case 401:
                        return 'No se puede cambiar el rol por falta de documentación'
                    case 500:
                        return 'Ocurrio un error inesperado. Intente mas tarde'
                }
            })
            .then(data => {
                roleInfo.innerHTML = data
            })
            .catch(error => {
                console.error('Error:', error)
            })

        return false
    })
}

const deleteForm = document.getElementById('deleteForm')

if (deleteForm) {
    deleteForm.addEventListener('submit', e => {
        e.preventDefault()
        let deleteInfo = document.getElementById('deleteInfo')
        deleteInfo.innerHTML = ''
        const data = new FormData(deleteForm)
        const obj = {}
        data.forEach((value, key) => (obj[key] = value))
        fetch(`/api/users/${obj.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                switch (response.status) {
                    case 200:
                        return 'Usuario eliminado exitosamente'
                    case 404:
                        return 'No se encontro usuario con ese ID'
                    case 500:
                        return 'Ocurrio un error inesperado. Intente mas tarde'
                }
            })
            .then(data => {
                deleteInfo.innerHTML = data
            })
            .catch(error => {
                console.error('Error:', error)
            })

        return false
    })
}
