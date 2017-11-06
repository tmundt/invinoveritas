/**
 * Created by thomasmundt on 04.01.16.
 * home.controller.js
 * Search for products
 */

app.controller('navCtrl', ['$scope', '$rootScope','$state', '$http', 'AuthService',
    function($scope,$rootScope,$state,$http,AuthService) {

        AuthService.getCurrentUser()
            .success(function(response) {
                console.log('navCtrl in app.js, response:');
                console.log(response);
                $scope.currentUser = response;
                if ($scope.currentUser == null || undefined) {
                    $scope.isLoggedIn = false;
                    console.log('isLoggedIn:' + $scope.isLoggedIn);
                } else {
                    console.log($scope.currentUser.fb.firstName);
                    $scope.isLoggedIn = true;
                    console.log('Log in successfully!');
                }
            })
            .error(function() {
                console.log('error');
            });
        $scope.showCreateEntry = false;
        
        $scope.goDepot = function() {
            $state.go('depot');
        };
        $scope.showCreateForm = function() {
            $rootScope.$broadcast('showCreateForm');
            console.log("navCtrl, showCreateForm()");
        };

        $scope.showUpdateForm = function() {
            $rootScope.$broadcast('showChangeForm');
            console.log("navCtrl, showChangeForm()");
        };

        $scope.deleteEntry = function() {
            $rootScope.$broadcast('showDeleteEntry');
            console.log("navCtrl, showDeleteEntry()");
        };


        $scope.$on('showCreateEntry', function() {
            $scope.showCreateEntry = true;
        });

        $scope.$on('showChangeAndDeleteEntry', function() {
            $scope.showChangeEntry = true;
            $scope.showDeleteEntry = true;
            console.log('showing change button');
        });

}]);

