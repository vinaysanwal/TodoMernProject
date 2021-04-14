const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("./middleware/auth");
const bcrypt = require("bcryptjs");

const Goal = require("./models/goal");
const User = require("./models/user");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({
        errors: [
          {
            msg: "Users already Exists",
          },
        ],
      });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//to get the user data
app.get("/users", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//login user

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        errors: [
          {
            msg: "Invalid Credentials",
          },
        ],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/goals", async (req, res) => {
  console.log("TRYING TO FETCH GOALS");
  try {
    const goals = await Goal.find();
    res.status(200).json({
      goals: goals.map((goal) => ({
        id: goal.id,
        text: goal.text,
        description: goal.description,
      })),
    });
    console.log("FETCHED GOALS");
  } catch (err) {
    console.error("ERROR FETCHING GOALS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to load goals." });
  }
});

app.post("/goals", async (req, res) => {
  console.log("TRYING TO STORE GOAL");
  const goalText = req.body.text;
  const goalDescriptionText = req.body.description;

  console.log(req.body);

  if (
    !goalText ||
    goalText.trim().length === 0 ||
    !goalDescriptionText ||
    goalDescriptionText.trim().length === 0
  ) {
    console.log("INVALID INPUT - NO TEXT");
    return res.status(422).json({ message: "Invalid goal text." });
  }

  const goal = new Goal({
    text: goalText,
    description: goalDescriptionText,
  });

  try {
    await goal.save();
    res
      .status(201)
      .json({ message: "Goal saved", goal: { id: goal.id, text: goalText } });
    console.log("STORED NEW GOAL");
  } catch (err) {
    console.error("ERROR FETCHING GOALS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to save goal." });
  }
});

app.delete("/goals/:id", async (req, res) => {
  console.log("TRYING TO DELETE GOAL");
  try {
    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Deleted goal!" });
    console.log("DELETED GOAL");
  } catch (err) {
    console.error("ERROR FETCHING GOALS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to delete goal." });
  }
});

app.post("/goals/:id", async (req, res) => {
  console.log("TRYING TO Update GOAL");
  console.log(`I am param id ${req.params.id}`);
  console.log(req.body.id);
  try {
    await Goal.findById({ _id: req.params.id }, (err, todo) => {
      if (!todo) {
        res.status(404).json({ message: "Goal Not Found" });
      } else {
        todo.text = req.body.text;
        todo.description = req.body.description;

        todo.save();
        res.status(201).json({
          message: "todo saved",
          goal: { id: todo.id, text: todo.text, description: todo.description },
        });
        console.log("STORED NEW GOAL");
      }
    });
  } catch (err) {
    console.error("ERROR FETCHING GOALS");
    console.error(err.message);
    res.status(500).json({ message: "Failed to Update goal." });
  }
});

mongoose.connect(
  `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/course-goals?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error("FAILED TO CONNECT TO MONGODB");
      console.error(err);
    } else {
      console.log("CONNECTED TO MONGOD");
      app.listen(80);
    }
  }
);
