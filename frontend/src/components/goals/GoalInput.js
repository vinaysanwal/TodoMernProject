import React, { useState } from "react";

import "./GoalInput.css";
import Card from "../UI/Card";

function GoalInput(props) {
  const [enteredGoalText, setEnteredGoalText] = useState("");
  const [enteredDescriptionText, setEnteredDescriptionText] = useState("");

  function updateGoalTextHandler(event) {
    setEnteredGoalText(event.target.value);
  }

  function updateGoalDescriptionHandler(event) {
    setEnteredDescriptionText(event.target.value);
  }

  function goalSubmitHandler(event) {
    event.preventDefault();

    if (
      enteredGoalText.trim().length === 0 ||
      enteredDescriptionText.trim().lenght === 0
    ) {
      alert("Invalid text - please enter a longer one!");
      return;
    }

    props.onAddGoal(enteredGoalText, enteredDescriptionText);

    setEnteredGoalText("");
    setEnteredDescriptionText("");
  }

  return (
    <section id="goal-input">
      <Card>
        <form onSubmit={goalSubmitHandler}>
          <label htmlFor="text">New Goal</label>
          <input
            type="text"
            id="text"
            value={enteredGoalText}
            onChange={updateGoalTextHandler}
            placeholder="Add A Text"
          />
          <input
            type="description"
            id="description"
            value={enteredDescriptionText}
            onChange={updateGoalDescriptionHandler}
            placeholder="Add a Description"
          />
          <button>Add Goal</button>
        </form>
      </Card>
    </section>
  );
}

export default GoalInput;
