import axios from "axios";

export default {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addQuestion,
    updateDeleteQuestion,
    quizRetrieve,
    getQuizQuestions,
    startQuiz,
    submitAnswer
}

function createQuiz(classId, quizData) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `class/${classId}/quiz/create/`,
            data: quizData,
        }).then((response) => resolve(response)).catch(err => reject(err))
    });
}

function updateQuiz(quizId, quizData) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'PUT',
            url: `/quiz/${quizId}/update/`,
            data: quizData,
        }).then((response) => resolve(response)).catch(err => reject(err))
    });
}

function quizRetrieve(quizId){
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: `/quiz/${quizId}/update/`,
        }).then((response) => resolve(response)).catch(err => reject(err))
    });
}

function getQuizQuestions(quizId) {

    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: `quiz/${quizId}/questions/`,
        }).then((response) => resolve(response)).catch(err => reject(err))
    });
}


function startQuiz(quizId) {

    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `quiz/${quizId}/start/`,
        }).then((response) => resolve(response)).catch(err => reject(err))
    });
}

function submitAnswer(data) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `submit-answer/`,
            data: data
        }).then((response) => resolve(response)).catch(err => reject(err))
    });
}

function deleteQuiz(quizId) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'DELETE',
            url: `/quiz/${quizId}/update/`,
        }).then((response) => resolve(response)).catch(err => reject(err))
    });
}

function addQuestion(quizId, qData) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `quiz/${quizId}/question/create/`,
            data: qData,
        }).then((response) => resolve(response)).catch(err => reject(err))
    });
}

function updateDeleteQuestion(questionId, qData, isDelete) {
    return new Promise((resolve, reject) => {
        axios({
            method: (!isDelete) ? 'PUT' : 'DELETE',
            url: `question/${questionId}/`,
            data: qData,
        }).then((response) => resolve(response)).catch(err => reject(err))
    });
}