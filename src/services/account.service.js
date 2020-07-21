import axios from 'axios'

export default {
    login(username, password) {
        return new Promise( (resolve, reject) => {
            axios.post('api-token-auth/',
                {
                    username,
                    password
                }).then( (response)  => {
                resolve(response);
            }).catch( (err) => {
                reject(err);
            })
        } );
    },
    logout() {}
}