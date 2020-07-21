import AccountServices from '../../services/account.service'
import Axios from "axios";
import store from "../index";

export default {
    state: {
        // loggedIn, loggingIn, error, networkError
        status: '',
        token: localStorage.getItem('token') || '',
        user: {}
    },
    mutations: {

        authRequested: state => state.status = 'loggingIn',
        loggedIn(state, token) {
            state.status = 'loggedIn';
            state.token = token;
        },
        logOut: state => {
            state.status = '';
            state.token = '';
        },
        logInFailed: state => state.status = 'error',
        networkError: state => state.status = 'networkError'
    },
    getters: {
        authToken: state => state.token,
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status
    },
    actions: {
        login({commit}, {username, password}) {
            return new Promise( (resolve, reject) => {
                commit('authRequested');
                AccountServices.login(username, password).then( (response) => {
                    localStorage.setItem('token', response.data.token);
                    commit('loggedIn', response.data.token);
                    Axios.defaults.headers.common['Authorization'] = 'token ' + store.getters.authToken;
                    resolve()
                } ).catch( (err) => {

                    if (err && err.status === 400)
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