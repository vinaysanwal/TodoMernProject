import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../src/Home";
import Login from "../src/Login";
import SignUp from "../src/Signup";

const App = () => {
  return (
    <Router>
      <Fragment>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={SignUp} />
        </Switch>
      </Fragment>
    </Router>
  );
};

export default App;
