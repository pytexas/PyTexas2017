import Vue from "vue";

import { image, resize, time } from "../filters";
import { get_data, extract_sessions } from "../data";

export var Program = Vue.component("program-page", {
  template: "#tpl-pages-program",
  filters: { image: image, time: time },
  props: ["day"],
  data() {
    return {
      sessions: [],
      rooms: [],
      title: "Program"
    };
  },
  created() {
    this.init();
  },
  watch: { $route: "init" },
  methods: {
    resize: resize,
    init() {
      if (this.day == 18) {
        this.title = "Saturday 11/18";
      } else {
        this.title = "Sunday 11/19";
      }

      get_data()
        .then(data => {
          var sessions = extract_sessions(data, parseInt(this.day));
          var date_map = {};
          var structured = [];
          this.rooms = [];

          sessions.forEach(s => {
            var key = s.start.toLocaleTimeString();
            if (s.room) {
              if (this.rooms.indexOf(s.room.id) > -1) {
              } else {
                this.rooms.push(s.room.id);
              }
            }

            if (date_map[key]) {
              date_map[key].count += 1;
            } else {
              date_map[key] = { count: 1, allRooms: s.allRooms };
            }
          });

          this.rooms.sort();
          var last_date = null;
          sessions.forEach(function(s) {
            var key = s.start.toLocaleTimeString();
            if (date_map[key].allRooms) {
              structured.push(s);
            } else {
              if (date_map[key].count == 2) {
                if (key == last_date) {
                  structured[structured.length - 1][s.room.id] = [s];
                } else {
                  let temp = {};
                  temp[s.room.id] = [s];
                  structured.push(temp);
                }
              } else {
                structured[structured.length - 1][s.room.id].push(s);
              }
            }

            last_date = key;
          });

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
  props: ["session"],
  filters: { image: image, time: time },
  data() {
    return {
      html: ""
    };
  },
  created() {
    var converter = new showdown.Converter({ tables: true });
    this.html = converter.makeHtml(this.session.description);
  },
  watch: {
    session: function(val, oldVal) {
      var converter = new showdown.Converter({ tables: true });
      this.html = converter.makeHtml(this.session.description);
    }
  }
});

export default Program;
