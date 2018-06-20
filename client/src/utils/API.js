import axios from "axios";

// The getJobs method retrieves jobs from the server
// It accepts a "query" or term to search the jobs api for
export default {
  submitSearch: function (query) {
    return axios.post("/search?q=" + query);
  },
  getSearch: function () {
    return axios.get("/search");
  },
  getSaved: function () {
    return axios.get("/saved");
  },
  saveJob: function (id) {
    console.log('addJob obj', id);
    return axios.post("/saved?id=" + id);
  },
  logIn: function (obj) {
    return axios.post("/login", obj)
  },
  logOut: function () {
    return axios.get("/logout")
  },
  register: function (obj) {
    return axios.post("/register", obj)
  },
  deleteJob: function (id) {
    return axios.delete("/saved?id=" + id)
  },
  getTasks: function (id) {
    return axios.get("/tasks?job=" + id)
  },
  addTask: function (id, task) {
    return axios.post("/tasks?job=" + id + "&task=" + task)
  },
  removeTask: function (id) {
    return axios.delete("/tasks?id=" + id)
  },
  noUserSearch: function (query) {
    return axios.get("/noUserSearch?q=" + query)
  },
  isLoggedIn: function () {
    return axios.get("/isLoggedIn")
  },
  isntLoggedIn: function () {
    return axios.get("/isntLoggedIn")
  }
};


// id,title,description,post_date,company_name,company_city,_company_state,keywords,apply_url,company_url