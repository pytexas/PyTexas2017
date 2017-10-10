import { image } from "./filters";

var YEAR = "2017";

export var NAV_LINKS = [
  // {
  //   name: "Speaking",
  //   url: "/page/talks/speaking",
  //   icon: image("img/icons/talks.svg")
  // },
  {
    name: "Sponsor",
    url: "/page/sponsors/prospectus",
    icon: image("img/icons/sponsors.svg")
  },
  {
    name: "About",
    url: "/page/about/registration",
    icon: image("img/icons/about.svg")
  },
  {
    name: "Venue",
    url: "/page/venue/map",
    icon: image("img/icons/venue.svg")
  },
  {
    name: "Community",
    url: "/page/community/meetups",
    icon: image("img/icons/community.svg")
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
