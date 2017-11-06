/**
 * Created by thomasmundt on 19.01.16.
 */

var Depot = require('../../models/depot');
exports.create = function(req, res) {
    Depot.create(req.body, function(err, status) {
        console.log(req.body);
        if(err) console.log('SERVER, Fehler beim Speichern: ' + err);
        console.log('SERVER, create, Status: '+ status);
        res.send(status);
    });
}

// showing Database
exports.show = function(req, res) {
    var authorID = req.param('id');
    console.log('SERVER, request for author/id: ' + authorID);
    Depot.find({'author': authorID}, function(error, response) {
        if(error) {
            console.log('SERVER: Fehler beim Laden: ' + error);
        }
        res.send(response);
    });
}

