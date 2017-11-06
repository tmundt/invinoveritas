/**
 * Created by thomasmundt on 06.02.16.
 */

// API calls to /api/importio
// for requesting info for wine at lidl.de with import.io
var express = require('express');
var controllerLidl = require('./importio.lidl.controller');

var router = express.Router();

router.get('/lidl/:id', controllerLidl.show);
//router.get('/lidl/:sort/:taste/:price/:country', controllerLidl.show);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
