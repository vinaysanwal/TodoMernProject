import React, { useState, useEffect } from "react";

import RegisterInput from "./components/auth/RegisterInput";
import CourseGoals from "./components/goals/CourseGoals";
import ErrorAlert from "./components/UI/ErrorAlert";

function Signup() {
  const [loadedGoals, setLoadedGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(function () {
    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost/goals");

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message || "Fetching the goals failed.");
        }

        setLoadedGoals(resData.goals);
      } catch (err) {
        setError(
          err.message ||
            "Fetching goals failed - the server responsed with an error."
        );
      }
      setIsLoading(false);
    }

    fetchData();
  }, []);

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

      console.log(resData);

      if (!response.ok) {
        throw new Error(resData.message || "Adding the goal failed.");
      }

      // setLoadedGoals((prevGoals) => {
      //   const updatedGoals = [
      //     {
      //       id: resData.goal.id,
      //       text: goalText,
      //       description: goalDescription,
      //     },
      //     ...prevGoals,
      //   ];
      //   return updatedGoals;
      // });
    } catch (err) {
      setError(
        err.message ||
          "Adding a goal failed - the server responsed with an error."
      );
    }
    setIsLoading(false);
  }

  return (
    <div>
      <RegisterInput onAddGoal={loginUserHandler} />
    </div>
  );
}

export default Signup;
