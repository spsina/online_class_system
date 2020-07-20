const user_state = {
    isSet: false,
    users: [
        {
            'id': 1,
            'full_name': 'Sina Parvizi'
        },
        {
            'id': 3,
            'full_name': 'Amir Erfan'
        }
    ],
};

const user_getters = {
    users(user_state) {return user_state.users;},
    getUserById(user_state, _userId) { user_state.users.find((_usr) => { return _usr.id === _userId; }); }
};

const user_mutations = {
    addUser(user_state, _user) {
        user_state.users.push(_user);
    },
    removeUser(user_sate, _userId) {
        user_state.users = user_sate.filter((_usr) => {return _usr.id !== _userId});
    },
    setUsers(user_sate, _users) {
        user_state.users = _users;
    },
    setIsSet(user_sate) {
        user_sate.isSet = true;
    }
};
const user_actions = {

};


export default {
    state: user_state,
    getters: user_getters,
    mutations: user_mutations,
    actions: user_actions
};