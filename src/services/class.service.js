import Config from './config'
import axios from 'axios'

export default {
    login,
    logout
};

function login(username, password) {

    return axios.post(`${Config.API_ROOT}/api-token-auth/`, {
        username,
        password
    }).then(response => {
        console.log(response);
        localStorage.setItem('auth-token', JSON.stringify(response).token);

    }).catch( reason =>
        console.log(reason)
    )
}

function logout() {
    localStorage.removeItem('auth-token');
}