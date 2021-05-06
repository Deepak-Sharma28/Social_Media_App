const Router = require('express').Router();
const Jwt = require('jsonwebtoken');


require('./controller/api')(Router);







module.exports = Router;