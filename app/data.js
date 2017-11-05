import { image } from "./filters";

var YEAR = "2017";

export var NAV_LINKS = [
  {
    name: "Talks",
    url: "/program",
    icon: image("img/icons/talks.svg")
  },
  {
    name: "About",
    url: "/page/about/registration",
    icon: image("img/icons/about.svg")
  },
  {
    name: "Location",
    url: "/page/venue",
    icon: image("img/icons/venue.svg")
  },
  {
    name: "Community",
    url: "/page/community/meetups",
    icon: image("img/icons/community.svg")
  },
  {
    name: "Sponsor",
    url: "/page/sponsors/prospectus",
    icon: image("img/icons/sponsors.svg")
  },
  {
    name: "Blog",
    url: "https://medium.com/pytexas",
    external: true,
    icon: image("img/icons/blog.svg")
  }
];

export function get_data() {
  return new Promise(function(resolve, reject) {
    axios
      .get(`/conference/data/${YEAR}.json`)
      .then(function(result) {
        resolve(result);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}

export function extract_nodes(edges) {
  var extracted = [];

  edges.forEach(function(edge) {
    extracted.push(edge.node);
  });

  return extracted;
}

export function extract_sponsors(data) {
  var sponsors = [];
  data.allConfs.edges[0].node.sponsorshiplevelSet.edges.forEach(function(
    level
  ) {
    if (level.node.sponsorSet.edges.length > 0) {
      let formatted = Object.assign({}, level.node);

      formatted.sponsors = extract_nodes(level.node.sponsorSet.edges);
      delete formatted.sponsorSet;

      sponsors.push(formatted);
    }
  });

  return sponsors;
}

export function extract_sessions(data, day) {
  var sessions = {};
  
  extract_nodes(data.allSessions.edges).forEach(function(session) {
    session.slug = session.name.toLowerCase().replace(/\s+/g, "-");
    session.start = new Date(session.start);
    
    var d = session.start.getDate();
    if (sessions[d]) {
      sessions[d].push(session);
    } else {
      sessions[d] = [session];
    }
  });
  
  return sessions[day].sort(function (a, b) {
    if (a.start < b.start) {
      return -1;
    } else if (a.start > b.start) {
      return 1;
    }
    
    return 0;
  });
}

export function extract_keynotes(data) {
  return extract_nodes(data.allKeynotes.edges).map(function(keynote) {
    keynote.slug = keynote.name.toLowerCase().replace(/\s+/g, "-");
    return keynote;
  });
}
