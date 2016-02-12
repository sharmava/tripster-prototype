var app = angular.module('dashboard', []);

    app.controller('TabController', function($scope, $http){

        $http.get('/tripster/authenticate')
            .success(function(data) {
                if (data.error =="Unauthorized User!"){
                    alert("Unknown User. Please login and try again!\nRedirecting to Login Page...")
                    window.location = "/views/login.html";
                    return
                }
            })

        this.tab = 1;

        this.setTab = function(newValue){
            this.tab = newValue;
        };

        this.isSet = function(tabName){
            return this.tab === tabName;
        };


    });

app.controller('eventsController', function($scope, $http) {
    //  alert("inside controller");

    // var events = [];
    $http.get("/controllers/data.json")
        .success(function (data) {
            $scope.events = data;
        //   alert("after reading from json file");

    });
    //alert($scope.events);

    $scope.addEvent = function(emp)
    {
        alert($scope.events[emp].name + " has been added to the calendar");
    }

});

app.controller("planAppController", function($scope,$http){
    $scope.name = null;
    $scope.detination = null;
    $scope.description = null;
    $scope.invites = null;
    $scope.startDate = null;
    $scope.endDate = null;

    $scope.planDetails = {
        "Name" : $scope.name,
        "Destination" : $scope.destination,
        "Description" : $scope.description,
        "Invites" : $scope.invites,
        "StartDate" : $scope.startDate,
        "EndDate" : $scope.endDate
    };

    $scope.savePlanDetails = function(){
        $http.post('/tripster/savePlan',$scope.planDetails)
            .success(function(data) {
                alert("Plan saved successfully!!!");
            })
            .error(function(data){
                alert("Something went wrong. Please try again.");
                console.log("Tripster#plan#save-  Error for data : "+ data);

            });
    }

    $scope.tripEvents = function(){
        alert("test");
        window.location.href = "./views/events.html";
    }
});


