import AccountServices from '../../services/account.service'

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
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status
    },
    actions: {
        login({commit}, {username, password}) {
            return new Promise( (resolve, reject) => {
                commit('authRequested');
                AccountServices.login(username, password).then( (response) => {
                    console.log(response.token);
                    localStorage.setItem('token', response.token);
                    commit('loggedIn', response.token);
                    console.log(("LOGGED IN"))
                    resolve()
                } ).catch( ({status}) => {
                    if (status === 400)
                        commit('logInFailed');
                    else
                        commit('networkError');
                    reject()
                })
            } );
        },
        logout({commit}) {
            commit('logOut');
        }
    }
}