import React, { Fragment, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Home from "../src/Home";
import Login from "../src/Login";
import SignUp from "../src/Signup";

const App = () => {
  const storedJwt = localStorage.getItem("token");
  console.log(`value of storedjwt is ${storedJwt}`);

  return (
    <Router>
      <Fragment>
        <Switch>
          <Route
            exact
            path="/login"
            render={(props) => (storedJwt ? <Redirect to="/" /> : <Login />)}
          />
          <Route
            exact
            path="/"
            render={(props) =>
              storedJwt ? <Home /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/register"
            render={(props) => (storedJwt ? <Redirect to="/" /> : <SignUp />)}
          />
        </Switch>
      </Fragment>
    </Router>
  );
};

export default App;
