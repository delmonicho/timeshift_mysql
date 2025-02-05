import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import 'fullcalendar/dist/fullcalendar.css'
Vue.use(Router);
export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      alias: "/events",
      name: "events",
      component: Home
    }
  ]
});
