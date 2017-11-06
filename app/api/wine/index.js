/**
 * Created by thomasmundt on 20.01.16.
 */
// API calls to /api/wine
// for requesting info for wine
var express = require('express');
var controller = require('./wine.controller');

var router = express.Router();

//router.get('/', controller.index);
router.get('/:id', controller.show);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;