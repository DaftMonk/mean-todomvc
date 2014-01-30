'use strict';

angular.module('todomvcApp')
  .controller('MainCtrl', function ($scope, $timeout, Todo, filterFilter, $location) {
    $scope.todos = [];
    $scope.newTodo = '';
    $scope.editedTodo = null;
    $scope.status = $location.search().q || '';

    $scope.$watch('todos', function () {
      $scope.remainingCount = filterFilter($scope.todos, { completed: false }).length;
      $scope.completedCount = $scope.todos.length - $scope.remainingCount;
      $scope.allChecked = !$scope.remainingCount;
    }, true);

    // Monitor the current location for changes and adjust the filter accordingly.
    $scope.$on('$locationChangeSuccess', function () {
      var status = $scope.status = $location.search().q || '';
      $scope.statusFilter = (status === 'active') ?
        { completed: false } : (status === 'completed') ?
        { completed: true } : null;
    });

    $scope.addTodo = function () {
      var todoTitle = $scope.newTodo.trim();
      if (!todoTitle.length) {
        return;
      }

      var newTodo = new Todo({
        title: todoTitle,
        completed: false
      });
      newTodo.$save();
      $scope.todos.unshift(newTodo);
      $scope.newTodo = '';
    };

    $scope.editTodo = function (id) {
      $scope.editedTodo = $scope.todos[id];
      $scope.originalTodo = angular.extend({}, $scope.editedTodo);
    };

    $scope.doneEditing = function (id) {
      $scope.editedTodo = null;
      var title = $scope.todos[id].title.trim();
      if (title) {
        $scope.todos[id].$update();
      } else {
        $scope.removeTodo(id);
      }
    };

    $scope.revertEditing = function (id) {
      $scope.todos[id] = $scope.originalTodo;
      $scope.doneEditing(id);
    };

    $scope.removeTodo = function (id) {
      $scope.todos[id].$remove();
      $scope.todos.splice(id, 1);
    };

    $scope.toggleCompleted = function (id) {
      var todo = $scope.todos[id];
      todo.completed = !todo.completed;
      todo.$update();
    };

    $scope.clearCompletedTodos = function () {
      var remainingTodos = [];
      angular.forEach($scope.todos, function (todo) {
        if (todo.completed) {
          todo.$remove();
        } else {
          remainingTodos.push(todo);
        }
      });
      $scope.todos = remainingTodos;
    };

    $scope.markAll = function (allCompleted) {
      angular.forEach($scope.todos, function (todo) {
        todo.completed = !allCompleted;
        todo.$update();
      });
    };

    // Poll server to regularly update todos
    (function refreshTodos() {
      Todo.query(function(response) {
        // Update todos if a todo is not being edited
        if($scope.editedTodo === null) {
          $scope.todos = response;
        }
        $scope.promise = $timeout(refreshTodos, 5000);
      });
    })();

    $scope.$on('destroy', function(){
      $timeout.cancel($scope.promise);
    });
  });
