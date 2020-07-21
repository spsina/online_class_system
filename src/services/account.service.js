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
                validateStatus: () => true
                }
            ).then( ({data, status} ) => {
                if (status === 200)
                    resolve(data);
                else
                    reject({data, status})
            }).catch(err => reject({data:err, status: 500}))
        } );
    },
    logout() {}
}