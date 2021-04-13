import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import "./GoalItem.css";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function GoalItem(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [showTextValue, setShowTextValue] = useState(false);

  //components for form
  const [enteredGoalId, setEnteredGoalId] = useState(props.id);
  const [enteredGoalText, setEnteredGoalText] = useState(props.text);
  const [enteredDescriptionText, setEnteredDescriptionText] = useState(
    props.description
  );

  function updateGoalTextHandler(event) {
    setEnteredGoalText(event.target.value);
  }

  function updateGoalDescriptionHandler(event) {
    setEnteredDescriptionText(event.target.value);
  }

  function goalUpdateSubmitHandler(event) {
    event.preventDefault();

    if (
      enteredGoalText.trim().length === 0 ||
      enteredDescriptionText.trim().lenght === 0
    ) {
      alert("Invalid text - please enter a longer one!");
      return;
    }

    props.onUpdate(enteredGoalId, enteredGoalText, enteredDescriptionText);

    setEnteredGoalText(props.text);
    setEnteredDescriptionText(props.description);
  }

  //end of components for form

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form onSubmit={goalUpdateSubmitHandler}>
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
        <button>Update Goal</button>
      </form>
    </div>
  );

  function showHiddenText() {
    setShowTextValue(true);
  }

  return (
    <li className="goal-item">
      <p onClick={showHiddenText}>{props.text}</p>
      <p> {showTextValue ? props.description : ""}</p>
      <p onClick={props.onDelete.bind(null, props.id)}>Delete</p>
      <p onClick={handleOpen}>Update</p>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </li>
  );
}

export default GoalItem;
