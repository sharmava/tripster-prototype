// Flag to toggle the Encryption of parameters in the URL of REST service
var encryptionFlag = false;

//Encryption Algorithm
function rot47(x) {
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


function checkFileName(fileName) {
    if (fileName == "") {
        alert("Browse to upload a valid image file");
        return false;
    }
    else if (fileName.split(".")[1].toUpperCase() in imageExtensions) {
        return true;
    }
    else {
        alert("File with " + fileName.split(".")[1] + " is invalid. Upload a valid image file");
        return false;
    }
}

// Image Extensions to validate the file selected by user for upload
var imageExtensions = {
    "JPG" : true,
    "JPEG" : true,
    "GIF" : true,
    "PNG" : true,
    "BMP" : true,
    "ICO" : true,
    "SVG" : true,
    "TIF" : true,
    "TIFF" : true
};


var profile = angular.module("profileModule",[]);

profile.controller("profileController", function($scope,$http){

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
        })


    $http.get('/tripster/notifications')
        .success(function(responseData) {
            if (responseData.error =="Unauthorized User!"){
                alert("Unknown User. Please login and try again!\nRedirecting to Login Page...")
                window.location = "/views/login.html";
                return
            } else{

                var objIndex;
                for (objIndex in responseData ){
                    $scope.notificationContent = responseData[objIndex].notificationMsg
                    $scope.timestamp = responseData[objIndex].CreatedTimeStamp
                    $scope.inRootScope = true
                    $scope.getTimeElapsed($scope.timestamp,function() {
                        $scope.createNotification($scope.notificationContent,$scope.notificationTimeElapsed , $scope.pushNotification)
                    })

                }
            }
        })

    $scope.displayNotificationLimit = 15
    $scope.notificationsList = []


    $scope.pushNotification = function (notification){
        var notificationObj = { "notification" : notification }
        if ( $scope.inRootScope){
            $scope.notificationsList.push(notificationObj)
        }else{
            $scope.$apply( $scope.notificationsList.unshift(notificationObj))
        }

    }

    $scope.createNotification = function (notificationContent, timestamp, callback){
        var newNotification = {
            time : timestamp,
            content : notificationContent
        }
        callback(newNotification)
    }


    // Connecting to the socket and listening for the event 'notification'
    $.getScript('/socket.io/socket.io.js', function()
    {

        io = io.connect()

    // Emit ready event.
        io.emit('ready')

    // Listen for the talk event.
        io.on('notification', function(data) {
            if (data.message.UserName == $scope.UserName) {
                $scope.notificationContent = data.message.notificationMsg
                $scope.timestamp = data.message.CreatedTimeStamp
                $scope.inRootScope = false
                $scope.getTimeElapsed($scope.timestamp, function () {
                    $scope.createNotification($scope.notificationContent, $scope.notificationTimeElapsed, $scope.pushNotification)

                })
            }
        })

    });




    $scope.email = {
        "to"	: $scope.to,
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

    $scope.uploadMyPic = function () {

        var formElement = document.getElementById("uploadForm")

        var imageSelected = formElement.elements.namedItem("image").value

        if (checkFileName(imageSelected)==false){
            return false
        }

        var postUrl='/tripster/uploadPicture';

        if (encryptionFlag==true){
            postUrl+="?uploadUser="+rot47($scope.UserName);
        }else{
            postUrl+="?uploadUser="+$scope.UserName;
        }

        var request = new XMLHttpRequest();
        request.open("POST", postUrl);

        request.onload = function(oEvent) {
            if (request.status == 200 ) {
                var jsonResponse = JSON.parse(request.response)
                var imgPath = jsonResponse['ProfilePicturePath']
                $scope.extractAndSetProfilePicture(imgPath)
            } else {
                alert("Error " + request.status + " occurred uploading your file");
            }
        };

        request.send(new FormData(formElement));

    };

    // Method to check if valid image file has been selected


    $scope.extractAndSetProfilePicture = function (imgPath){
        relativeImgPath = imgPath.slice(imgPath.indexOf('public/')+6)
        document.getElementById("profilePicture").src = relativeImgPath
    }

    // Function to compute elapsed time for notification display
    $scope.getTimeElapsed = function(timestamp, callback){

        var currentTime = new Date();
        //var oldTimeStamp = new Date('Thu April 28 2015 00:14:56 GMT-0600 (CST)')
        var oldTimeStamp = new Date(timestamp)

        // time difference in ms
        var timeDiff = currentTime - oldTimeStamp;

        // strip the miliseconds
        timeDiff /= 1000;

        // get seconds
        var seconds = Math.round(timeDiff % 60);

        // remove seconds from the date
        timeDiff = Math.floor(timeDiff / 60);

        // get minutes
        var minutes = Math.round(timeDiff % 60);

        // remove minutes from the date
        timeDiff = Math.floor(timeDiff / 60);

        // get hours
        var hours = Math.round(timeDiff % 24);

        // remove hours from the date
        timeDiff = Math.floor(timeDiff / 24);

        // the rest of timeDiff is number of days
        var days = timeDiff;

        var years = Math.floor(days/365);
        var months = Math.floor(days/30);

        if (years > 0){
            if (years==1){
                $scope.notificationTimeElapsed = years + " year ago"
            }
            else{
                $scope.notificationTimeElapsed = years+ " years ago"
            }
        }
        else if (months > 0){
            if (months==1){
                $scope.notificationTimeElapsed = months + " month ago"
            }
            else{
                $scope.notificationTimeElapsed = months+ " months ago"
            }
        }
        else if (days > 0){
            if (days==1)
                $scope.notificationTimeElapsed = "Yesterday"
            else
                $scope.notificationTimeElapsed = days + " days ago"
        }
        else if (hours > 0){
            if (hours==1)
                $scope.notificationTimeElapsed = hours + " hour ago"
            else
                $scope.notificationTimeElapsed = hours + " hours ago"
        }
        else if (minutes > 0){
            if (minutes==1)
                $scope.notificationTimeElapsed = minutes + " minute ago"
            else
                $scope.notificationTimeElapsed = minutes + " minutes ago"
        }
        else{
            $scope.notificationTimeElapsed = "Few moments ago"
        }
        callback()
    }

});