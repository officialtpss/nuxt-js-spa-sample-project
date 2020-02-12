
export const state = () => {
    return {
        auth: (localStorage.getItem("_login_app") === null) ? null : JSON.parse(localStorage.getItem("_login_app")),
        firstName: (localStorage.getItem("_login_app") === null) ? '' : (JSON.parse(localStorage.getItem("_login_app"))).firstName,
        userInfo: null,
        employees: [],
        posts: []
    }
}

export const mutations = {
    SET_AUTH(state, auth) {
        state.auth = auth
    },
    SET_FIRST_NAME(state, firstName) {
        state.firstName = firstName
    },
    SET_USERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    SET_EMPLOYEE(state, employees) {
        state.employees = employees
    },
    SET_POSTS(state, posts) {
        state.posts = posts
    },
}

export const actions = {
    async login({ commit }, userData) {
        try {
            const data = await this.$axios.$put(`user`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            commit('SET_AUTH', data);
            commit('SET_FIRST_NAME', data.firstName);
            localStorage.setItem("_login_app", JSON.stringify(data));
        } catch (error) {
            if (error.response && error.response.status === 400) {
                throw new Error(error.response.data.message)
            }
            throw error
        }
    },
    async logout({ commit }) {
        try {
            const storage = (localStorage.getItem("_login_app") === null) ? null : JSON.parse(localStorage.getItem("_login_app"));
            if (storage) {
                await this.$axios.$delete(`user`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storage.token}`,
                    }
                });
                commit('SET_AUTH', null);
                commit('SET_FIRST_NAME', '');
                localStorage.removeItem("_login_app");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                throw new Error('Bad credentials')
            } else if (error.response && error.response.status === 401) {
                commit('SET_AUTH', null);
                commit('SET_FIRST_NAME', '');
                localStorage.removeItem("_login_app");
                return false;
            }
            throw error
        }
    },
    async getUserInfo({ commit }) {
        try {
            const storage = (localStorage.getItem("_login_app") === null) ? null : JSON.parse(localStorage.getItem("_login_app"));
            const data = await this.$axios.$get(`user`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storage.token}`,
                }
            });
            commit('SET_USERINFO', data.profile);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                throw new Error('Bad credentials')
            } else if (error.response && error.response.status === 401) {
                commit('SET_AUTH', null);
                commit('SET_FIRST_NAME', '');
                localStorage.removeItem("_login_app");
                return false;
            }
            throw error
        }
    },
    async updateProfile({ commit } , userData) {
        try {
            const storage = (localStorage.getItem("_login_app") === null) ? null : JSON.parse(localStorage.getItem("_login_app"));
            const data = await this.$axios.$patch(`user`, userData ,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storage.token}`,
                }
            });
            commit('SET_USERINFO', userData);
            commit('SET_FIRST_NAME', userData.firstName);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                throw new Error('Bad credentials')
            } else if (error.response && error.response.status === 401) {
                commit('SET_AUTH', null);
                commit('SET_FIRST_NAME', '');
                localStorage.removeItem("_login_app");
                return false;
            }
            throw error
        }
    },
    async getEmployee({ commit }) {
        try {
            const data = await this.$axios.$get('http://dummy.restapiexample.com/api/v1/employees');
            commit('SET_EMPLOYEE', data.data);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                throw new Error('Bad credentials')
            } 
            throw error
        }
    },
    async getPosts({ commit }) {
        try {
            const data = await this.$axios.$get('https://jsonplaceholder.typicode.com/posts');
            commit('SET_POSTS', data);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                throw new Error('Bad credentials')
            } 
            throw error
        }
    },
}
