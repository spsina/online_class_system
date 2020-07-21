import axios from "axios";
import Config from '../../services/config'
const root = Config.root;

const state = {
    isSet: false,
    classes: [],
};
const getters = {
    classesSet(state) {return state.isSet},
    classes(state) { return state.classes; },
    getById(state, _id) { return state.classes.find((_cls) => {return _cls.id === _id;}) }
};

const mutations = {
    addClass(state, _class) {
        state.classes.push(_class);
    },
    setClasses(state, _classes) {
        state.classes = _classes;
    },
    removeClass(state, _classId){
        state.classes = state.classes.filter((_cls) => { return _cls.id !== _classId; });
    },
    setClassesSet(state) {
        state.isSet = true;
    }
};
const actions = {
    addClass(context, _class){
        // send server request

        // also add to internal classes array
        context.commit('addClass', _class);
    },
    removeClass(context, _classId){
        context.commit('removeClass', _classId);
    },

    fetchAllClasses(context) {
        axios
            .get(root + 'class/list/')
            .then(response => {
                console.log(response);
                context.commit('setClasses', []);
            }).catch(reason => (console.log(reason)));
    }
};


export default {
    state,
    getters,
    mutations,
    actions
};