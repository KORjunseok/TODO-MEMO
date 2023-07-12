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

router.get("/todos", async (req, res) => {
  const todos = await Todo.find().sort("-order").exec();

  res.send({ todos });
});

router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { order } = req.body;

  const currentTodo = await Todo.findById(todoId);
  if (!currentTodo) {
    throw new Error("존재하지 않는 todo 데이터입니다.");
  }

  if (order) {
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      targetTodo.order = currentTodo.order;
      await targetTodo.save();
    }
    currentTodo.order = order;
  }

  await currentTodo.save();

  res.send({});
});

router.delete("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;

  const currentTodo = await Todo.findById(todoId);
  if (!currentTodo) {
    res.status(400).json({ errormessage: "존재하지 않는 할 일입니다." });
  } else {
    await Todo.deleteOne({ _id: todoId });
    res.status(200).json({ message: "할 일 삭제 완료!" });
  }
});

router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const { order, value, done } = req.body;

  const currentTodo = await Todo.findById(todoId).exec();
  if (!currentTodo) {
    throw new Error("존재하지 않는 todo 데이터입니다.");
  }

  if (order) {
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      targetTodo.order = currentTodo.order;
      await targetTodo.save();
    }
    currentTodo.order = order;
  } else if (value) {
    currentTodo.value = value;
  } else if (done !== undefined) {
    currentTodo.doneAt = done ? new Date() : null;
  }

  await currentTodo.save();

  res.send({});
});

module.exports = router;
