'use strict';

var mongoose = require('mongoose'),
  Todo = mongoose.model('Todo');

/**
 * Find todo by id
 */
exports.todo = function(req, res, next, id) {
  Todo.findById(id, function(err, todo) {
    if (err) return next(err);
    if (!todo) return next(new Error('Failed to load todo ' + id));
    req.todo = todo;
    next();
  });
};

/**
 * List of todos
 */
exports.query = function(req, res) {
  Todo.find().sort('-createdAt').exec(function(err, todos) {
    if (err) return res.json(500, err);
    res.json(todos);
  });
};

/**
 * Show a todo
 */
exports.show = function(req, res) {
  res.json(req.todo);
};

/**
 * Create a todo
 */
exports.create = function(req, res) {
  var todo = new Todo(req.body);

  todo.save(function(err) {
    if (err) return res.json(500, err);
    res.json(todo);
  });
};

/**
 * Update a todo
 */
exports.update = function(req, res) {
  Todo.update({ _id: req.todo._id }, req.body, { }, function(err, updatedTodo) {
    if (err) return res.json(500, err);
    res.json(updatedTodo);
  });
};

/**
 * Remove a todo
 */
exports.remove = function(req, res) {
  var todo = req.todo;

  todo.remove(function(err) {
    if (err) return res.json(500, err);
    res.json(todo);
  });
};