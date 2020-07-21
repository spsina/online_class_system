import axios from 'axios'

export default {
    login(username, password) {
        return new Promise( (resolve, reject) => {
            axios( {
                method: 'POST',
                url:'api-token-auth/',
                data: {
                    username,
                    password },
                }
            ).then( (response)  => {
                resolve(response);
            }).catch(err => reject(err))
        } );
    },
    logout() {}
}