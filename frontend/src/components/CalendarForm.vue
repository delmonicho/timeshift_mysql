<!-- TODO: make drag and drop change database entry on drop OR prevent drag -->
<template>
  <div>
    <ValidationObserver ref="observer" v-slot="{ invalid }">
      <b-form @submit.prevent="onSubmit" novalidate>
        <b-form-group label="Title" label-for="title">
          <ValidationProvider name="title" rules="required" v-slot="{ errors }">
            <b-form-input
              :state="errors.length == 0"
              v-model="form.title"
              type="text"
              required
              placeholder="Title"
              name="title"
            ></b-form-input>
            <b-form-invalid-feedback :state="errors.length == 0">Title is required</b-form-invalid-feedback>
          </ValidationProvider>
        </b-form-group>
        <b-form-group label="Start" label-for="start">
          <ValidationProvider name="start" rules="required" v-slot="{ errors }">
            <VueCtkDateTimePicker
              input-class="form-control"
              :state="errors.length == 0"
              v-model="form.start"
              name="start"
            ></VueCtkDateTimePicker>
            <b-form-invalid-feedback :state="errors.length == 0">Start is required</b-form-invalid-feedback>
          </ValidationProvider>
        </b-form-group>
        <b-form-group label="End" label-for="end">
          <ValidationProvider name="end" rules="required" v-slot="{ errors }">
            <VueCtkDateTimePicker
              input-class="form-control"
              :state="errors.length == 0"
              v-model="form.end"
              name="end"
            ></VueCtkDateTimePicker>
            <b-form-invalid-feedback :state="errors.length == 0">End is required</b-form-invalid-feedback>
          </ValidationProvider>
        </b-form-group>
        <b-button type="submit" variant="primary">Save</b-button>
        <b-button type="button" variant="primary" @click="deleteEvent(form.id)">Delete</b-button>
      </b-form>
    </ValidationObserver>
  </div>
</template>
<script>

import { requestsMixin } from "../mixins/requestsMixin";
import * as moment from "moment";
export default {
  name: "CalendarForm",
  props: {
    edit: Boolean,
    calendarEvent: Object
  },
  mixins: [requestsMixin],
  data() {
    return {
      form: {}
    };
  },
  watch: {
    calendarEvent: {
      immediate: true,
      deep: true,
      handler(val, oldVal) {
        this.form = val || {};
      }
    }
  },
  methods: {
    async onSubmit() {
      const isValid = await this.$refs.observer.validate();
      if (!isValid) {
        return;
      }

      this.form.start = moment(this.form.start).format("YYYY-MM-DD HH:mm:ss");
      this.form.end = moment(this.form.end).format("YYYY-MM-DD HH:mm:ss");
      let start = this.form.start;
      let end = this.form.end;
      if (end <= start) {
        alert("End time is invalid, please confirm end time is after start time.");
        return;   //exit function while still in form if user tries time travel into the past
      }
      let title = this.form.title;
      let id = this.form.id;
      if (this.edit) {
        //need to access proper id to edit correct events
        //set id := mongo id made at posting
        //how to access id when click edit event?
        let event = { start, end, title, id };
        console.log("editCalendar(): " + event.start + event.end + event.title + event.id);
        await this.editCalendar(event);
      } else {
        let event = { start, end, title };
        await this.addCalendar(event);
      }
      const response = await this.getCalendar();
      //res_data is the reformatted json body to store calendar array of events for Vuex store
      const res_data = [];
      //parse through response.data to save start,end,title, and id in a calendar array
      //for each observation in response.data
      var obs;
      for (obs in response.data) {
        //console.log("OnSubmit(): " + response.data[obs]);
        res_data[obs] = {
          "start": response.data[obs].start,
          "end": response.data[obs].end,
          "title": response.data[obs].title,
          "id": response.data[obs]._id
        }
      }
      this.$store.commit("setEvents", res_data);
      //console.log("onSubmit(): " + res_data);
      //reload document page onSubmit()
      location.reload();
      this.$emit("eventSaved");
    },
    async deleteEvent(id) {
      await this.deleteCalendar(id);
      //TOBE: Functionalized
      //Display events status with page reload
      location.reload();
      //res_data is the reformatted json body to store calendar array of events for Vuex store
      // const res_data = [];
      // //parse through response.data to save start,end,title, and id in a calendar array
      // //for each observation in response.data
      // var obs;
      // for (obs in response.data) {
      //   console.log(response.data[obs].start);
      //   res_data[obs] = {
      //     "start": response.data[obs].start,
      //     "end": response.data[obs].end,
      //     "title": response.data[obs].title,
      //     "id": response.data[obs]._id
      //   }
      // }
      // this.$store.commit("setEvents", res_data);
      // //console.log("deleteEvent(): " + res_data);
      //this.$emit("eventSaved");
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
button {
  margin-right: 10px;
}
</style>
