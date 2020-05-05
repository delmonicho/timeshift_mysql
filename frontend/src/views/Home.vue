<!-- This template page is the container for the calendar -->
<template>
  <div class="page">
    <!--ADD vuetify package for pretty alerts
    <v-alert border="left" type="info" dense text dismissible>Welcome to timeShift, the premier calendar app that helps you optimally plan your schedule and fulfill your tasks.  To begin, please create tasks with a title and estimated hours to complete on the left.  Once you have input your tasks, simply click 'Fill Calendar' to place the tasks in the available spaces in your calendar.
    </v-alert>
  -->
    <div class="titles" style="text-align: center">
      <h1>TIMESHIFT</h1>
      <h3>Scheduling Optimization at its finest</h3>
    </div>
    <div style="width: 100%;  padding: 80px 20px 40px 40px; text-align: center;">
          <div class="row">
            <!-- CREATE TASK INPUT FORMS  -->
              <div class="col-md-6">
                  <div class="well">
                      <h2>Create a New Task</h2>
                      <form>
                          <div class="form-group">
                              <label for="todoitem">Task Item</label>
                              <input type="text" v-model="input" class="form-control" id="todoitem" placeholder="enter task" />
                              <input type="text" v-model.number="hours" class="form-control" id="todohours" placeholder="enter hours to complete task" onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13 || event.charCode == 46) ? null : event.charCode >= 48 && event.charCode <= 57"/>
                          </div>
                          <b-button type="button" v-on:click="add()" class="btn btn-default" >Create</b-button>
                      </form>
                  </div>
              </div>
              <!-- TASKS LIST -->
              <div class="col-md-6">
                  <h2>Tasks List</h2>
                  <ul class="list-group">
                      <li v-for="(todo, index) in todos" :key="index" class="list-group-item">
                          {{ todo[0] }} - {{ todo[1] }} hours
                      </li>
                  </ul>
                  <b-button type="button" v-on:click="remove()" v-bind:disabled="isButtonDisabled">Fill Calendar</b-button>
              </div>
          </div>
    </div>
    <div style="width: 100%; padding: 0px 20px 40px 40px; text-align:center;">
      <!-- ADD CALENDAR EVENT BUTTON -->
      <div class="buttons">
        <b-button v-b-modal.add-modal>Add Calendar Event</b-button>
      </div>
      <!-- FULL CALENDAR COMPONENT -->
      <full-calendar :events="events" @event-selected="openEditModal" :nowIndicator="true" defaultView="agendaWeek" />
        <b-modal id="add-modal" title="Add Calendar Event" hide-footer ref="add-modal">
          <CalendarForm :edit="false" @eventSaved="closeModal()" ref="add-event"/>
        </b-modal>
        <b-modal id="edit-modal" title="Edit Calendar Event" hide-footer ref="edit-modal">
          <CalendarForm :edit="true" :calendarEvent="calendarEvent" @eventSaved="closeModal()" />
        </b-modal>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import CalendarForm from "@/components/CalendarForm.vue";
