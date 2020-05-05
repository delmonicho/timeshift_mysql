import http from "../http-common";
import * as moment from "moment";

let event = {
  "title": "title",
  "start_time": "start",
  "end_time":"end",
  "recurring":"MON",
  "user_id":1
}

let user = {
  "first_name": "Rick",
  "last_name": "Sanchez",
  "email": "sendFartNoises@poot.io",
  "username": "C-137",
  "password": "dontThinkAboutIt"
}

let list = {
  "title": "Rick's Goals",
  "color": "blue",
  "userId": 1
}

let task = {
  "title": "Come and get your bike Rick",
  "est_time": 3.69,    // TODO fix est_time to user's input hours
  "alg_time": 3.65,    // TODO fix alg_time to random add of est_time
  "listId": 1
}

export const requestsMixin = {
  methods: {
    getUser() {
      //GET user information
      return http.get(`/users`);
    },
    createUser() {

      return http.post(`/users`, user);
    },
    createList() {

      console.log("List " + list['title'] + " posted in db.");
      return http.post(`/lists`, list);
    },
    createTask(newTitle,newHours,newListIdNum) {

      console.log(newTitle + "  " + newHours + "  " + newListIdNum);
      task.title = newTitle;
      task.est_time = newHours;
      task.alg_time = newHours + Math.random() * 5;
      task.listId = newListIdNum;
      console.log(task['title'] + " added to task list and posted in db.");
      console.log(task);
      return http.post(`/tasks`, task);
    },
    getCalendar() {
      return http.get(`/events`);
    },
    addCalendar(data) {
      //when posting to calendar, can include all endpoints here
      //instead of posting data (the 5 variables used by the calendar), post the who request body
      let { start, end, title } = data;

      event.title = title;
      event.start_time = start;
      event.end_time = end;
      //try to subtract 10 hours to get proper timezone with UTC
      return http.post(`/events`, event);
    },
    editCalendar(data) {
      //console.log("editCalendar(data): data = ");
      console.log(data);

      //console.log("parseHour=" + parseHour + "\tparseMinutes = " + parseMinutes);
      // let start = moment(start.getHours()-10) + (Math.random()) * 20)).format("YYYY-MM-DD HH:mm:ss");
      // let end = moment(currentDate.setHours(currentDate.getHours()))
      //   .add({hours:parseHour,minutes:parseMinutes})
      //   .format("YYYY-MM-DD HH:mm:ss");

      let { start, end, title, id} = data;
      //fix UTC to HI timezone
      let start_time = moment(start).subtract(10, 'hours').format("YYYY-MM-DD HH:mm:ss");
      let end_time = moment(end).subtract(10, 'hours').format("YYYY-MM-DD HH:mm:ss");

      console.log("start-10:"+start_time+"end-10:"+end_time);
      event.title = title;
      event.start_time = start_time;
      event.end_time = end_time;
      event.id = id;
      return http.put(`/events/${event.id}`, event);
    },
    deleteCalendar(id) {
      return http.delete(`/events/${id}`);
    }
    // deleteAll() {
    //   return http.delete
    // }
  }
};
