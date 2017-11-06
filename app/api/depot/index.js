/**
 * Created by thomasmundt on 19.01.16.
 */
// API calls for reading/writing user based database

var express = require('express');
var controller = require('./depot.controller');

var router = express.Router();

//router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

module.exports = router;
