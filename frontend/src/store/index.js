import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
//Complete vuex storing of TASKS
//TODO:
// add actions and getters and dispatch calls in Home.vue
export default new Vuex.Store({
  state: {
    events: [], //added an events state for the calendar events
    tasks: []   //added an tasks state for the tasks list
  },
  mutations: {
    //function dispatched with this.$store.commit so that we can set the events in the store and access it in all our components
    setEvents(state, payload) {
      //console.log(payload);
      state.events = payload;
    },
    setTasks(state, tasks) {
      //console.log(tasks);
      state.tasks = tasks;
    }
  },
  actions: {},
  getters: {
    getTasks(state) {
      return state.tasks
    }
  }
});
