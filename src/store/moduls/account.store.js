import AccountServices from '../../services/account.service'
import Axios from "axios";
import store from "../index";

export default {
    state: {
        // loggedIn, loggingIn, error, networkError
        status: '',
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user')) || ''

    },
    mutations: {
        authRequested: state => state.status = 'loggingIn',
        loggedIn(state, info) {
            state.status = 'loggedIn';
            state.token = info.token;
            state.user = info
        },
        logOut: state => {
            state.status = '';
            state.token = '';
            state.user = ''
        },
        logInFailed: state => state.status = 'error',
        networkError: state => state.status = 'networkError'
    },
    getters: {
        user: state => state.user,
        authToken: state => state.token,
        isLoggedIn: state => !!state.token && !!state.user,
        authStatus: state => state.status
    },
    actions: {
        login({commit}, {username, password}) {
            return new Promise( (resolve, reject) => {
                commit('authRequested');
                AccountServices.login(username, password).then( (response) => {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    commit('loggedIn', response.data);
                    Axios.defaults.headers.common['Authorization'] = 'token ' + store.getters.authToken;
                    resolve()
                } ).catch( (err) => {
                    if (err && err.response && err.response.status === 400)
                        commit('logInFailed');
                    else
                        commit('networkError');

                    reject()
                })
            } );
        },
        logout({commit}) {
            localStorage.removeItem('token');
            commit('logOut');
        }
    }
}