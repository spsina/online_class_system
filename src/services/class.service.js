import axios from 'axios'

export default {
    fetchAllClasses,
    deleteClass
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

function deleteClass (classID) {
    return new Promise( (resolve, reject)=>{
        axios({
            method: 'DELETE',
            url: `class/${classID}/update/`,
            data: {},
        }).then((response) => resolve(response)).catch(err => reject(err))
    } );
}