app.controller('homeCtrl',['$scope','$http', 'toastr', function($scope,$http,toastr) {
    $scope.showSpinner = false;
    $scope.spinnerClassName = "active";
    $scope.wineNotFound = true;
    $scope.showResultListLidl = false;
    $scope.showResultListWineCom = false;
    $scope.showUpdateForm = false;
    $scope.searchapi = "winecom";
    $scope.wine ="";
    $scope.searchQueryImportIO = "";
    $scope.wineListResultLidl = [];
    $scope.wineListResultWineCom = [];
    // pagination settings for results
    $scope.totalResults = 0;
    $scope.currentPage = 1;
    $scope.maxSize = 5;

    var resultList = [];
    $scope.sortOfWine = [
        {
            "key": "0",
            "value": "Weinsorte"
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
            "value": "Geschmacksrichtung (alle)"
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


    $scope.priceCategory = [
        {
            "key": "0",
            "value": "Preiskategorie (alle)"
        },
        {
            "key": "1",
            "value": "< 2,50€",
            "encoded": "<+2.50"
        },
        {
            "key": "2",
            "value": "2,50 - 4,99€",
            "encoded": "2.50+-+4.99"
        },
        {
            "key": "3",
            "value": "5,00 - 7,49€",
            "encoded": "5.00+-+7.49"
        },
        {
            "key": "4",
            "value": "7,50 - 9,99€",
            "encoded": "7.50+-+9.99"
        },
        {
            "key": "5",
            "value": "10,00 - 24,99€",
            "encoded": "10.00+-+24.99"
        },
        {
            "key": "6",
            "value": ">= 25,00€",
            "encoded": ">=+25.00"
        },
    ]

    $scope.origin = [
        {
            "key": "0",
            "value": "Herkunftsland (alle)"
        },
        {
            "key": "1",
            "value": "Deutschland"
        },
        {
            "key": "2",
            "value": "Frankreich"
        },
        {
            "key": "3",
            "value": "Italien"
        },
        {
            "key": "4",
            "value": "Spanien"
        },
        {
            "key": "5",
            "value": "Portugal"
        },
        {
            "key": "6",
            "value": "Österreich"
        },
        {
            "key": "7",
            "value": "Chile"
        },
        {
            "key": "8",
            "value": "Griechenland"
        },
        {
            "key": "9",
            "value": "USA"
        },
        {
            "key": "10",
            "value": "Australien"
        },
    ]

    // toggle (show/hide) spinner
    $scope.toggleSpinner = function() {
        if($scope.showSpinner == false) {
            $scope.showSpinner = true;
            $scope.spinnerClassName = "active";
        } else {
            $scope.showSpinner == false;
            $scope.spinnerClassName = "";
        }
    }


    $scope.search = function() {
        //console.log("Zu suchender Wein: " + $scope.wine);
        //$scope.wine = search;
        $http.get('/api/wine/' + $scope.wine)
            .success(function(data) {

                console.log('Daten vom Server (JSON-Format):');
                console.log(data);
                //console.log($scope.data.Products);
                //for(var i in $scope.data) {
                //    if(i.hasOwnProperty($scope.data)) {
                //        console.log(i +': '$scope.data[i]);
                //    }
                //}
                var response  = JSON.parse(data);
                var amountTotal = response.Products.Total;

                var results = response.Products.List;

                var amount = results.length;
                $scope.wineListResultWineCom = [];
                $scope.showResultListWineCom = false;
                $scope.totalResults = amount;
                resultList = [];
                if(amount == 0) {
                    $scope.wineNotFound = true;
                    toastr.info('Die Suche ergab keinen Treffer!',{positionClass: 'toast-top-center'});
                    // goto modal to show no wine found!
                    return 0;
                }
                var name, urlShop, price, sort, vineyardName, vineyardUrl, vineyardImageUrl,
                    appellationName, appellationRegion, shopUrl, misc = "";
                for (var i = 0; i < amount; i++) {
                    name = results[i].Name;
                    price = results[i].PriceRetail;
                    sort = results[i].Varietal.Name;
                    vineyardName = results[i].Vineyard.Name;
                    vineyardUrl = results[i].Vineyard.Url;
                    vineyardImageUrl = results[i].Vineyard.ImageUrl;
                    appellationName = results[i].Appellation.Name;
                    appellationRegion = results[i].Appellation.Region.Name;
                    shopUrl = results[i].Url;
                    if (results[i].ProductAttributes.length > 0) {
                        misc = results[i].ProductAttributes[0].Name;
                    } else {
                        misc = "n/a";
                    }

                    console.log('Name: ' + name);
                    console.log('Preis: ' + price);
                    console.log('Sorte: ' + sort);
                    console.log('Weinberg-Name: ' + vineyardName);
                    console.log('Weinberg-URL: ' + vineyardUrl);
                    console.log('Link zum Bild des Weinbergs: ' + vineyardImageUrl);
                    console.log('Appellation: ' + appellationName);
                    console.log('Appellation/Region: ' + appellationRegion);
                    console.log('Link zum Shop: ' + shopUrl);

                    console.log('Sonstiges: ' + misc);

                    var resultObject = {
                        "name": name,
                        "price": price,
                        "sort": sort,
                        "vineyardName": vineyardName,
                        "vineyardUrl": vineyardUrl,
                        "vineyardImageUrl": vineyardImageUrl,
                        "appellationName": appellationName,
                        "appellationRegion": appellationRegion,
                        "shopUrl": shopUrl,
                        "misc": misc
                    }

                    resultList.push(resultObject);

                }

                // Fehler anzeigen falls keine Weine gefunden wurden
                if(amount == 0) {
                    $scope.wineNotFound = true;
                } else {
                    console.log('Anzahl aller gefundenen Weine: ' + amountTotal);
                    console.log('Anzahl der Produkte in Liste: ' + amount);
                    if(!$scope.$$phase) {
                        $scope.$apply(function() {
                            $scope.wineListResultWineCom = resultList;
                            console.log("SCOPE APPLY!");
                        });
                    } else {
                        $scope.wineListResultWineCom = resultList;
                        $scope.showResultListWineCom = true;
                    }

                    console.log('$scope.wineListResultWineCom.length:' + $scope.wineListResultWineCom.length);

                }
            })
            .error(function(error) {
                console.log('Error while searching for wines: ' + error.statusCode);

            });
    }

    // Resets all select fields to zero/no selection
    $scope.resetSearch = function() {
        $scope.selectedSort = "0";
        $scope.selectedTaste = "0";
        $scope.selectedPrice = "0";
        $scope.selectedCountry = "0";
        $scope.totalResults = 0;
        $scope.showResultListLidl = false;
    }

    $scope.searchLidl = function() {
        $scope.toggleSpinner();
        console.log('Sort of wine: ' + $scope.sortOfWine[$scope.selectedSort].value);

        // check if first select-field is selected (sort)
        // if not refuse search (no search possible without sort of wine)
        if($scope.selectedSort =="0") {
            toastr.warning('Bitte die Sorte bestimmen!','Suche nicht möglich');
            return 0;
        }

        // assemble query string for search with importIO

        //var baseUrl = "http%3A%2F%2Fwww.lidl.de%2Fde%2Fsearch%3Fquery%3D*%26filterType%3DProdukte%26";
        var baseUrl = "";
        //var sort, price, taste, country = "0";

        baseUrl += "filterWeinart%3D"+ $scope.sortOfWine[$scope.selectedSort].value;
        //sort = $scope.sortOfWine[$scope.selectedSort].value;

        if($scope.selectedTaste != "0") {
            console.log('homeCtrl, searchLidl(), selectedTaste !=0');
            baseUrl += '%26filterGeschmacksrichtung%3D'+ $scope.taste[$scope.selectedTaste].value;
            //taste = $scope.taste[$scope.selectedTaste].value;
        }
        if($scope.selectedPrice != "0") {
            console.log('homeCtrl, searchLidl(), selectedPrice !=0');
            baseUrl += '%26filterPrice%3D'+ $scope.priceCategory[$scope.selectedPrice].encoded;
            //price = $scope.priceCategory[$scope.selectedPrice].value
        }
        if($scope.selectedCountry != "0") {
            console.log('homeCtrl, searchLidl(), selectedCountry !=0' + $scope.origin[$scope.selectedCountry].value);
            baseUrl += '%26filterHerkunft%3D'+ $scope.origin[$scope.selectedCountry].value;
            //country = $scope.origin[$scope.selectedCountry].value;
        }

        //var queryTaste="filterGeschmacksrichtung="+$scope.taste[$scope.selectedTaste].value;
        //var queryPriceCategory="filterPrice="+$scope.priceCategory[$scope.selectedPrice].value;
        //var queryOrigin="filterHerkunft"+$scope.origin[$scope.selectedCountry].value;

        //var searchQuery = baseUrl+querySort+"%26"+queryTaste+"%26"+queryPriceCategory+"%26"+queryOrigin;
        //var search2 = baseUrl+querySort;

        console.log("searchQuery: " + baseUrl);

        $http.get('/api/importio/lidl/' + baseUrl)
        //$http.get('/api/importio/lidl/' + sort +"/"+taste+"/"+"price"+"/"+country)
            .success(function(data) {
                console.log('Daten vom Server (JSON-Format):');
                console.log(data);
                var response  = JSON.parse(data);
                var name = "";

                var results = response.tables[0].results;

                var amount = results.length;
                $scope.wineListResultLidl = [];
                $scope.showResultListLidl = false;
                resultList = [];
                for (var i = 0; i < amount; i++) {
                    if(response.tables[0].results[i].descheightstrong_value != undefined||"") {
                        name = response.tables[0].results[i].descheightstrong_value;
                        $scope.wineNotFound = false;
                    } else if (response.tables[0].results[i].descheight_value != undefined||""||null) {
                        name = response.tables[0].results[i].descheight_value;
                        $scope.wineNotFound = false;
                    } else {
                        //name = "KEIN WEIN GEFUNDEN";
                        $scope.wineNotFound = true;
                    }

                    // If wine is found, search for more values: price, origin, area and taste
                    if ($scope.wineNotFound == false) {
                        $scope.totalResults = amount;
                        // Add data to resultList
                        // price info
                        var priceEuro;
                        var priceCent;
                        // misc info like origin, growing-area and taste
                        if(response.tables[0].results[i].priceheightbold_number != undefined||""||null) {
                            priceEuro = response.tables[0].results[i].priceheightbold_number;
                        } else if(response.tables[0].results[i].priceheight_number_3 != undefined||""||null) {
                            priceEuro = response.tables[0].results[i].priceheight_number_3;
                        } else {
                            console.warn('KEIN PREIS in Euro GEFUNDEN!');
                        }

                        if(response.tables[0].results[i].priceheightsup_number != undefined||""||null) {
                            priceCent = response.tables[0].results[i].priceheightsup_number
                        } else if(response.tables[0].results[i].priceheight_number_4  != undefined||""||null) {
                            priceCent = response.tables[0].results[i].priceheight_number_4;
                        } else {
                            console.warn('KEIN PREIS in Cent GEFUNDEN!');
                        }
                        // assemble to price to a float value
                        var price = parseFloat(priceEuro.toString().concat(".").concat(priceCent.toString()));

                        var additonalInfo;
                        var area, origin, taste, description = "";
                        //check if additional information present
                        if(response.tables[0].results[i].descheighttext_value != undefined||""||null) {
                            var infoString = response.tables[0].results[i].descheighttext_value;
                            // check type of additional info
                            if(~infoString.indexOf("Herkunft")) {
                                additonalInfo = infoString.split(" ");
                                console.log("additonalInfo: " + additonalInfo);
                                area = additonalInfo[3];
                                origin = additonalInfo[1];
                                taste = additonalInfo[5];
                                description = "keine";
                                if(area == ""||origin==""||taste=="") {
                                    area, origin, taste = "unbekannt";
                                }
                            } else {
                                description = infoString;
                                area = "unbekannt";
                                origin = "unbekannt";
                                taste = "unbekannt";
                            }
                        }

                        // note url to image
                        var imageUrl = "";
                        if(response.tables[0].results[i].producttrack_image != undefined||""||null) {
                            imageUrl = response.tables[0].results[i].producttrack_image;
                        }

                        var shopUrl = "";
                        if(response.tables[0].results[i].producttrack_link != undefined||""||null) {
                            shopUrl = response.tables[0].results[i].producttrack_link;
                        }

                        var resultObject = {
                            "name": name,
                            "price": price,
                            "origin": origin,
                            "area": area,
                            "taste": taste,
                            "description": description,
                            "imageUrl": imageUrl,
                            "shopUrl": shopUrl
                        }

                        resultList.push(resultObject);
                        //$scope.wineListResultLidl.push(resultObject);
                        console.log('Name: ');
                        console.log(name);
                        console.log('Preis: ' + price);
                        if(origin||area||taste) {
                            console.log('Herkunft:' + origin + ', Anbaugebiet: ' + area + ', Geschmack: ' + taste);
                        } else {
                            console.log('Bemerkungen: ' + description);
                        }
                        if(imageUrl) {
                            console.log('URL zum Bild: ' + imageUrl);
                        }
                        if(shopUrl) {
                            console.log('URL zum Shop: ' + shopUrl);
                        }

                        console.log('$scope.totalResults' + $scope.totalResults);


                    }
                }
                if ($scope.wineNotFound == false) {
                    console.log('Anzahl gefundener Weine: ' + amount);
                    console.log('response.tables: ');
                    //console.log(response.tables[0].results);
                    if(!$scope.$$phase) {
                        $scope.$apply(function() {
                            $scope.wineListResultLidl = resultList;
                            console.log("SCOPE APPLY!");
                        });
                    } else {
                        $scope.wineListResultLidl = resultList;
                        $scope.showResultListLidl = true;
                    }



                } else {
                    console.log('Keinen Wein gefunden!');
                    toastr.info('Die Suche ergab keinen Treffer!',{positionClass: 'toast-top-center'});
                }




        })
            .error(function(error) {
                console.log('Error while searching for wines: ' + error.statusCode);

            });

    }

    $scope.selectionChanged = function() {
        //console.log('home.controller.js, selectedSort(sort): sort: ' + $scope.sortOfWine[sort].value);
        console.log('home.controller.js, selectedSortChanged(), sort: ' + $scope.sortOfWine[$scope.selectedSort].value);
        console.log('home.controller.js, selectedSortChanged(), taste: ' + $scope.taste[$scope.selectedTaste].value);
        console.log('home.controller.js, selectedSortChanged(), sort: ' + $scope.priceCategory[$scope.selectedPrice].value);
        console.log('home.controller.js, selectedSortChanged(), sort: ' + $scope.origin[$scope.selectedCountry].value);
    }

}])