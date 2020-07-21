import ClassServices from '../../services/class.service'

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
        state.isSet = true;
    },
    removeClass(state, _classId){
        state.classes = state.classes.filter((_cls) => { return _cls.id !== _classId; });
    },
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

    fetchAllClasses({commit}) {
        ClassServices.fetchAllClasses().then( (response) => {
            if (response.status === 200) {
                let _classes = response.data;
                commit('setClasses', _classes);
            }
        }
        )
    }
};


export default {
    state,
    getters,
    mutations,
    actions
};