import axios from 'axios'

const instance = axios.create({
    //baseURL: 'https://sel2-4.ugent.be/api/',
    baseURL: 'http://localhost:8000/api/',
    headers: { 'Content-Type': 'application/json' },
})

//TODO constant logging better only for development
instance.interceptors.request.use((request) => {
    console.log(request)
    return request
})

instance.interceptors.response.use((response) => {
    console.log(response)
    return response
})

export default instance
