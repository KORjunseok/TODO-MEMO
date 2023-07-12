const express = require("express");
const Todo = require("../models/todo.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});

router.post("/todos", async (req, res) => {
  const { value } = req.body;
  const maxOrderByUserId = await Todo.findOne().sort("-order").exec();

  const order = maxOrderByUserId
    ? maxOrderByUserId.order + 1 // maxOrderByUserId 있을 때,
    : 1; // maxOrderByUserId 없을 때
  const todo = new Todo({ value, order });
  await todo.save();
  res.send({ todo });
});

module.exports = router;
