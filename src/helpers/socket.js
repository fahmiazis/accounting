import io from 'socket.io-client'
const {REACT_APP_BACKEND_URL} = process.env

const token = localStorage.getItem('token')
    const socket = io(`${REACT_APP_BACKEND_URL}`, {
        withCredentials: true,
        extraHeaders: {
            'Authorization': token? `Bearer ${token}` : undefined
        }
    })

export default socket