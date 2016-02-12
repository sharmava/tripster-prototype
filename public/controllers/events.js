/**
* Created by sasi on 4/22/2015.
*/
/**
* Created by sasi on 4/16/2015.
*/
var eventsApp = angular.module('eventsApp', ['todo']);

eventsApp.controller('eventsController', function($scope, $http) {

    $scope.eventData = {
        text : null,
        done : false
    };

    $http.get('/tripster/authenticate')
        .success(function(data) {
            if (data.error =="Unauthorized User!"){
                alert("Unknown User. Please login and try again!\nRedirecting to Login Page...")
                window.location = "/views/login.html";
                return
            }
        })

    $scope.event_attractionsFetch = function() {
        $http.get("/controllers/data.json")
            .success(function (data) {
                $scope.events = data;
            });

    }

    $scope.addTodo = function (text) {
        $scope.eventData.text = text;
        $scope.eventData.done = false;

        $http.post('/tripster/todos', $scope.eventData)
            .success(function (data) {
                $scope.eventData = {};
                $scope.todos = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };

    //$scope.event_attractionsFetch();
});




