/**
 * Created by thomasmundt on 04.01.16.
 */
app.controller('depotCtrl',['$scope','$rootScope','$http','$state','currentUser','toastr', function($scope,$rootScope ,$http, $state, currentUser, toastr) {
    $scope.isLoggedIn = false;
    $scope.hasData = false;
    $scope.currentUser = currentUser.data;
    $scope.showCreateForm = false;
    $scope.showChangeForm = false;
    $scope.showResultList = false;
    $scope.resultDepotList;
    $scope.currentPage = 1;
    $scope.wine = {};
    console.log('depotCtrl, $scope.currentUser: ');
    console.log($scope.currentUser);

    //get Data from User/Creator
    $scope.getData = function (author) {
        console.log('$scope.getData...');
        $http.get('/api/depot/' + author).then(function(response) {
            console.log('Daten erhalten');
            console.log(response);
            $scope.resultDepotList = response.data;
            $scope.totalResults = $scope.resultDepotList.length;
            console.log('Laenge der Ergebnisse: ' + $scope.totalResults);
            if($scope.totalResults == 0) {
                $scope.showResultList = false;
                $scope.hasData = false;
                toastr.info('Noch keine Weine im Depot eingetragen.')
            } else {
                $scope.showResultList = true;
                $scope.hasData = true;
                $scope.showCreateForm = false;

                //allow changing and deletingdata: show dropdown button
                $rootScope.$broadcast('showChangeAndDeleteEntry');
            }

            // set options for dropdown menu "Mein Weindepot"
            // options: create, update and delete (last two if entries present/shown)
            // howto: change properties like "showCreateOption, showUpdateOption, showDeleteOption
            // howto: props show be defined in navCtrl (is parent scope of this controller)


        }, function(error) {
            console.log("Fehler beim Laden, error: " + error);
        })
    };

    if ($scope.currentUser == null || undefined) {
        $scope.isLoggedIn = false;
        toastr.error('Bitte melden Sie sich an!','Keine Berechtigung')
        console.log('User not logged in!');
        //$scope.showCreateEntry = false;
    } else {
        // User present = show loggend in user
        $scope.isLoggedIn = true;
        console.log('Logged in user: ' + $scope.currentUser.fb.firstName);

        // Allowing creating of entries
        $rootScope.$broadcast('showCreateEntry');
        $scope.wine.author = $scope.currentUser._id;
        console.log('$scope.wine.author: ' + $scope.wine.author +', Typ: ' + typeof $scope.wine.author);
        $scope.getData($scope.wine.author);
    }

    // if $scope.isLoggedIn = false : no rights!
    // Show modal if user is not logged in and offer return to homeview
    $scope.hasData = false;

    var reload = function() {
        $state.reload('depot');
    }

    $scope.$on('showCreateForm', function(event, data) {
        $scope.showCreateForm = true;
        $scope.showResultList = false;
    });

    $scope.$on('showChangeForm', function(event, data) {
        
        $scope.showChangeForm = true;
        $scope.showCreateForm = true;
        $scope.showResultList = false;

    });

    $scope.$on('showDeleteEntry', function(event, data) {
        toastr.remove();
        toastr.warning("Diesen Eintrag wirklich löschen?", "Eintrag löschen", {positionClass: "toast-top-center",timeOut: 0});
        //alert("Do you really want to delete the entry?");
    });


    $scope.sortOfWine = [
        {
            "key": "0",
            "value": "Sorte wählen"
        },
        {
            "key": "1",
            "value": "Rotwein"
        },
        {
            "key": "2",
            "value": "Weißwein"
        },
        {
            "key" : "3",
            "value": "Roséwein"
        }
    ];

    $scope.taste = [
        {
            "key": "0",
            "value": "Geschmack wählen"
        },
        {
            "key": "1",
            "value": "trocken"
        },
        {
            "key": "2",
            "value": "halbtrocken"
        },
        {
            "key": "3",
            "value": "lieblich"
        }
    ]


    console.log('depot.controller, $scope.showCreateButton: ' + $scope.showCreateButton);

    $scope.reset = function() {
        reload();
    }



    $scope.submitData = function(valid) {
        //console.log("Formulargültigkeit ist: " + valid);
        if(valid == false) {
            console.log('Formular ungültig, keine Speicherung!');
            toastr.error('Bitte fehlende Eingaben ergänzen!','Unvollständige Angaben',{positionClass: 'toast-top-center'});
            return 0;
        }
        // Putting select fields into real values
        // TODO: redo because of updating an entry
        if($scope.showChangeForm) {
            console.log("Changing data!");

        }
        $scope.wine.sort = $scope.sortOfWine[$scope.wine.selectedSort].value;
        $scope.wine.taste = $scope.taste[$scope.wine.selectedTaste].value;
        console.log('Sorte: ' + $scope.wine.sort + ', Geschmack: ' + $scope.wine.taste);
        console.log('Daten:');

        console.log($scope.wine);
        //console.log('Bemerkungen: ' + $scope.remarks);

        // Add author to object to identify creator

        $http.post('/api/depot', $scope.wine).then(function(response) {
            console.log('CLIENT: Saving data, result is: ');
            console.log(response);
            // hide create form
            $scope.showCreateForm = false;
            toastr.success('Der Eintrag wurde gespeichert!', {positionClass: 'toast-top-center'});
            // Show depot after saving
            reload();
        },
        function(error) {

            console.log("error: " + error);
        })


    }
}]);
