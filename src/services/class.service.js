import axios from 'axios'

export default {
    fetchAllClasses
};

function fetchAllClasses () {
    return new Promise( (resolve, reject)=>{
        axios({
            method: 'GET',
            url: 'class/list/',
            data: {},
        }).then((response) => resolve(response)).catch(err => reject(err))
    } );
}
