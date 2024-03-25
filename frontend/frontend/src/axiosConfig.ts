import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://sel2-4.ugent.be/api/',
    headers: {'Content-Type': 'application/json'}
});

instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

instance.interceptors.request.use((request) => {
    console.log(request);
    return request;
});

instance.interceptors.response.use((response) => {
    console.log(response);
    return response
});

export function getVakken() { // mogelijk/nodig?
    return instance.get('/vakken');
}

export function getProjecten() {
    return instance.get('/projecten');
}

export default instance;