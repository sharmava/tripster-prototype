/**
 * Created by sasi on 4/16/2015.
 */
var friendrequestPage = angular.module('friendrequestPage', []);

friendrequestPage.controller('friendRequestController', function($scope, $http) {

    $http.get('/tripster/authenticate')
        .success(function(data) {
            if (data.error =="Unauthorized User!"){
                alert("Unknown User. Please login and try again!\nRedirecting to Login Page...")
                window.location = "/views/login.html";
                return
            }
        })

    $scope.email = {  "to"	: $scope.to,
        "from"   : 'rohisasi@indiana.edu',
        "subject" :' Join Tripster',
        "content": $scope.content};

    $scope.sendRequest = function () {

       alert('sending to ' + $scope.email.to);
        console.log("TEST");
        //Request
        $http.post('/email', $scope.email)
            .success(function(data, status) {
                console.log("Sent ok");
            })
            .error(function(data, status) {
                console.log("Error");
            })

    }




});



