angular.module('node', [])

.controller('mainController', function($scope, $http) {

    $scope.formData = {};
    $scope.userData = {};
  
    $scope.generateCouponCode = function() {  

        $http.post('http://localhost:3300/generate', $scope.formData,{
              headers : {
                'Content-Type' : 'application/json'
            }
    }).success(function(data) {
                $scope.formData = {};
                $scope.userData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };   

    $scope.shareCouponCode = function(shareData) {

        $scope.formData = shareData;
        $http.post('http://localhost:3300/share', $scope.formData)
            .success(function(data) {
                
                $scope.formData = {};
                $scope.userData = data;
               
                var orderId = Math.floor(Math.random()*1000);
                var orderAmount = Math.floor(Math.random()*1000);

               // Redirect user to second page 
                window.location.href= "second?name="+shareData.name+"&orderId="+orderId+"&orderAmount="+orderAmount;
           
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
         
    };


    $scope.order = function(){

        // This function fetch query parameters from the URL 
        $.urlParam = function(name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            return results[1] || 0;
        }

        var uname = $.urlParam('name'); 
        var amount = $.urlParam('orderId');
        var orderId = $.urlParam('orderAmount');

        $http.get('http://localhost:3300/placeorder?username='+uname+'&amount='+amount+'&orderId='+orderId, $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.userData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    }
});