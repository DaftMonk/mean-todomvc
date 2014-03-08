'use strict';

var should = require('should'),
    app = require('../../../server'),
    mongoose = require('mongoose'),
    Todo = mongoose.model('Todo'),
    request = require('supertest');

describe('GET /api/todos', function() {
  
  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/todos')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

describe('POST /api/todos', function() {
  
  it('should respond with added todo', function(done) {
    request(app)
      .post('/api/todos')
      .send({
        title: 'todoTitle',
        completed: false
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(done);
  });

  afterEach(function(done) {
    Todo.remove().exec();
    done();
  });
});

describe('PUT /api/todos/:todoId', function() {
  var todo,
      updatedName = 'newTitle';

  beforeEach(function(done) {
    todo = new Todo({
      title: 'todoTitle',
      completed: false
    });

    todo.save(function(err) {
      done();
    });
  });

  afterEach(function(done) {
    Todo.remove().exec();
    done();
  });

  function sendRequest() {
    return request(app)
      .put('/api/todos/' + todo._id)
      .send({
        title: updatedName,
        completed: false
      });
  }

  it('should respond with todo', function(done) {
    sendRequest()
      .expect(200)
      .expect('Content-Type', /json/)
      .end(done);
  });

  it('should update todo in database', function(done) {
    sendRequest()
      .end(function() {
        Todo.findById(todo._id, function(err, updatedTodo) {
          updatedTodo.title.should.equal(updatedName);
          done();
        });
      });
  });
});

describe('DEL /api/todos/:todoId', function() {
  var todo;

  beforeEach(function(done) {
    todo = new Todo({
      title: 'todoTitle',
      completed: false
    });

    todo.save(function(err) {
      done();
    });
  });

  afterEach(function(done) {
    Todo.remove().exec();
    done();
  });

  function sendRequest() {
    return request(app)
      .del('/api/todos/' + todo._id);
  }

  it('should respond with 200', function(done) {
    sendRequest()
      .expect(200).end(done);
  });

  it('should delete the todo from the database', function(done) {
    sendRequest()
      .expect(200).end(function() {
        Todo.find({}, function(err, todos) {
          todos.should.have.length(0);
          done();
        });
      });
  });
});
