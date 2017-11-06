app
.factory('AuthService', ['$http', '$q', function($http, $q) {
    var _identity = undefined;

    // interface
    var service = {
        currentUser: {},
        getCurrentUser: getCurrentUser
    };
    return service;

    //return {
    //    // this function returns the current _identity if defined; otherwise, it retrieves it from the HTTP endpoint
    //    identity: function(setIdentity) {
    //        if (setIdentity) {
    //            _identity = setIdentity;
    //            return;
    //        }
    //
    //        var deferred = $q.defer();
    //
    //        if (angular.isDefined(_identity)) {
    //            deferred.resolve(_identity);
    //            return deferred.promise;
    //        }
    //
    //        $http.get('/currentuser')
    //            .success(function(result) {
    //                _identity = result;
    //                deferred.resolve(_identity);
    //            })
    //            .error(function() {
    //                _identity = undefined;
    //                deferred.reject();
    //            });
    //
    //        return deferred.promise;
    //    }
    //};
    function getCurrentUser() {
        return $http.get('currentuser')
            .success(function(data) {
                service.currentUser = data;
            });
    }

}]);