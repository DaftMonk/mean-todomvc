'use strict';

var index = require('./controllers'),
    todos = require('./controllers/todos');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.param('todoId', todos.todo);
  app.post('/api/todos', todos.create);
  app.get('/api/todos', todos.query);
  app.get('/api/todos/:todoId', todos.show);
  app.put('/api/todos/:todoId', todos.update);
  app.del('/api/todos/:todoId', todos.remove);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', index.index);
};