import { requestsMixin } from "../mixins/requestsMixin";
import * as moment from "moment";
var currentDate = new Date();
export default {
  name: "home",
  components: {
    CalendarForm
  },
  props: {
    nowIndicator:Boolean
  },
  mixins: [requestsMixin],
  computed: {
    events() {
      return this.$store.state.events;
    },
    tasks() {
      return this.$store.state.tasks;
    }
  },
  data() {
    return {
      calendarEvent: {},      //controls data for calendar forms
      todos: [],              //controls todos task list
      tempTodos: [],          //holds todos for redistribution
      algTodosTimes: [],      //holds todos title,start time,end time to display to user
      input: '',              //string for task title input form
      hours:'',               //number for task estimated hours of completion
      taskTimes:'',           //string to hold dateTime
      isButtonDisabled:false, //bool to check if input forms in process of editing
      consent:true,            //bool to check if user satisfied with task filling,
      listCount:0,
      //newTask: []
    };
  },
  async beforeMount() {
    await this.getEvents();
  },
  methods: {
    async getEvents() {
      const response = await this.getCalendar();
      //Vuex store is expecting events to look like original tutorial version
      // so the response.data before would look like

      //TODO make separate button to getUser data to display in alert.
      const user_data = await this.getUser();
      // console.log(typeof user_data);  //object type
      // console.log("user_data keys:" + Object.keys(user_data)); //keys are: data,status,statusText,headers,config,request

      //on initial boot up, if events empty, POST a new user
      let numUsers = user_data['data'].length;
      if (numUsers > 0) {
        const userFirstName = user_data['data'][0]['first_name'];
        const userUN = user_data['data'][0]['username'];
        console.log(userFirstName + " " + userUN + " is currently using this app.")
      } else {
        await this.createUser();
      }

      // for (var obj in user_data) {
      //   console.log(user_data[obj]);
      // }

      //res_data is the reformatted json body to store calendar array of events for Vuex store
      const res_data = [];
      //parse through response.data to save start,end,title, and id in a calendar array
      //for each observation in response.data
      //console.log("response.data: " + response.data);
      var obs;
      for (obs in response.data) {
        res_data[obs] = {
          "start": response.data[obs].start_time,
          "end": response.data[obs].end_time,
          "title": response.data[obs].title,
          "id": response.data[obs].id
        }
      }
      this.$store.commit("setEvents", res_data);
      //console.log("getEvents(): " + res_data);
      //disable 'fill calendar' button if task list empty
      if(this.todos.length == 0) {
        this.isButtonDisabled = true;
      }

      //alert("Welcome to timeShift, the premier calendar app that helps you optimally plan your schedule and fulfill your tasks.  To begin, please create tasks with a title and estimated hours to complete on the left.  Once you have input your tasks, simply click 'Fill Calendar' to place the tasks in the available spaces in your calendar.")
    },
    closeModal() {
      this.$refs["add-modal"].hide();
      this.$refs["edit-modal"].hide();
      this.calendarEvent = {};
    },
    openEditModal(event) {
      let { id, start, end, title } = event;
      this.calendarEvent = { id, start, end, title };
      this.$refs["edit-modal"].show();
    },
    async add() {
      if(this.input.length == 0 || this.hours.length == 0){
        alert("Please input a task to complete and estimated hours to completion.");
      }
      else
      {
        //create list when first task added
        if (this.todos.length == 0) {
          await this.createList();
          this.listCount++;
        }

        //add todo to array
        let newTitle = this.input;
        let newHours = this.hours;
        let newListIdNum = this.listCount;
        this.todos.push([this.input,this.hours]);
        //set tasks to save state of todo
        this.$store.commit("setTasks", this.todos);
        //create task
        //console.log("hours:" + hours + " typeof hours = " + typeof hours + "  listIdNum:" + listIdNum + typeof listIdNum);
        //let newTask = [title,hours,listIdNum];
        console.log("newTask: " + newTitle + " " + newHours + " " + newListIdNum);
        await this.createTask(newTitle, newHours,newListIdNum);
        //clear input forms
        this.input = "";
        this.hours = "";
        //enable 'fill calendar' button when tasks in list
        this.isButtonDisabled = false;


      }
    },
    async remove() {
        //alert if input forms not empty when 'fill calendar' button clicked
        if (this.input != "" || this.hours != ""){
          alert("There is text in the input forms.  Please confirm you are done creating tasks and the input forms are clear before clicking 'Fill Calendar'");
          return; //exit function so user can edit input forms
        }
        //initialize temporary array when 'Fill Calendar' clicked
        this.algTodosTimes = [];
        //fill in calendar with all tasks from todo list
        while (this.todos.length > 0)
        {
          //reverse list order to pop off first item in list
          this.todos.reverse();
          // TODO
          //store event in available space in calendar
          const task = this.todos.pop();

          //parse hours input to get hours and minutes to add to dateTime
          let parseHour = Math.floor(task[1]);
          let parseMinutes = (task[1] % 1) * 60;
          //console.log("parseHour=" + parseHour + "\tparseMinutes = " + parseMinutes);
          let start = moment(currentDate.setHours((currentDate.getHours()-10) + (Math.random()) * 28)).format("YYYY-MM-DD HH:mm:ss");
          let end = moment(currentDate.setHours(currentDate.getHours()))
            .add({hours:parseHour,minutes:parseMinutes})
            .format("YYYY-MM-DD HH:mm:ss");


          let title = task[0];
          //fill array to display task time designations/ reorder events
          this.algTodosTimes.push([title,start,end]);
          //fill temp array to refill todos if user unsatisfied with task distribution
          this.tempTodos.push([title,task[1]]);
          //add event to calendar
          this.calendarEvent = { start, end, title };
          await this.addCalendar(this.calendarEvent);


          //reverse back to maintain order
          this.todos.reverse();
        }
        // getCalendar() when task list empty
        if(this.todos.length == 0)
        {
          //parse out individual task times to display to user
          this.taskTimes = "";
          const arrayLength = this.algTodosTimes.length;
          let alertTitle, alertStart, alertEnd;
          for (var i = 0; i < arrayLength; i++)
          {
            let alertTitle = this.algTodosTimes[i][0];
            let alertStart = this.algTodosTimes[i][1];
            let alertEnd = this.algTodosTimes[i][2];
            this.taskTimes +=  "\n" + alertTitle + " from " + alertStart + " to " + alertEnd;
          }
          //Display events added without page reload
          await this.getEvents();
          //Highlight where task events added
          alert("The Task List has been distributed in the calendar at the following time(s):" + this.taskTimes);
          //Check here if user happy with distribution
          if (confirm("Click 'OK' if you are satisfied with the calendar."))
          {
            this.consent = true;   //user happy with distribution of tasks

            //TODO set flag for new list creation when list emptied
            //TODO increment counter for list id

            // for (var k=0; k < this.algTodosTimes.length; k++)
            // {
            //   title = this.algTodosTimes[0];
            //   start = this.algTodosTimes[1];
            //   end = this.algTodosTimes[2];
            //   //add event to calendar
            //   this.calendarEvent = { start, end, title };
            //   await this.addCalendar(this.calendarEvent);
            // }
          }
          else
          {
            let tempInput = '';
            let tempHours = '';
            this.consent = false;  //user wishes to redistribute the tasks
            for (var t=0; t < this.tempTodos.length; t++)
            {
              tempInput = this.tempTodos[0];
              tempHours = this.tempTodos[1];
              this.todos.push([tempInput,tempHours]); //this should display the tasks list again
            }
            //this.todos = this.tempTodos;
            this.isButtonDisabled = false;
            console.log(this.todos);
          }
        }
      }
      // ,
      // async redistribute() {
      //
      // }
  }
};
</script>
<style lang="scss" scoped>
.buttons {
  margin-bottom: 10px;
}
h2 {
  margin-left: 40;
  margin-top: 0px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
button {
  color: #42b983;
  background-color: #add8e6;
}
</style>
