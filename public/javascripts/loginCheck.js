fetch('/api/auth/check', {
    method: 'POST',
    headers: {
        Authorization: localStorage.getItem('token')
    }
}).then(response => {
    if (response.status !== 200) {
        document.location.href = '/users'
    }
})