import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import LoginInput from "./components/auth/LoginInput";

function Login() {
  const storedJwt = localStorage.getItem("token");
  const [jwt, setJwt] = useState(storedJwt || null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loginUserHandler(userEmail, userPassword) {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost/login", {
        method: "POST",
        body: JSON.stringify({
          email: userEmail,
          password: userPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();
      if (resData.token) {
        await localStorage.setItem("token", resData.token);
        setJwt(resData.token);
        window.location.reload();
      }

      if (!response.ok) {
        throw new Error(resData.message || "Login failed.");
      }
    } catch (err) {
      setError(
        err.message || "Login failed - the server responsed with an error."
      );
    }
    setIsLoading(false);
  }

  return (
    <div>
      <LoginInput onAddGoal={loginUserHandler} />
    </div>
  );
}

export default Login;
