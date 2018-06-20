import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Search from "./pages/Search";
import Saved from "./pages/Saved";
import noUserSearch from "./pages/NoUserSearch";
import "./App.css";

const App = () => (
  <Router>
    <div>
      <Switch>
      <Route exact path="/" component={noUserSearch} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/saved" component={Saved} />
      </Switch>
    </div>
  </Router>
);

export default App;
