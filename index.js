const express = require("express");
const exphbs = require("express-handlebars");
const todoArr = require("./data/todoArr");
const res = require("express/lib/response");
const dateTime = require("node-datetime");
const req = require("express/lib/request");

const app = express();
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//function for unique id
function getNewId(list) {
  let maxId = 0;
  for (const item of list) {
    if (item.id > maxId) {
      maxId = item.id;
    }
  }
  return maxId + 1;
}

//get 6 routes
app.get("/", (req, res) => {
  res.render("todos", { todoArr });
});

app.get("/new", (req, res) => {
  res.render("new-todo");
});

app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todoArr.find((t) => t.id === id);
  res.render("clicked-todo", todo);
});

app.get("/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todoArr.find((t) => t.id === id);
  res.render("edit-todo", todo);
});

app.get("/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todoArr.find((t) => t.id === id);
  res.render("delete-todo", todo);
});

app.get("/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todoArr.find((t) => t.id === id);
  res.render("status-todo", todo);
});

//add new todo. Add id and timestamp
app.post("/new", (req, res) => {
  const newId = getNewId(todoArr);
  let dt = dateTime.create();
  let formatted = dt.format("Y-m-d H:M:S");
  const newTodo = {
    id: newId,
    created: formatted,
    description: req.body.description,
    done: false,
  };
  todoArr.push(newTodo);

  res.redirect("/");
});

//delete todo
app.post("/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todoArr.findIndex((t) => t.id === id);

  todoArr.splice(index, 1);
  res.redirect("/");
});

//edit description of todo
app.post("/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todoArr.findIndex((t) => t.id === id);

  todoArr[index].description = req.body.description;
  res.redirect("/" + id);
});

//edit status of todo
app.post("/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todoArr.findIndex((t) => t.id === id);

  if (req.body.done) {
    todoArr[index].done = true;
    todoArr[index].description = todoArr[index].description + " ✓";
  } else {
    todoArr[index].done = false;
    todoArr[index].description =
      todoArr[index].description + " this todo is undone";
  }
  res.redirect("/");
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
