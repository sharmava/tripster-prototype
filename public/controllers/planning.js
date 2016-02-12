/**
 * Created by sharmava on 4/15/15.
 */

var planApp = angular.module("planApp",['ngRoute',
  'planApp.filters',
  'planApp.directives',
  "iso-3166-country-codes",
  'ngResource']).config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/forecast', {templateUrl: '../controllers/weather/partials/forecast.html', controller: 'planAppController'});
  $routeProvider.when('/storm', {templateUrl: 'partials/storm.html', controller: 'OpenWeatherCtrl'});
  $routeProvider.otherwise({redirectTo: '/forecast'});
}]);

  planApp.value('version', '0.1.4')


  //
  // Define a standard list of "example locations"
  //
  planApp.value('exampleLocations',['Hamburg','Berlin','Tokyo','New York','Moscow','Clonakilty'])
  //
  // Storm "Xaver" special locations
  //
  planApp.value('stormLocations',['Sylt','St. Peter-Ording','Husum','Bremerhaven','Hamburg','Kiel','Lübeck'])


planApp.controller("planAppController", ['$scope', '$http', 'planAppFact', 'exampleLocations','stormLocations','ISO3166',
      function($scope,$http,planAppFact,exampleLocations,stormLocations,ISO3166) {
    
        
        $scope.message = '';
    $scope.hasState = '';

    // Expose example locations to $scope
    $scope.exampleLocations = exampleLocations;
    $scope.stormLocations = stormLocations;
    $scope.iconBaseUrl = 'http://openweathermap.org/img/w/';

    // On initialization load data for first example entry
    $scope.forecast = planAppFact.queryForecastDaily({
      location: exampleLocations[ 0 ]
    });

    // Get forecast data for location as given in $scope.location
    $scope.getForecastByLocation = function() {
      console.log($scope.planDetails.Destination);
      if ($scope.planDetails.Destination == '' || $scope.planDetails.Destination == undefined) {
        $scope.hasState = 'has-warning';
        $scope.message = 'Please provide a location';
        return;
      }
      $scope.hasState = 'has-success';
      //$scope.location = 'Mumbai';

      $scope.forecast = planAppFact.queryForecastDaily({
        location: $scope.planDetails.Destination
      });
      console.log($scope.forecast);
    };

    $scope.UserDetails  = null;
    $scope.UserName = null;
    $scope.FirstName = null;
    $scope.LastName = null;
    $scope.Friends = null;
    $scope.profilePicPath = null;


    $http.get('/tripster/authenticate')
        .success(function(data) {
            if (data.error =="Unauthorized User!"){
                alert("Unknown User. Please login and try again!\nRedirecting to Login Page...")
                window.location = "/views/login.html";
                return
            }
            else{
                $scope.UserDetails  = data.userObject
                $scope.UserName = $scope.UserDetails.UserName
                $scope.FirstName = $scope.UserDetails.FirstName
                $scope.LastName = $scope.UserDetails.LastName
                $scope.Friends = $scope.UserDetails.Friends
                $scope.profilePicPath = $scope.UserDetails.ProfilePicturePath
                if ( $scope.profilePicPath!=null &&  $scope.profilePicPath !=''){
                    $scope.extractAndSetProfilePicture( $scope.profilePicPath);
                }
            }
        });

    $scope.extractAndSetProfilePicture = function (imgPath){
        relativeImgPath = imgPath.slice(imgPath.indexOf('public/')+6)
        document.getElementById("profilePicture").src = relativeImgPath
    }
    $scope.currentPlan = false;
    $scope.formData = {};
    $scope.todos = [];

    $scope.myPlansList = [];

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

    $scope.showPlan =function(showPlan){
        $scope.currentPlan = false;
    }
        $scope.savePlanDetails = function(){
        console.log($scope.planDetails.Destination);
        
        $scope.getForecastByLocation($scope.planDetails.Destination);
         $scope.myPlansList.push($scope.planDetails);
       //  alert("save plan function called");
         $http.post('/tripster/savePlan',$scope.planDetails)
             .success(function(data) {
                 $scope.currentPlan = true;
                 alert("Plan saved successfully. Please add items to your To-Do list");
             })
             .error(function(data){
                 alert("savePlan failed");
                 console.log("Tripster#plan#save-  Error for data : "+ data);

             });
     }



    // when landing on the page, get all todos and show them
    $http.get('/tripster/todos')
        .success(function (data) {
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


}]);

planApp.factory('planAppFact', function($resource) {

    // API key is currently unused (work either with or without key)
    var apiKey = '279b4be6d54c8bf6ea9b12275a567156';
    var apiBaseUrl = 'http://api.openweathermap.org/data/2.5/';

    return $resource(apiBaseUrl + ':path/:subPath?q=:location',
      {
//        APPID: apiKey,
        mode: 'jsonp',
        callback: 'JSON_CALLBACK',
        units: 'metric',
        lang: 'en'
      },
      {
        queryWeather: {
          method: 'JSONP',
          params: {
            path: 'weather'
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        },
        queryForecast: {
          method: 'JSONP',
          params: {
            path: 'forecast'
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        },
        queryForecastDaily: {
          method: 'JSONP',
          params: {
            path: 'forecast',
            subPath: 'daily',
            cnt: 16
          },
          isArray: false,
          headers: {
            'x-api-key': apiKey
          }
        }
      }
    )
  });
