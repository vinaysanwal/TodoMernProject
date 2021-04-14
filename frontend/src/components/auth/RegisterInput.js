import React, { useState } from "react";

import "./Input.css";
import Card from "../UI/Card";

function LoginInput(props) {
  const [enteredNameText, setEnteredNameText] = useState("");
  const [enteredEmailText, setEnteredEmailText] = useState("");
  const [enteredPasswordText, setEnteredPasswordText] = useState("");

  function updateUserEmailHandler(event) {
    setEnteredEmailText(event.target.value);
  }

  function updateUserNameHandler(event) {
    setEnteredNameText(event.target.value);
  }

  function updateUserPasswordHandler(event) {
    setEnteredPasswordText(event.target.value);
  }

  function userSubmitHandler(event) {
    event.preventDefault();

    if (
      enteredEmailText.trim().length === 0 ||
      enteredPasswordText.trim().lenght === 0 ||
      enteredNameText.trim().length === 0
    ) {
      alert("Invalid text");
      return;
    }

    props.onAddGoal(enteredNameText, enteredEmailText, enteredPasswordText);

    setEnteredEmailText("");
    setEnteredPasswordText("");
    setEnteredNameText("");
  }

  return (
    <section id="goal-input">
      <Card>
        <form onSubmit={userSubmitHandler}>
          <label htmlFor="text">Register User</label>
          <input
            type="text"
            id="name"
            value={enteredNameText}
            onChange={updateUserNameHandler}
            placeholder="Enter Full Name"
          />
          <input
            type="email"
            id="email"
            value={enteredEmailText}
            onChange={updateUserEmailHandler}
            placeholder="Enter Your Email"
          />
          <input
            type="text"
            id="password"
            value={enteredPasswordText}
            onChange={updateUserPasswordHandler}
            placeholder="Enter Your Password"
          />
          <button>Login</button>
        </form>
      </Card>
    </section>
  );
}

export default LoginInput;
