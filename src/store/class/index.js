const state = {
    classes: [
        {
            class_name: 'برنامه نویسی وب',
            teacher: 'علی پرویزی',
            students_count: 15,
            id: 1
        },
        {
            class_name: 'برنامه نویسی وب',
            teacher: 'علی پرویزی',
            students_count: 15,
            id: 2
        },
        {
            class_name: 'برنامه نویسی وب',
            teacher: 'علی پرویزی',
            students_count: 15,
            id: 3

        },
        {
            class_name: 'برنامه نویسی وب',
            teacher: 'علی پرویزی',
            students_count: 15,
            id: 4
        },
        {
            class_name: 'برنامه نویسی وب',
            teacher: 'علی پرویزی',
            students_count: 15,
            id: 5
        },
        {
            class_name: 'برنامه نویسی وب',
            teacher: 'علی پرویزی',
            students_count: 15,
            id: 6
        }
    ],
};
const getters = {
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
    }
};


export default {
    state,
    getters,
    mutations,
    actions
};