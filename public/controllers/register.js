// Flag to toggle the Encryption of parameters in the URL of REST service
var encryptionFlag = false;

//Get all URL param
function getAllURLParameters() {
    var params = window.location.search.substr(1).split('&');
    var allURLParams = {}
    for (var i = 0; i < params.length; i++) {
        var p=params[i].split('=');
        if (encryptionFlag==true){
            allURLParams[p[0]] = rot47(decodeURIComponent(p[1]));
        }else{
            allURLParams[p[0]] = decodeURIComponent(p[1]);
        }
    }
    return allURLParams;
}

//Encryption Algorithm
function rot47(x)
{
    if (x==null){
        return null
    }
    var s = [];
    for (var i = 0; i < x.length; i ++)
    {
        var j = x.charCodeAt(i);
        if ((j >= 33) && (j <= 126))
        {
            s[i] = String.fromCharCode(33 + ((j + 14) % 94));
        }
        else
        {
            s[i] = String.fromCharCode(j);
        }
    }
    return s.join('');
}

var allURLParams = getAllURLParameters();

var registerPage = angular.module('registerPage', []);

registerPage.controller('newUserController', function($scope, $http){

    // UserDetails will hold all the input field content from the html page
    $scope.FirstName = '';
    $scope.LastName = '';
    $scope.UserName1 = '';
    $scope.UserName= '';
    $scope.Password1 = '';
    $scope.Password = '';
    $scope.DoB = '';
    $scope.Phone = '';
    $scope.Address = '';
    $scope.City = '';
    $scope.State = '';
    $scope.Country = '';
    $scope.CreatedTimeStamp = '';
    $scope.UpdatedTimeStamp = '';
    $scope.Friends = [];
    $scope.invitedBy=allURLParams['invited_by'];
    $scope.inviterExists = false;

    // $scope.EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

    $scope.userDetails = {  "FirstName"	: $scope.FirstName,
        "LastName"	: $scope.LastName,
        "UserName"	: $scope.UserName,
        "Password"	: $scope.Password,
        "DoB"		: $scope.DoB,
        "Phone"		: $scope.Phone,
        "Address"	: $scope.Address,
        "City"		: $scope.City,
        "State"		: $scope.State,
        "Country"	: $scope.Country,
        "Friends"   : $scope.Friends,
        "CreatedTimeStamp" :$scope.CreatedTimeStamp,
        "UpdatedTimeStamp" :$scope.UpdatedTimeStamp};

    $scope.userList = [];



    $scope.verifyInviterAndAddFriend = function(inviter){

        if (encryptionFlag==true){
            $scope.checkUserURL = '/tripster/checkusername?username='+rot47(inviter)
        }else{
            $scope.checkUserURL = '/tripster/checkusername?username='+inviter
        }

        $http.get($scope.checkUserURL)
            .success(function(data) {
                if (data['count'] > 0){
                    $scope.inviterExists=true
                    $scope.userDetails.Friends.push(inviter)
                    $scope.inviterName = data['name']
                    //console.log("Friends "+$scope.userDetails.Friends)
                }
                else{
                    $scope.inviterExists=false
                }
            })
            .error(function(data){
                console.log("Get Users Failed");
            });
    };

    if ($scope.invitedBy!=null){
        $scope.verifyInviterAndAddFriend($scope.invitedBy);
    }


    $scope.checkUserName = function(){

        if (encryptionFlag==true){
            $scope.checkUserURL = '/tripster/checkusername?username='+rot47($scope.UserName1)
        }else{
            $scope.checkUserURL = '/tripster/checkusername?username='+$scope.UserName1
        }


        $http.get($scope.checkUserURL)
            .success(function(data) {
                if (data['count'] > 0){
                    $scope.username_taken=true
                    document.getElementById("username1").$invalid=true;
                    $scope.registerForm.username1.$setValidity("user-taken-error",false);
                }
                else{
                    $scope.registerForm.username1.$setValidity("user-taken-error",true);
                    $scope.username_taken=false
                }
            })
            .error(function(data){
                console.log("Get Users Failed");

            });
    };

    $scope.validateForm = function(){
        return true;
        /*        if ($scope.UserName1 != $scope.userDetails.UserName){
         $scope.registerForm.$valid!=false;
         alert("The two Username fields do not match !");
         return false;
         }

         if ($scope.Password1 !=  $scope.userDetails.Password )
         console.log("p1"+$scope.Password1)
         console.log("p2"+$scope.userDetails.Password )
         console.log("com"+ ($scope.Password1 === $scope.userDetails.Password) )
         console.log("validity"+            $scope.registerForm.$valid);
         $scope.registerForm.$valid=false
         alert("The two Password fields do not match !")
         return false;
         if ($scope.registerForm.$valid!=true){
         alert("Error on registration form! Please fill carefully")
         return false;
         }*/

    }

    $scope.createUser = function(){
        if ($scope.DoB === ''){
            $scope.userDetails.DoB = new Date();
        }

        $scope.userDetails.CreatedTimeStamp = new Date();
        $scope.userDetails.UpdatedTimeStamp = new Date();

        var postUrl='/tripster/users';
        if ( $scope.inviterExists == true){
            if (encryptionFlag==true){
                postUrl+="?invited_by="+rot47($scope.invitedBy);
            }else{
                postUrl+="?invited_by="+$scope.invitedBy;
            }
        }

         function registerUser(){
            $http.post(postUrl,$scope.userDetails)
                .success(function(data) {
                    createNotification()
                })
                .error(function(data){
                    resultFunction('userRegistrationError')
                });
        }

        function createNotification(){

            if ( $scope.inviterExists == true){
                if (encryptionFlag==true){
                    var invited_by= rot47($scope.invitedBy);
                }else{
                    var invited_by= $scope.invitedBy;
                }

                // post notification with body
                var username = $scope.userDetails.UserName
                var msg = "Welcome " + $scope.userDetails.FirstName +"! You have joined Tripster"
                $scope.createNotification (username, msg, resultFunction)


                // post notification with body
                var username = invited_by
                var msg1 = $scope.userDetails.FirstName +" ("+$scope.userDetails.UserName +") joined Tripster"
                $scope.createNotification (username, msg1, resultFunction)

                // post notification with body
                var username = invited_by
                var msg2 = "You are now friends with " + $scope.userDetails.FirstName +" ("+$scope.userDetails.UserName +")"
                $scope.createNotification (username, msg2, resultFunction)

                // post notification with body
                var username = $scope.userDetails.UserName
                var msg = "You are now friends with " + $scope.inviterName  +" ("+invited_by +")"
                $scope.createNotification (username, msg, finalResultFunction)

            }
            else{
                // post notification with body
                var username = $scope.userDetails.UserName
                var msg = "Welcome " + $scope.userDetails.FirstName +"! You have joined Tripster"
                $scope.createNotification (username, msg, finalResultFunction)
            }

        }

        $scope.createNotification = function(username, notificationMsg, callback){
            var notificationBody = {}
            notificationBody.UserName = username
            notificationBody.notificationMsg = notificationMsg

            $http.post('/tripster/notifications', notificationBody)
                .success(function(data) {
                    console.log("Created Notificaiton: "+ notificationBody);
                    callback(true)
                })
                .error(function(data){
                    console.log("Error Creating Notificaiton: "+ notificationBody);
                    callback(false)
                });

        }


        function resultFunction(flag){
            return flag
        }

        function finalResultFunction(flag){

            if (flag == false){
                alert("Error with registration!\nPlease try again.")
                console.log("Error in Registration !");
                return false
            }
            else if (flag == true){
                console.log("Registration Complete !");
                alert("Registration Complete. Welcome "+$scope.userDetails.FirstName+"! \nYou can now login with your new credentials")
                window.location.href = "/";
            }
        }

        registerUser(resultFunction)

    };


    $scope.resetForm = function(){
        $scope.userDetails = {};
        $scope.userList = [];
    };


});


/*

 registerPage.directive('pwCheck',function(){
 return function(scope,element, attrs, ctrl){
 console.log("From pwcheck: "+scope.userDetails);
 var me = attrs.ngModel;
 var matchTo = attrs.username2
 scope.$watch('[me,matchTo]', function(value){
 ctrl.$setValidity('pwmatch',scope[me]===scope[matchTo]);
 console.log("UserName1: "+scope[me]);
 });
 }

 });

 registerPage.directive('pwCheck',function(){
 //console.log("printed from retype-check");
 return {
 require: 'ngModel',
 link: function(scope, elem, attrs, ctrl){
 var me = attrs.ngModel;
 var matchTo = attrs.pwCheck;

 $scope.$watch('[me,matchTo]', function(value){
 ctrl.$setValidity('pwmatch',scope[me] === scope[matchTo]);
 });
 }
 }
 });
 */