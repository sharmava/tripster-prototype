var todoApp = angular.module('todo', []);

todoApp.controller("todoController", function($scope, $http){

    $scope.formData = {};
    $scope.todos = [];

    $http.get('/tripster/authenticate')
        .success(function(data) {
            if (data.error =="Unauthorized User!"){
                alert("Unknown User. Please login and try again!\nRedirecting to Login Page...")
                window.location = "/views/login.html";
                return;
            }
        });

   // when landing on the page, get all todos and show them
    $http.get('/tripster/todos')
        .success(function (data) {
            if (data.error =="Unauthorized User!"){
                alert("Unknown User. Please login and try again!\nRedirecting to Login Page...")
                window.location = "/views/login.html";
                return
            }
            $scope.todos = data;
        })
        .error(function (data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function () {
        $http.post('/tripster/todos', $scope.formData)
            .success(function (data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    $scope.createEventTodo = function (text) {
        $scope.formData.text = text;
        $http.post('/tripster/todos', $scope.formData)
            .success(function (data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };


    // delete a todo after checking it
    $scope.deleteTodo = function (id) {
        $http.delete('/tripster/todos/' + id)
            .success(function (data) {
                $scope.todos = data;
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

     $scope.event_attractionsFetch = function() {
        $http.get("/controllers/data.json")
            .success(function (data) {
                $scope.events = data;
            });

    }


});


