import React, { useState, useEffect } from "react";

import RegisterInput from "./components/auth/RegisterInput";
import CourseGoals from "./components/goals/CourseGoals";
import ErrorAlert from "./components/UI/ErrorAlert";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const storedJwt = localStorage.getItem("token");
  const [jwt, setJwt] = useState(storedJwt || null);

  async function loginUserHandler(userName, userEmail, userPassword) {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost/register", {
        method: "POST",
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          password: userPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();
      if (resData.token) {
        localStorage.setItem("token", resData.token);
        setJwt(resData.token);
        window.location.reload();
      }

      if (!response.ok) {
        throw new Error(resData.message || "Registration falied");
      }
    } catch (err) {
      setError(
        err.message ||
          "Registration failed- the server responsed with an error."
      );
    }
    setIsLoading(false);
  }

  return (
    <div>
      {jwt ? (
        <Redirect to="/" />
      ) : (
        <RegisterInput onAddGoal={loginUserHandler} />
      )}
    </div>
  );
}

export default Signup;
