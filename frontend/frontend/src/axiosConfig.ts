import axios from 'axios';
import {Assignment} from './components/CourseCard';


const instance = axios.create({
    //baseURL: 'https://sel2-4.ugent.be/api/',
    baseURL: 'http://localhost:8000/api/',
    headers: {'Content-Type': 'application/json'}
});

//TODO constant logging better only for development
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

export function getVak(vakId: string) {
    return instance.get('/vakken/' + vakId);
}

export function addVak(assignment: Assignment) { // waarom een assignment en geen vak meegeven?
    return instance.post('/vakken', assignment);
}

//mogelijk/nodig?
export function changeVak(vakId: string, assignment: Assignment) {
    return instance.put('/vakken/' + vakId, assignment);
}

//mogelijk/nodig?
export function deleteVak(vakId: string) {
    return instance.delete('/vakken/' + vakId);
}

export function getProjecten() {
    return instance.get('/projecten');
}

//mogelijk/nodig?
export function getProject(projectId: string) {
    return instance.get('/projecten/' + projectId);
}

export default instance;
