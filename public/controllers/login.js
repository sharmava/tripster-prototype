var userLogin = angular.module('loginPage', []);

userLogin.controller('loginCheck', function($scope, $http) {

	$scope.Email = '';
	$scope.Password = '';
    $scope.flashMsg = ''
	$scope.validUser = false;

    $http.get('/flash')
        .success(function(data) {
            if (data['error']!= null){
                $scope.flashMsg = data['error'][0] + '!'
            }
        })

    /*
     //This code is for submission of form from Java Script,
     //it was written in attempt to get user name from the passport js
    $scope.loginUser = function(){
        var formElement = document.getElementById("loginForm");
        console.log(formElement)
        var request = new XMLHttpRequest();
        request.open("POST", "/tripster/login");
        request.onload = function(oEvent) {
            if (request.status == 200) {
                console.log(request.response)
            } else {
                console.log(request.response)
            }
        };
        request.send(new FormData(formElement));
    }*/

	$scope.validateLogIn = function() {
		$http.get('/api/users').success(
				function(data) {
					// alert("fetching data successful");
					for (var count = 0; count < data.length
							&& !$scope.validUser; count++) {
						// alert("came in");
						if (data[count].UserName === $scope.Email) {
							// alert("email match found");
							if (data[count].Password === $scope.Password) {
								// alert("password match found");
								// alert($scope.validUser);
								$scope.validUser = true;
                                //console.log("Name: ", data[count].FirstName)
								// alert($scope.validUser);
							}
						}
					}
					// alert($scope.validUser);
					if ($scope.validUser) {
						$scope.dashBoardRedirect();
					}
				}).error(function(data, status) {
			alert(status);
			console.log("Get Users Failed");

		});

	}


	$scope.submitEmail = function() {

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
	$scope.dashBoardRedirect = function() {
		window.location.href = "/views/defaultPage.html";
	}

	$scope.registernewUser = function() {
		window.location = "/views/register.html";
	}

	$scope.forgotdetails = function() {
		window.location = "/views/forgotDetailsPage.html";
		//alert("Account Details recovery");
	}

});