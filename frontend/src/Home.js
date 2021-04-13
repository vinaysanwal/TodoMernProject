import React, { useState, useEffect } from "react";

import GoalInput from "./components/goals/GoalInput";
import CourseGoals from "./components/goals/CourseGoals";
import ErrorAlert from "./components/UI/ErrorAlert";

function Home() {
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

  async function addGoalHandler(goalText, goalDescription) {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost/goals", {
        method: "POST",
        body: JSON.stringify({
          text: goalText,
          description: goalDescription,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Adding the goal failed.");
      }

      setLoadedGoals((prevGoals) => {
        const updatedGoals = [
          {
            id: resData.goal.id,
            text: goalText,
            description: goalDescription,
          },
          ...prevGoals,
        ];
        return updatedGoals;
      });
    } catch (err) {
      setError(
        err.message ||
          "Adding a goal failed - the server responsed with an error."
      );
    }
    setIsLoading(false);
  }

  async function deleteGoalHandler(goalId) {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost/goals/" + goalId, {
        method: "DELETE",
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Deleting the goal failed.");
      }

      setLoadedGoals((prevGoals) => {
        const updatedGoals = prevGoals.filter((goal) => goal.id !== goalId);
        return updatedGoals;
      });
    } catch (err) {
      setError(
        err.message ||
          "Deleting the goal failed - the server responsed with an error."
      );
    }
    setIsLoading(false);
  }

  async function updateGoalHandler(goalId, goalText, goalDescription) {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost/goals/" + goalId, {
        method: "POST",
        body: JSON.stringify({
          text: goalText,
          description: goalDescription,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Updating the goal failed.");
      }

      setLoadedGoals((prevGoals) => {
        if (
          resData.goal.text === goalText &&
          resData.goal.description === goalDescription
        ) {
          console.log("Yes loop");
          return prevGoals;
        } else if (
          resData.goal.text !== goalText ||
          resData.goal.description !== goalDescription
        ) {
          console.log("no Loop");
          const updatedGoals = [
            {
              id: resData.goal.id,
              text: goalText,
              description: goalDescription,
            },
            ...prevGoals,
          ];

          const filterUpdatedGoals = updatedGoals.filter(
            (goal) =>
              goal.description === goalDescription && goal.text === goalText
          );

          return filterUpdatedGoals;
        } else {
          return prevGoals;
        }
      });
    } catch (err) {
      setError(
        err.message ||
          "Updating the goal failed - the server responsed with an error."
      );
    }
    setIsLoading(false);
  }

  return (
    <div>
      {error && <ErrorAlert errorText={error} />}
      <GoalInput onAddGoal={addGoalHandler} />
      {!isLoading && (
        <CourseGoals
          goals={loadedGoals}
          onDeleteGoal={deleteGoalHandler}
          onUpdateGoal={updateGoalHandler}
        />
      )}
    </div>
  );
}

export default Home;
