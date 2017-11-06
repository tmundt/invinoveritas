/**
 * Created by thomasmundt on 04.01.16.
 */
app.controller('loginCtrl',['$scope', '$http', function($scope,$http) {
    $scope.test = "LOGIN";
    $http.get('/auth/facebook');

}])