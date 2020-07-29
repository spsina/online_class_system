import axios from 'axios'

export default {
    fetchAllClasses,
    deleteClass,
    createClass,
    classRetrieve,
    fire,
    register,
};

function fetchAllClasses () {
    return new Promise( (resolve, reject)=>{
        axios({
            method: 'GET',
            url: 'class/list/',
        }).then((response) => resolve(response)).catch(err => reject(err))
    } );
}

function classRetrieve (class_id) {
    return new Promise( (resolve, reject)=>{
        axios({
            method: 'GET',
            url: `class/${class_id}/`,
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

function createClass (classData) {
    return new Promise( (resolve, reject)=>{
        axios({
            method: 'POST',
            url: `class/create/`,
            data: classData,
        }).then((response) => resolve(response)).catch(err => reject(err))
    } );
}

function fire(classId, username) {
    return new Promise( (resolve, reject)=>{
        axios({
            method: 'DELETE',
            url: `class/${classId}/register/${username}/`,
        }).then((response) => resolve(response)).catch(err => reject(err))
    } );
}

function register(classId, username) {
    return new Promise( (resolve, reject)=>{
        axios({
            method: 'POST',
            url: `class/${classId}/register/${username}/`,
        }).then((response) => resolve(response)).catch(err => reject(err))
    } );
}

