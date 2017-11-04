import Vue from "vue";

import { image, resize, time } from "../filters";
import { get_data, extract_sessions } from "../data";

export var Program = Vue.component("program-page", {
  template: "#tpl-pages-program",
  filters: { image: image, time: time },
  props: ['day'],
  data() {
    return {
      sessions: [],
      title: "Program"
    };
  },
  created() {
    this.init();
  },
  watch: {'$route': 'init'},
  methods: {
    resize: resize,
    init() {
      if (this.day == 18) {
        this.title = 'Saturday 11/18';
      } else {
        this.title = 'Sunday 11/19';
      }
      
      get_data()
        .then(result => {
          var sessions = extract_sessions(result.data, parseInt(this.day));
          var date_map = {};
          var structured = [];
          var rooms = [];
          
          sessions.forEach(function (s) {
            var key = s.start.toLocaleTimeString();
            if (rooms.indexOf(s.room.id) > -1) {}
            else {
              rooms.push(s.room.id);
            }
            
            if (date_map[key]) {
              date_map[key].count += 1;
            } else {
              date_map[key] = {count: 1, allRooms: s.allRooms};
            }
          });
          console.log(date_map);
          
          var last_date = null;
          sessions.forEach(function (s) {
            var key = s.start.toLocaleTimeString();
            if (date_map[key].allRooms) {
              structured.push(s);
            } else {
              if (date_map[key].count == 2) {
                if (key == last_date) {
                  structured[structured.length - 1].push([s]);
                } else {
                  structured.push([[s]]);
                }
              } else {
                let index = rooms.indexOf(s.room.id);
                structured[structured.length - 1][index].push(s);
              }
            }
            
            last_date = key;
          });
          
          console.log(rooms);
          console.log(structured);
          this.sessions = structured;
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
});

export var Session = Vue.component("program-session", {
  template: "#tpl-pages-session",
  props: ['session'],
  filters: { image: image, time: time }
});

export default Program;
