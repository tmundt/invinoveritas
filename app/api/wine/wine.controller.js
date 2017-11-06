/**
 * Created by thomasmundt on 20.01.16.
 */
//  Logic for calls /api/wine
var endpointUrl = require('../../config').wine.endpointUrl;
exports.show = function(req, res) {
    var search = req.param('id');
    //console.log('SERVER: search is: ' + search);
    //search = "Merlot+2015";

    var request = require('request');
    request(endpointUrl+'search='+ search+'&offset=0&state=CA&sort=price|ascending&instock=true&size=100&filter=categories(124+125+126)', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log('SERVER: Daten erfolgreich erhalten von WINE.com');
            //console.log('SERVER: response von WINE: ' + response);
        }
        if (response) {
            res.json(body);
        }
    })

}